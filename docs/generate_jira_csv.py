import csv

# Danh sách 29 User Stories từ product-backlog.md
stories = [
    ("US01", "Tài khoản & phân quyền", "Là người dùng, tôi muốn đăng nhập/đăng xuất để truy cập hệ thống theo quyền của mình.", "Must", 3, "Phúc"),
    ("US02", "Tài khoản & phân quyền", "Là Admin, tôi muốn quản lý tài khoản người dùng để kiểm soát người sử dụng hệ thống.", "Must", 5, "Phúc"),
    ("US03", "Tài khoản & phân quyền", "Là Admin, tôi muốn phân quyền người dùng theo vai trò để đảm bảo đúng quyền truy cập.", "Must", 5, "Phúc"),
    ("US04", "Quản lý sảnh & đặt tiệc", "Là Sales, tôi muốn quản lý thông tin sảnh để tư vấn sảnh phù hợp cho khách hàng.", "Must", 5, "Nhân"),
    ("US05", "Quản lý sảnh & đặt tiệc", "Là Sales, tôi muốn tra cứu sảnh trống theo ngày/giờ để tư vấn khách hàng.", "Must", 5, "Nhân"),
    ("US06", "Quản lý sảnh & đặt tiệc", "Là hệ thống, tôi muốn kiểm tra trùng lịch để ngăn việc đặt cùng một sảnh vào cùng thời gian.", "Must", 8, "Phúc"),
    ("US07", "Quản lý sảnh & đặt tiệc", "Là Sales, tôi muốn giữ chỗ sảnh để tránh sảnh bị đặt bởi khách hàng khác trong thời gian tư vấn.", "Must", 5, "Nhân"),
    ("US08", "Quản lý sảnh & đặt tiệc", "Là khách hàng, tôi muốn chọn số lượng bàn và Set Menu để phù hợp với nhu cầu tổ chức tiệc.", "Must", 5, "Nhân"),
    ("US09", "Menu & dịch vụ", "Là khách hàng, tôi muốn chọn nhiều Set Menu và số lượng từng Set để tùy chỉnh tiệc.", "Must", 5, "Nhân"),
    ("US10", "Menu & dịch vụ", "Là khách hàng, tôi muốn tùy chỉnh món ăn trong Set Menu theo nhu cầu.", "Should", 5, "Nhân"),
    ("US11", "Menu & dịch vụ", "Là khách hàng, tôi muốn chọn nhiều gói dịch vụ như âm thanh, ánh sáng, MC để hoàn thiện tiệc.", "Must", 5, "Nhân"),
    ("US12", "Menu & dịch vụ", "Là hệ thống, tôi muốn tự động tính tổng tiền Menu + dịch vụ để tạo báo giá chính xác.", "Must", 8, "Phúc"),
    ("US13", "Menu & dịch vụ", "Là hệ thống, tôi muốn tính số bàn sơ cua theo số bàn đặt để áp dụng chính sách của nhà hàng.", "Must", 3, "Phúc"),
    ("US14", "Hợp đồng & thanh toán", "Là Sales, tôi muốn lập và gửi báo giá để khách hàng xem và xác nhận.", "Must", 5, "Hiển"),
    ("US15", "Hợp đồng & thanh toán", "Là hệ thống, tôi muốn sinh hợp đồng từ mẫu có sẵn để giảm thời gian lập hợp đồng.", "Must", 8, "Phúc"),
    ("US16", "Hợp đồng & thanh toán", "Là khách hàng, tôi muốn xác nhận hợp đồng để chính thức xác nhận dịch vụ.", "Must", 3, "Nhân"),
    ("US17", "Hợp đồng & thanh toán", "Là khách hàng, tôi muốn thanh toán tiền cọc đợt 1 để xác nhận đặt tiệc.", "Must", 5, "Nhân"),
    ("US18", "Hợp đồng & thanh toán", "Là Kế toán, tôi muốn ghi nhận và theo dõi thanh toán để quản lý công nợ.", "Must", 5, "Hiển"),
    ("US19", "Hợp đồng & thanh toán", "Là Điều phối, tôi muốn phân công nhân viên phục vụ và kỹ thuật để chuẩn bị cho tiệc.", "Must", 5, "Hoàng"),
    ("US20", "Hợp đồng & thanh toán", "Là Điều phối, tôi muốn ghi nhận các dịch vụ phát sinh trong tiệc để quyết toán chính xác.", "Must", 5, "Hoàng"),
    ("US21", "Hợp đồng & thanh toán", "Là khách hàng, tôi muốn ký biên bản nghiệm thu sau tiệc để xác nhận kết quả dịch vụ.", "Must", 3, "Nhân"),
    ("US22", "Hợp đồng & thanh toán", "Là Kế toán, tôi muốn lập quyết toán đợt 2 để thu phần tiền còn lại.", "Must", 5, "Hoàng"),
    ("US23", "Hợp đồng & thanh toán", "Là hệ thống, tôi muốn cập nhật trạng thái hợp đồng thành 'Đã hoàn tất' sau khi quyết toán.", "Must", 3, "Phúc"),
    ("US24", "Dashboard & báo cáo", "Là Quản lý, tôi muốn xem Dashboard tổng quan để theo dõi tình hình kinh doanh.", "Should", 5, "Nhân"),
    ("US25", "Dashboard & báo cáo", "Là Quản lý, tôi muốn xem báo cáo doanh thu theo thời gian để phân tích hoạt động kinh doanh.", "Should", 5, "Hoàng"),
    ("US26", "Dashboard & báo cáo", "Là Quản lý, tôi muốn xuất báo cáo Excel/PDF để phục vụ lưu trữ và báo cáo.", "Should", 5, "Hoàng"),
    ("US27", "Thông báo", "Là hệ thống, tôi muốn gửi email thông báo về báo giá, hợp đồng và thanh toán để khách hàng nhận thông tin kịp thời.", "Should", 5, "Phúc"),
    ("US28", "AI", "Là khách hàng, tôi muốn được gợi ý Set Menu phù hợp dựa trên số lượng khách và nhu cầu để lựa chọn nhanh hơn.", "Could", 8, "Hoàng"),
    ("US29", "AI", "Là Quản lý, tôi muốn dự báo chi phí bằng AI để hỗ trợ lập kế hoạch ngân sách.", "Could", 13, "Hoàng"),
]

