import requests
import json
import base64
import sys

sys.stdout.reconfigure(encoding='utf-8')

ATLASSIAN_HOST = "https://srqkendra961.atlassian.net"
EMAIL = "srqkendra961@gmail.com"
API_TOKEN = "ATATT3xFfGF0YNnwDjMn-FNFa-NZly2o9DjpA-E52smPfbk3Qfc0qf0GLGhBUlOqqeZ8jjZPJbRgV4-gqq8qYgwjEdIg4Yl93OH_pYJ7xdNiCZJxLr0k4IFk-JcZqwTyX5ror3DUuCllyHBbuZyfKGuI2LAdxI6TYShKrPthv0TnH5vVvgKX594=C8F3310B"
HUYHOANG_ACCOUNT_ID = "712020:14895f2e-d6f8-4ec0-bdb7-1ed12869687e"

auth_str = f"{EMAIL}:{API_TOKEN}"
headers = {
    'Authorization': f'Basic {base64.b64encode(auth_str.encode()).decode()}',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

# 1. Query issues assigned to HuyHoang
body = {
    'jql': f'project = EV AND assignee = "{HUYHOANG_ACCOUNT_ID}" ORDER BY key ASC',
    'fields': ['summary', 'status', 'assignee', 'issuelinks'],
    'maxResults': 100
}
resp = requests.post(f"{ATLASSIAN_HOST}/rest/api/3/search/jql", headers=headers, json=body)
data = resp.json()
issues = data.get('issues', [])

print("=== KIỂM CHỨNG TÀI KHOẢN HUY HOÀNG (srqkendra961@gmail.com) ===")
print(f"Tổng số task được gán: {len(issues)}")

status_map = {}
total_links = 0
for iss in issues:
    f = iss['fields']
    st = f['status']['name']
    status_map[st] = status_map.get(st, 0) + 1
    total_links += len(f.get('issuelinks', []))

print(f"Phân bố trạng thái: {status_map}")
print(f"Tổng số liên kết trên các task của Hoàng: {total_links}")

# Sample check 3 issues
print("\n=== MẪU 3 TASK SAU CẬP NHẬT ===")
for iss in issues[:3]:
    f = iss['fields']
    print(f"[{iss['key']}] Trạng thái: {f['status']['name']} | Assignee: {f['assignee']['displayName']} ({f['assignee'].get('emailAddress')})")
    for link in f.get('issuelinks', []):
        lt = link.get('type', {}).get('name')
        if 'outwardIssue' in link:
            print(f"   -> blocks {link['outwardIssue']['key']}: {link['outwardIssue']['fields']['summary'][:40]}")
        elif 'inwardIssue' in link:
            print(f"   -> is blocked by {link['inwardIssue']['key']}: {link['inwardIssue']['fields']['summary'][:40]}")
