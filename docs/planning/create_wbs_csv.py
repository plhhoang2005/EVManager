import csv

wbs_data = [
    ("1", "EVManager - Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới", "1"),
    ("1.1", "Khởi tạo dự án", "2"),
    ("1.1.1", "Lập Tôn chỉ dự án (Project Charter)", "3"),
    ("1.1.2", "Lập Phát biểu phạm vi (Scope Statement)", "3"),
    ("1.1.3", "Họp Kick-off và phân công đội ngũ", "3"),
    ("1.2", "Lập kế hoạch dự án", "2"),
    ("1.2.1", "Xây dựng WBS (Work Breakdown Structure)", "3"),
    ("1.2.2", "Lập tiến độ dự án (Gantt Chart)", "3"),
    ("1.2.3", "Lập ngân sách dự án (Cost Baseline)", "3"),
    ("1.2.4", "Lập kế hoạch quản lý rủi ro", "3"),
    ("1.3", "Phân tích và Thiết kế", "2"),
    ("1.3.1", "Đặc tả yêu cầu nghiệp vụ (SRS & Use Cases)", "3"),
    ("1.3.2", "Thiết kế CSDL (ERD, Data Dictionary)", "3"),
    ("1.3.3", "Thiết kế giao diện (UI/UX Prototype)", "3"),
    ("1.3.4", "Thiết kế Kiến trúc hệ thống & API", "3"),
    ("1.4", "Phát triển phần mềm", "2"),
    ("1.4.1", "Thiết lập môi trường (Dev/Staging)", "3"),
    ("1.4.2", "Lập trình Backend & Database", "3"),
    ("1.4.3", "Lập trình Frontend (Web & Desktop)", "3"),
    ("1.4.4", "Tích hợp hệ thống (System Integration)", "3"),
    ("1.5", "Kiểm thử (Testing)", "2"),
    ("1.5.1", "Xây dựng kịch bản kiểm thử (Test Cases)", "3"),
    ("1.5.2", "Kiểm thử chức năng và hiệu năng (Internal Test)", "3"),
    ("1.5.3", "Kiểm thử chấp nhận người dùng (UAT)", "3"),
    ("1.5.4", "Ghi nhận và sửa lỗi (Bug Fixing)", "3"),
    ("1.6", "Triển khai và Đóng dự án", "2"),
    ("1.6.1", "Triển khai lên môi trường Production (Golive)", "3"),
    ("1.6.2", "Soạn tài liệu Hướng dẫn sử dụng (User Manual)", "3"),
    ("1.6.3", "Nghiệm thu và Bàn giao hệ thống", "3"),
    ("1.6.4", "Họp rút kinh nghiệm và Đóng dự án (Lessons Learned)", "3")
]

with open('d:\\EVManager\\docs\\planning\\WBS_EVManager.csv', mode='w', encoding='utf-8-sig', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["WBS Code", "Task Name", "Outline Level"])
    writer.writerows(wbs_data)
