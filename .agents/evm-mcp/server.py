import os
import sys
import json
import psycopg
import requests
import subprocess
from fastmcp import FastMCP

SESSION_TOKEN = None
BACKEND_URL = "http://localhost:8080"
API_URL = f"{BACKEND_URL}/api/v1"
DB_CONN_STR = "dbname=evmanager user=postgres password=postgres host=localhost port=5434"

def format_response(success: bool, status_code: int, data: any = None, error: str = None, message: str = "") -> str:
    resp = {
        "success": success,
        "status_code": status_code,
        "data": data,
        "error": error,
        "message": message
    }
    return json.dumps(resp, default=str)

def check_environment():
    try:
        with psycopg.connect(DB_CONN_STR, connect_timeout=3) as conn:
            with conn.cursor() as cur:
                cur.execute("SHOW data_directory;")
                res = cur.fetchone()[0].lower()
                if 'prod' in res or 'production' in res:
                    print("Production database detected based on PG_DATA. Aborted.", file=sys.stderr)
                    sys.exit(1)
    except Exception as e:
        print(f"Failed to connect to local database: {e}", file=sys.stderr)
        sys.exit(1)

    yml_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend", "src", "main", "resources", "application.yml")
    if os.path.exists(yml_path):
        with open(yml_path, 'r', encoding='utf-8') as f:
            content = f.read().lower()
            if 'active: prod' in content or 'active: "prod"' in content:
                print("Spring active profile 'prod' detected. Aborted.", file=sys.stderr)
                sys.exit(1)

    try:
        subprocess.run(["mvn", "-v"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except Exception:
        print("Maven (mvn) not found in PATH", file=sys.stderr)

check_environment()

mcp = FastMCP("EVManagerMCP_Strict")

@mcp.tool()
def login(username: str, password: str) -> str:
    global SESSION_TOKEN
    try:
        resp = requests.post(f"{API_URL}/auth/login", json={"usernameOrEmail": username, "password": password}, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            SESSION_TOKEN = data.get("accessToken")
            if not SESSION_TOKEN:
                return format_response(False, 200, None, "No token found in response", "Login failed")
            return format_response(True, 200, None, None, "Login success. Token stored in memory.")
        return format_response(False, resp.status_code, None, resp.text, "Login rejected")
    except Exception as e:
        return format_response(False, 500, None, str(e), "Request failed")

@mcp.tool()
def api_request(method: str, path: str, body: dict = None) -> str:
    global SESSION_TOKEN
    if not path.startswith("/"):
        path = "/" + path
    url = f"{API_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if SESSION_TOKEN:
        headers["Authorization"] = f"Bearer {SESSION_TOKEN}"
        
    try:
        resp = requests.request(method, url, json=body, headers=headers, timeout=10)
        try:
            data = resp.json()
        except:
            data = resp.text
        return format_response(resp.ok, resp.status_code, data, None if resp.ok else data, "Request completed")
    except requests.exceptions.Timeout:
        return format_response(False, 504, None, "Timeout", "Request timed out")
    except requests.exceptions.RequestException as e:
        return format_response(False, 500, None, str(e), "Request failed")

@mcp.tool()
def db_query(query: str) -> str:
    q_lower = query.lower().strip()
    if not (q_lower.startswith("select ") or q_lower.startswith("show ") or q_lower.startswith("describe ") or q_lower.startswith("explain ")):
         return format_response(False, 400, None, "Forbidden query", "Only SELECT/SHOW/DESCRIBE are allowed")
    
    dangerous = ["insert", "update", "delete", "drop", "alter", "truncate", "grant", "revoke", "commit", "rollback"]
    for word in dangerous:
        if f" {word} " in q_lower or q_lower.startswith(f"{word} ") or f";{word} " in q_lower:
            return format_response(False, 400, None, "Dangerous keyword found", "Query blocked by SQL filter")

    try:
        with psycopg.connect(DB_CONN_STR, connect_timeout=5) as conn:
            conn.read_only = True
            with conn.cursor() as cur:
                cur.execute("SET statement_timeout = 5000;")
                cur.execute(query)
                if not cur.description:
                    return format_response(True, 200, [], None, "Query executed, no rows")
                
                columns = [desc[0] for desc in cur.description]
                rows = cur.fetchmany(100) # Only fetch 100 max
                
                result = []
                for row in rows:
                    row_dict = dict(zip(columns, row))
                    for k in row_dict.keys():
                        k_low = k.lower()
                        if 'password' in k_low or 'hash' in k_low or 'secret' in k_low or 'jwt' in k_low:
                            row_dict[k] = "***MASKED***"
                    result.append(row_dict)
                return format_response(True, 200, result, None, f"Returned {len(result)} rows (Max 100)")
    except Exception as e:
        return format_response(False, 500, None, str(e), "Query failed")

@mcp.tool()
def check_booking_conflict(venue_id: int, start_time: str, end_time: str) -> str:
    # Prefer Backend BE-13 API
    api_res_str = api_request("GET", f"/venues/{venue_id}/conflicts?startTime={start_time}&endTime={end_time}")
    api_res = json.loads(api_res_str)
    if api_res["success"] or api_res["status_code"] != 404:
        return api_res_str # Return API result if endpoint exists and handles it

    # Fallback to precise DB query simulating BE-13
    query = f"""
        SELECT event_id, event_name, status, start_at, end_at 
        FROM events 
        WHERE venue_id = {venue_id} 
          AND status != 'CANCELED' 
          AND status != 'DELETED'
          AND DATE(start_at) = DATE('{start_time}')
          AND start_at < '{end_time}'::timestamp + interval '60 minutes'
          AND end_at > '{start_time}'::timestamp - interval '60 minutes'
    """
    db_res_str = db_query(query)
    try:
        res = json.loads(db_res_str)
        if not res["success"]:
            return db_res_str
        data = res["data"]
        if isinstance(data, list) and len(data) > 0:
             return format_response(False, 409, data, "Conflict detected", f"Found {len(data)} overlapping events with buffer")
        return format_response(True, 200, [], None, "No conflict detected in DB fallback")
    except Exception as e:
        return format_response(False, 500, None, str(e), "Error processing fallback conflict check")

@mcp.tool()
def run_backend_test(test_class: str, test_method: str = None) -> str:
    cwd = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend")
    test_arg = f"{test_class}#{test_method}" if test_method else test_class
    cmd = ["mvn.cmd", "test", f"-Dtest={test_arg}"]
    try:
        result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=120)
        output = result.stdout
        lines = output.split('\\n')
        summary = [line for line in lines if "Tests run:" in line or "BUILD" in line or "ERROR" in line or "FAIL" in line]
        is_success = result.returncode == 0
        return format_response(is_success, 200 if is_success else 500, summary, "Test failed" if not is_success else None, "Test run complete")
    except subprocess.TimeoutExpired:
        return format_response(False, 504, None, "Test timed out after 120s", "Timeout")
    except Exception as e:
        return format_response(False, 500, None, str(e), "Error running test")

@mcp.tool()
def read_backend_logs(lines: int = 100, level: str = None, keyword: str = None) -> str:
    log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend", "logs", "spring.log")
    if not os.path.exists(log_path):
        return format_response(False, 404, None, "Log file not found", f"Path: {log_path}")
    try:
        with open(log_path, 'r', encoding='utf-8') as f:
            all_lines = f.readlines()
        if level:
            all_lines = [line for line in all_lines if f" {level.upper()} " in line]
        if keyword:
            all_lines = [line for line in all_lines if keyword.lower() in line.lower()]
            
        selected = "".join(all_lines[-lines:])
        import re
        selected = re.sub(r'ey[a-zA-Z0-9_-]+\.ey[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+', '***JWT***', selected)
        selected = re.sub(r'(?i)(password|secret|authorization)[:=]\\s*"?\\S+"?', '\\1=***', selected)
        return format_response(True, 200, selected, None, f"Returned {min(len(all_lines), lines)} lines")
    except Exception as e:
        return format_response(False, 500, None, str(e), "Error reading logs")

if __name__ == "__main__":
    mcp.run(transport='stdio')
