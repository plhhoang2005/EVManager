import json
import sys

print("Executing MCP Implementation Tests (Strict 14 Rules)")

try:
    import server
except Exception as e:
    print(f"Failed to load MCP server: {e}")
    sys.exit(1)

def print_result(name, success, status, msg):
    print(f"[{'PASS' if success else 'FAIL'}] {name} - Status: {status} | {msg}")

# Security Tests
print("\\n=== SECURITY TESTS ===")

# 1. SQL Filter bypass (Try dropping/modifying)
res = json.loads(server.db_query("SELECT 1; DROP TABLE users;"))
print_result("SQL Filter Bypass", res['status_code'] == 400, res['status_code'], res['message'])

# 2. Secret/JWT leakage in DB Query
res = json.loads(server.db_query("SELECT 'secret_password_hash' as password_hash"))
is_masked = res['success'] and res['data'] and res['data'][0].get('password_hash') == '***MASKED***'
print_result("Secret Masking in DB", is_masked, res['status_code'], "Data masked" if is_masked else res.get('data'))

# 3. Invalid API Path
res = json.loads(server.api_request("GET", "/invalid/api"))
print_result("Invalid API Path (No Auth)", res['status_code'] in [401, 403, 404], res['status_code'], res['message'])

# Functional Tests for BE-13 -> BE-21
print("\\n=== FUNCTIONAL & SCENARIO TESTS (BE-13 to BE-21) ===")

print("\\n[Login]")
login_res = json.loads(server.login("admin", "Password1!"))
print_result("Admin Login", login_res['success'], login_res['status_code'], login_res['message'])

print("\\n[BE-13] Booking Conflict Checker")
# We test the MCP wrapper. We pass a date that has no events.
res = json.loads(server.check_booking_conflict(1, "2026-10-15 08:00:00", "2026-10-15 12:00:00"))
print_result("Conflict Checker (Empty venue)", res['success'], res['status_code'], res['message'])

print("\\n[BE-16, BE-17] Services, Dishes, Menus")
print("SKIPPED - Backend issue BE-16/17 not yet implemented. Cannot test Endpoints or Entity.")

print("\\n[BE-18, BE-19] Contract Lifecycle & Pricing")
print("SKIPPED - Contract entity and pricing logic not implemented. ContractStatus enum not defined in DB yet.")

print("\\n[BE-20] Payments (Deposit/Final)")
print("SKIPPED - Payment endpoint not yet implemented. Cannot verify remaining debt logic.")

print("\\n[BE-21] Transaction & Concurrency (Race condition)")
print("SKIPPED - Concurrency test requires Contract API to be ready to spam 2 requests at same venue/time.")

print("\\nAll available tests executed.")
