import requests
import json
import base64
import sys
import time

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

# 1. Danh sách 36 issue của Hoàng (PM)
hoang_issues = [
    'EV-18', 'EV-19', 'EV-20', 'EV-26', 'EV-158', 'EV-159', 'EV-160', 'EV-161',
    'EV-162', 'EV-163', 'EV-164', 'EV-165', 'EV-166', 'EV-167', 'EV-168', 'EV-169',
    'EV-170', 'EV-171', 'EV-172', 'EV-173', 'EV-174', 'EV-175', 'EV-176', 'EV-177',
    'EV-178', 'EV-179', 'EV-180', 'EV-181', 'EV-182', 'EV-183', 'EV-184', 'EV-185',
    'EV-186', 'EV-187', 'EV-192', 'EV-193'
]

# 8 issue cần chuyển sang Done
hoang_todo = ['EV-20', 'EV-158', 'EV-159', 'EV-160', 'EV-161', 'EV-162', 'EV-167', 'EV-192']

print(f"=== BƯỚC 1: GÁN 36 TASK CHO HUY HOÀNG ({EMAIL}) ===")
reassign_success = 0
reassign_errors = 0
for key in hoang_issues:
    url = f"{ATLASSIAN_HOST}/rest/api/3/issue/{key}/assignee"
    payload = {"accountId": HUYHOANG_ACCOUNT_ID}
    resp = requests.put(url, headers=headers, json=payload)
    if resp.status_code == 204:
        reassign_success += 1
        print(f" [OK] Đã gán {key} sang {EMAIL}")
    else:
        reassign_errors += 1
        print(f" [ERR] Gán {key} thất bại: {resp.status_code} {resp.text[:100]}")
    time.sleep(0.1)

print(f"\nKết quả Bước 1: Thành công {reassign_success}/36, Lỗi {reassign_errors}/36\n")

print(f"=== BƯỚC 2: CHUYỂN 8 TASK CÒN LẠI SANG 'DONE' ===")
transition_success = 0
transition_errors = 0
for key in hoang_todo:
    # Lấy transition ID tương ứng với 'Done'
    t_url = f"{ATLASSIAN_HOST}/rest/api/3/issue/{key}/transitions"
    t_resp = requests.get(t_url, headers=headers)
    done_tid = None
    if t_resp.status_code == 200:
        for t in t_resp.json().get('transitions', []):
            if t['to']['name'].lower() == 'done':
                done_tid = t['id']
                break
    
    if not done_tid:
        print(f" [SKIP] {key} không tìm thấy transition Done (có thể đã Done)")
        continue
        
    payload = {"transition": {"id": done_tid}}
    resp = requests.post(t_url, headers=headers, json=payload)
    if resp.status_code == 204:
        transition_success += 1
        print(f" [OK] {key} -> Done (transition id: {done_tid})")
    else:
        transition_errors += 1
        print(f" [ERR] Chuyển trạng thái {key} thất bại: {resp.status_code} {resp.text[:100]}")
    time.sleep(0.1)

print(f"\nKết quả Bước 2: Thành công {transition_success}/{len(hoang_todo)}, Lỗi {transition_errors}\n")