# Thêm 21 Task kỹ thuật / quản lý
tasks = [
    ("T30", "Project Management", "Lập Tôn chỉ dự án (Project Charter) và Phân quyền RACI", "Must", 5, "Hoàng"),
    ("T31", "Project Management", "Khởi tạo Repository GitHub và Quy chuẩn làm việc (Workflow)", "Must", 3, "Hoàng"),
    ("T32", "Business Analysis", "Khảo sát quy trình nghiệp vụ và lập Đặc tả Usecase (SRS)", "Must", 8, "Hiển"),
    ("T33", "Business Analysis", "Lập Product Backlog và Phân loại MoSCoW", "Must", 5, "Hiển"),
    ("T34", "Database", "Thiết kế ERD và Chuẩn hóa cơ sở dữ liệu 3NF (13 bảng)", "Must", 8, "Hậu"),
    ("T35", "Database", "Triển khai Schema Flyway Migration V1-V8 và Seed Data", "Must", 5, "Hậu"),
    ("T36", "Architecture", "Thiết kế Kiến trúc Backend Spring Boot, JWT, RBAC", "Must", 8, "Phúc"),
    ("T37", "UI/UX", "Thiết kế Wireframe UI/UX trên Figma và Luồng màn hình", "Must", 8, "Nhân"),
    ("T38", "Project Management", "Thiết lập WBS, Lịch trình Gantt, Ngân sách và EVM Day 20", "Must", 8, "Hoàng"),
    ("T39", "Frontend", "Khởi tạo SPA React + Vite + Tailwind CSS framework", "Must", 5, "Nhân"),
    ("T40", "Backend", "Phát triển Global Exception Handler và Validation", "Must", 3, "Phúc"),
    ("T41", "Backend", "Cấu hình Swagger UI và API Documentation", "Must", 2, "Phúc"),
    ("T42", "Backend", "Phát triển Module Users và Customers", "Must", 5, "Phúc"),
    ("T43", "Backend", "Xây dựng hệ thống Audit Log cho các thay đổi quan trọng", "Must", 5, "Phúc"),
    ("T44", "Frontend", "Phát triển các component dùng chung (Button, Table, Form, Modal)", "Must", 5, "Nhân"),
    ("T45", "Frontend", "Ghép API Authentication và Quản lý Session phía Client", "Must", 5, "Nhân"),
    ("T46", "Testing", "Lập Test Plan, Test Strategy và Definition of Done (DoD)", "Must", 5, "Hậu"),
    ("T47", "Testing", "Viết 35 Test Cases cho các phân hệ cốt lõi (Auth, Venues, Customers)", "Must", 8, "Hậu"),
    ("T48", "Testing", "Thực thi Test Run, Ghi nhận lỗi (Bug-104) và lập Test Report Midterm", "Must", 5, "Hậu"),
    ("T49", "DevOps", "Cấu hình CI/CD Pipeline (GitHub Actions) để tự động Build & Test", "Should", 5, "Hoàng"),
    ("T50", "Deployment", "Triển khai hệ thống lên môi trường Staging/Demo (Render/Vercel)", "Must", 5, "Hoàng"),
]

priority_map = {
    "Must": "Highest",
    "Should": "High",
    "Could": "Medium"
}

email_map = {
    "Hoàng": "plhhoang2005@gmail.com",
    "Hiển": "tuminhhien324@gmail.com",
    "Nhân": "nhanvo134679@gmail.com",
    "Phúc": "phucngo1707@gmail.com",
    "Hậu": "2005buinguyenchihau@gmail.com"
}

output_file = r'D:\EVManager\docs\jira_import.csv'

with open(output_file, mode='w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    # Header Jira cần
    writer.writerow(["Issue Type", "Summary", "Description", "Priority", "Story Points", "Assignee", "Labels"])
    
    # Ghi 29 User Stories
    for us in stories:
        i_id, label, desc, moscow, sp, assignee = us
        summary = f"[{i_id}] {label}"
        priority = priority_map.get(moscow, "Medium")
        email = email_map.get(assignee, "")
        writer.writerow(["Story", summary, desc, priority, sp, email, "UserStory"])
        
    # Ghi 21 Tasks
    for t in tasks:
        t_id, label, desc, moscow, sp, assignee = t
        summary = f"[{t_id}] {label}: {desc}"
        priority = priority_map.get(moscow, "Medium")
        email = email_map.get(assignee, "")
        writer.writerow(["Task", summary, desc, priority, sp, email, "TechnicalTask"])

print("Đã tạo thành công file", output_file)
