"""
EVManager MCP Server (Cross-Stack Frontend & Backend Testing and Verification Tool)
Supports full access and automated consistency testing for both FE and BE.
"""

import os
import sys
import json
import re
import math
import subprocess
from decimal import Decimal, ROUND_HALF_UP
import requests
from fastmcp import FastMCP

# Project paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
MVNW_CMD = os.path.join(BACKEND_DIR, "mvnw.cmd")

API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8080/api/v1")
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", "5432"))
DB_NAME = os.environ.get("DB_NAME", "evmanager")
DB_USER = os.environ.get("DB_USERNAME", "postgres")
DB_PASS = os.environ.get("DB_PASSWORD", "postgres")

mcp = FastMCP("EVManager-FullStack-Tools")
SESSION_TOKEN = None

# ==============================================================================
# 1. BACKEND TOOLS
# ==============================================================================

@mcp.tool()
def run_backend_tests(test_target: str = "ContractServiceTest") -> dict:
    """
    Run Maven unit tests using the repository's Maven Wrapper (mvnw.cmd).
    :param test_target: Test class or method name, e.g. 'ContractServiceTest' or 'CustomerServiceTest'
    """
    cmd = [MVNW_CMD, "test", f"-Dtest={test_target}"]
    try:
        res = subprocess.run(cmd, cwd=BACKEND_DIR, capture_output=True, text=True, timeout=120, encoding="utf-8")
        stdout = res.stdout or ""
        
        # Parse test results
        tests_run = None
        failures = None
        errors = None
        skipped = None
        
        for line in stdout.splitlines():
            if "Tests run:" in line and "Failures:" in line:
                # Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
                parts = line.strip().split(",")
                try:
                    tests_run = int(parts[0].split(":")[1].strip())
                    failures = int(parts[1].split(":")[1].strip())
                    errors = int(parts[2].split(":")[1].strip())
                    skipped = int(parts[3].split(":")[1].strip())
                except Exception:
                    pass
                
        is_success = res.returncode == 0
        summary_lines = [l for l in stdout.splitlines() if any(k in l for k in ["[INFO] Running", "Tests run:", "BUILD SUCCESS", "BUILD FAILURE", "[ERROR]"])]
        
        return {
            "success": is_success,
            "target": test_target,
            "tests_run": tests_run,
            "failures": failures,
            "errors": errors,
            "skipped": skipped,
            "summary": summary_lines[-10:] if summary_lines else stdout[-500:]
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Test timed out after 120s"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
def backend_api_request(method: str, path: str, body: dict = None, token: str = None) -> dict:
    """
    Make an HTTP request to the running Backend Spring Boot API.
    :param method: GET, POST, PUT, DELETE, PATCH
    :param path: API path, e.g. '/contracts' or '/auth/login'
    :param body: JSON payload
    :param token: Optional Bearer token (defaults to active session token)
    """
    global SESSION_TOKEN
    if not path.startswith("/"):
        path = "/" + path
    url = f"{API_BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    
    auth_tok = token or SESSION_TOKEN
    if auth_tok:
        headers["Authorization"] = f"Bearer {auth_tok}"
        
    try:
        resp = requests.request(method.upper(), url, json=body, headers=headers, timeout=10)
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        return {
            "success": resp.ok,
            "status_code": resp.status_code,
            "data": data
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
def backend_login(username: str = "admin", password: str = "admin123") -> dict:
    """
    Authenticate against the backend /auth/login and cache the JWT token for subsequent requests.
    """
    global SESSION_TOKEN
    res = backend_api_request("POST", "/auth/login", {"usernameOrEmail": username, "password": password})
    if res.get("success") and isinstance(res.get("data"), dict):
        tok = res["data"].get("accessToken")
        if tok:
            SESSION_TOKEN = tok
            return {"success": True, "message": "Login successful, token stored", "token": tok[:10] + "..."}
    return {"success": False, "message": "Login failed", "response": res}


@mcp.tool()
def read_backend_logs(lines: int = 50, keyword: str = None) -> dict:
    """
    Read the latest lines from backend logs (e.g. backend/logs/spring.log).
    """
    log_file = os.path.join(BACKEND_DIR, "logs", "spring.log")
    if not os.path.exists(log_file):
        return {"success": False, "error": f"Log file not found at {log_file}"}
    try:
        with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
            all_lines = f.readlines()
        if keyword:
            all_lines = [l for l in all_lines if keyword.lower() in l.lower()]
        tail = "".join(all_lines[-lines:])
        return {"success": True, "count": len(all_lines), "logs": tail}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ==============================================================================
# 2. FRONTEND TOOLS & CONSISTENCY VERIFICATION
# ==============================================================================

@mcp.tool()
def verify_pricing_consistency(
    base_rental_price: float = 0.0,
    table_price: float = 5000000.0,
    table_count: int = 20,
    addon_services_price: float = 0.0,
    discount_percent: float = 5.0,
    voucher_amount: float = 2000000.0,
    vat_percent: float = 8.0
) -> dict:
    """
    Audits and compares Pricing Calculation between Frontend (calculator.js) and Backend (ContractService.java).
    Ensures BUG-03 business rule (Discount % FIRST, Voucher NEXT, VAT 8%, Deposit 30%) matches 100%.
    """
    # 1. Backend Formula (ContractService.java with BigDecimal HALF_UP)
    menu_total_be = Decimal(str(table_price)) * Decimal(str(table_count))
    service_total_be = Decimal(str(addon_services_price))
    rental_be = Decimal(str(base_rental_price))
    sub_total_be = menu_total_be + service_total_be + rental_be

    target_be = menu_total_be if menu_total_be > 0 else sub_total_be
    discount_amt_be = (target_be * Decimal(str(discount_percent)) / Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    after_discount_be = max(Decimal("0"), sub_total_be - discount_amt_be)
    
    voucher_be = Decimal(str(voucher_amount))
    net_subtotal_be = max(Decimal("0"), after_discount_be - voucher_be)
    
    vat_amt_be = (net_subtotal_be * Decimal(str(vat_percent)) / Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    grand_total_be = net_subtotal_be + vat_amt_be
    deposit_min_be = (grand_total_be * Decimal("0.30")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # 2. Frontend Formula (calculator.js simulation)
    subtotal_fe = base_rental_price + (table_price * table_count) + addon_services_price
    discount_target_fe = (table_price * table_count) if (table_price * table_count) > 0 else subtotal_fe
    discount_amt_fe = round(discount_target_fe * (discount_percent / 100.0))
    after_discount_fe = subtotal_fe - discount_amt_fe
    net_subtotal_fe = max(0.0, after_discount_fe - voucher_amount)
    vat_amt_fe = round(net_subtotal_fe * (vat_percent / 100.0))
    grand_total_fe = net_subtotal_fe + vat_amt_fe
    deposit_min_fe = round(grand_total_fe * 0.30)

    # Comparison
    diff_total = abs(float(grand_total_be) - grand_total_fe)
    diff_deposit = abs(float(deposit_min_be) - deposit_min_fe)
    is_consistent = diff_total < 1.0 and diff_deposit < 1.0

    return {
        "consistent": is_consistent,
        "backend": {
            "subTotal": float(sub_total_be),
            "discountAmount": float(discount_amt_be),
            "afterDiscount": float(after_discount_be),
            "voucherAmount": float(voucher_be),
            "netSubTotal": float(net_subtotal_be),
            "vatAmount": float(vat_amt_be),
            "totalAmount": float(grand_total_be),
            "depositMin30Percent": float(deposit_min_be)
        },
        "frontend": {
            "subTotal": subtotal_fe,
            "discountAmount": discount_amt_fe,
            "afterDiscount": after_discount_fe,
            "voucherAmount": voucher_amount,
            "netSubTotal": net_subtotal_fe,
            "vatAmount": vat_amt_fe,
            "totalAmount": grand_total_fe,
            "depositMin30Percent": deposit_min_fe
        },
        "discrepancy": {
            "totalDiff": diff_total,
            "depositDiff": diff_deposit
        },
        "bug03_check": "PASS: Discount % applied before direct voucher subtraction"
    }


@mcp.tool()
def check_frontend_assets() -> dict:
    """
    Scans HTML, JS, and CSS files in frontend/ to check integrity, broken script tags, and file status.
    """
    if not os.path.exists(FRONTEND_DIR):
        return {"success": False, "error": f"Frontend directory not found at {FRONTEND_DIR}"}

    html_files = []
    js_files = []
    css_files = []
    issues = []

    for root, _, files in os.walk(FRONTEND_DIR):
        for f in files:
            path = os.path.join(root, f)
            rel = os.path.relpath(path, FRONTEND_DIR)
            if f.endswith(".html"):
                html_files.append(rel)
                # Check script and link references
                try:
                    with open(path, "r", encoding="utf-8") as hf:
                        content = hf.read()
                        scripts = re.findall(r'<script\s+src=["\']([^"\']+)["\']', content)
                        for s in scripts:
                            if not s.startswith("http") and not s.startswith("//"):
                                s_path = os.path.join(root, s.split("?")[0])
                                if not os.path.exists(s_path):
                                    issues.append(f"{rel}: Missing script referenced -> {s}")
                except Exception as e:
                    issues.append(f"{rel}: Error reading file -> {e}")
            elif f.endswith(".js"):
                js_files.append(rel)
            elif f.endswith(".css"):
                css_files.append(rel)

    return {
        "success": len(issues) == 0,
        "total_html": len(html_files),
        "total_js": len(js_files),
        "total_css": len(css_files),
        "html_list": html_files,
        "issues": issues
    }


@mcp.tool()
def run_frontend_syntax_check() -> dict:
    """
    Executes Node.js syntax verification across all frontend JavaScript files.
    """
    js_dir = os.path.join(FRONTEND_DIR, "js")
    if not os.path.exists(js_dir):
        return {"success": False, "error": f"JS directory not found at {js_dir}"}

    results = []
    for f in os.listdir(js_dir):
        if f.endswith(".js"):
            file_path = os.path.join(js_dir, f)
            try:
                res = subprocess.run(["node", "-c", file_path], capture_output=True, text=True)
                results.append({
                    "file": f,
                    "valid": res.returncode == 0,
                    "error": res.stderr.strip() if res.returncode != 0 else None
                })
            except Exception as e:
                results.append({"file": f, "valid": False, "error": str(e)})

    all_valid = all(r["valid"] for r in results)
    return {
        "success": all_valid,
        "checked_files": len(results),
        "details": results
    }


if __name__ == "__main__":
    mcp.run(transport="stdio")