# Danh sách 75 cặp ràng buộc (A blocks B: outwardIssue = A, inwardIssue = B)
links_to_create = [
    # Node A (Khởi động: PM-01 Charter -> RACI, Scope)
    ("EV-187", "EV-186"),
    ("EV-187", "EV-185"),
    ("EV-185", "EV-181"),
    ("EV-186", "EV-181"),
    ("EV-181", "EV-180"),
    ("EV-180", "EV-179"),
    ("EV-179", "EV-178"),
    ("EV-178", "EV-177"),
    ("EV-177", "EV-176"),
    ("EV-176", "EV-174"),
    ("EV-174", "EV-173"),

    # Node A -> Node B (Khởi động -> Phân tích SRS & Use Cases)
    ("EV-185", "EV-1"),
    ("EV-1", "EV-2"),
    ("EV-2", "EV-14"),
    ("EV-14", "EV-3"),
    ("EV-14", "EV-128"),
    ("EV-14", "EV-129"),
    ("EV-14", "EV-130"),
    ("EV-14", "EV-131"),
    ("EV-14", "EV-132"),
    ("EV-14", "EV-133"),
    ("EV-14", "EV-134"),
    ("EV-14", "EV-135"),
    ("EV-14", "EV-136"),
    ("EV-14", "EV-137"),
    ("EV-14", "EV-138"),
    ("EV-14", "EV-139"),
    ("EV-14", "EV-140"),
    ("EV-14", "EV-141"),

    # Node B -> Node D (SRS & Use Cases -> DB 3NF & Schema)
    ("EV-14", "EV-53"),
    ("EV-53", "EV-54"),
    ("EV-54", "EV-55"),

    # Node B -> Node E (SRS & Use Cases -> UI/UX Figma)
    ("EV-14", "EV-4"),
    ("EV-4", "EV-112"),
    ("EV-112", "EV-113"),

    # Node D & E -> Node F (DB & UI -> Backend Lõi & Demo 50%)
    ("EV-54", "EV-5"),
    ("EV-5", "EV-7"),
    ("EV-7", "EV-8"),
    ("EV-8", "EV-9"),
    ("EV-9", "EV-10"),
    ("EV-10", "EV-11"),
    ("EV-7", "EV-86"),
    ("EV-8", "EV-87"),
    ("EV-9", "EV-88"),
    ("EV-168", "EV-169"),
    ("EV-169", "EV-172"),
    ("EV-172", "EV-167"),

    # Node F -> Node G (Lõi -> Hợp đồng, Đặt cọc & Dashboard)
    ("EV-10", "EV-12"),
    ("EV-11", "EV-12"),
    ("EV-12", "EV-13"),
    ("EV-12", "EV-89"),
    ("EV-13", "EV-90"),

    # Node B -> Node H (SRS -> Test Plan & Test Cases)
    ("EV-14", "EV-15"),
    ("EV-15", "EV-16"),
    ("EV-16", "EV-49"),
    ("EV-16", "EV-47"),

    # Node G & H -> Node I (Test Tích hợp, UAT & Đóng dự án)
    ("EV-12", "EV-45"),
    ("EV-16", "EV-45"),
    ("EV-45", "EV-43"),
    ("EV-43", "EV-41"),
    ("EV-41", "EV-42"),
    ("EV-42", "EV-162"),
    ("EV-162", "EV-40"),
    ("EV-40", "EV-161"),
    ("EV-161", "EV-160"),
    ("EV-160", "EV-159"),
    ("EV-159", "EV-158"),

    # Bug links
    ("EV-51", "EV-66"),
    ("EV-48", "EV-66"),
    ("EV-46", "EV-66"),
    ("EV-44", "EV-66"),
    ("EV-194", "EV-99"),
    ("EV-195", "EV-66"),
    ("EV-196", "EV-99"),
    ("EV-197", "EV-66")
]

print(f"=== BƯỚC 3: TẠO {len(links_to_create)} LIÊN KẾT RÀNG BUỘC (BLOCKS) ===")
link_url = f"{ATLASSIAN_HOST}/rest/api/3/issueLink"
link_success = 0
link_existed = 0
link_errors = 0

for outward, inward in links_to_create:
    payload = {
        "type": {"name": "Blocks"},
        "inwardIssue": {"key": inward},
        "outwardIssue": {"key": outward}
    }
    resp = requests.post(link_url, headers=headers, json=payload)
    if resp.status_code == 201:
        link_success += 1
        print(f" [OK] {outward} blocks {inward}")
    elif resp.status_code == 400 and 'already' in resp.text.lower():
        link_existed += 1
        print(f" [EXIST] {outward} blocks {inward} đã tồn tại")
    else:
        link_errors += 1
        print(f" [ERR] Tạo liên kết {outward} -> {inward} thất bại: {resp.status_code} {resp.text[:100]}")
    time.sleep(0.1)

print(f"\nKết quả Bước 3: Tạo mới {link_success}, Đã có {link_existed}, Lỗi {link_errors} trên tổng {len(links_to_create)} liên kết")
