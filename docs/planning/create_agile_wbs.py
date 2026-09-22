import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "WBS_EVManager_Sprint"

headers = ["ID", "WBS", "Tên công việc (Task Name)", "Thời lượng (ngày)", "Bắt đầu", "Kết thúc", "Tiền nhiệm", "Nguồn lực", "Chi phí (VNĐ)"]
ws.append(headers)

# Styling
header_fill = PatternFill(start_color="4F81BD", end_color="4F81BD", fill_type="solid")
header_font = Font(color="FFFFFF", bold=True)
align_center = Alignment(horizontal="center", vertical="center")
align_right = Alignment(horizontal="right", vertical="center")
thin_border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))
phase_fill = PatternFill(start_color="B4C6E7", end_color="B4C6E7", fill_type="solid")

data = [
    [1, "1", "QUẢN LÝ DỰ ÁN (Xuyên suốt)", 56, "07/09/2026", "01/11/2026", "", "Hoàng (PM)", "12,000,000"],
    [2, "1.1", "Khởi tạo: Tôn chỉ dự án & Phạm vi", 2, "07/09/2026", "08/09/2026", "", "PM, Hiển (BA)", "1,000,000"],
    [3, "1.2", "Lập kế hoạch: WBS, Lịch trình, Chi phí", 3, "09/09/2026", "11/09/2026", "2", "PM", "2,000,000"],
    [4, "1.3", "Theo dõi, Kiểm soát & Báo cáo tiến độ", 50, "12/09/2026", "30/10/2026", "3", "PM", "6,000,000"],
    [5, "1.4", "Đóng dự án & Tổng kết bài học", 2, "31/10/2026", "01/11/2026", "4", "Toàn bộ nhóm", "3,000,000"],
    
    [6, "2", "SPRINT 1: PHÂN TÍCH & THIẾT KẾ", 14, "07/09/2026", "20/09/2026", "", "", "15,000,000"],
    [7, "2.1", "Khảo sát và Phân tích yêu cầu (SRS)", 6, "07/09/2026", "12/09/2026", "", "Hiển (BA)", "4,000,000"],
    [8, "2.2", "Thiết kế Cơ sở dữ liệu (Database)", 5, "13/09/2026", "17/09/2026", "7", "Hậu (QA/DB)", "3,000,000"],
    [9, "2.3", "Thiết kế Giao diện (Wireframe UI/UX)", 7, "14/09/2026", "20/09/2026", "7", "Nhân (FE)", "5,000,000"],
    [10, "2.4", "Mua sắm công cụ & Thuê Cloud Server", 3, "18/09/2026", "20/09/2026", "", "Phúc (BE)", "3,000,000"],
    
    [11, "3", "SPRINT 2: MODULE ĐẶT SẢNH & DỊCH VỤ", 14, "21/09/2026", "04/10/2026", "6", "", "22,000,000"],
    [12, "3.1", "Phát triển API & DB Đặt sảnh, Dịch vụ", 7, "21/09/2026", "27/09/2026", "8", "Phúc (BE)", "8,000,000"],
    [13, "3.2", "Xây dựng UI Dashboard & Quản lý Sảnh", 7, "21/09/2026", "27/09/2026", "9", "Nhân (FE)", "8,000,000"],
    [14, "3.3", "Tích hợp & Kiểm thử module Đặt sảnh", 7, "28/09/2026", "04/10/2026", "12,13", "Hậu (QA)", "6,000,000"],
    
    [15, "4", "SPRINT 3: MODULE HỢP ĐỒNG & THANH TOÁN", 14, "05/10/2026", "18/10/2026", "11", "", "21,000,000"],
    [16, "4.1", "Phát triển API Hợp đồng & Thanh toán", 7, "05/10/2026", "11/10/2026", "12", "Phúc (BE)", "7,500,000"],
    [17, "4.2", "Xây dựng UI Hợp đồng & Xử lý Thanh toán", 7, "05/10/2026", "11/10/2026", "13", "Nhân (FE)", "7,500,000"],
    [18, "4.3", "Tích hợp & Kiểm thử module Hợp đồng", 7, "12/10/2026", "18/10/2026", "16,17", "Hậu (QA)", "6,000,000"],
    
    [19, "5", "SPRINT 4: BÁO CÁO, KIỂM THỬ UAT & TRIỂN KHAI", 14, "19/10/2026", "01/11/2026", "15", "", "15,000,000"],
    [20, "5.1", "Phát triển module Báo cáo & Thống kê", 5, "19/10/2026", "23/10/2026", "16,17", "BE, FE", "6,000,000"],
    [21, "5.2", "Kiểm thử tổng hợp toàn hệ thống (UAT)", 6, "24/10/2026", "29/10/2026", "20", "BA, QA", "5,000,000"],
    [22, "5.3", "Triển khai lên máy chủ (Golive)", 2, "30/10/2026", "31/10/2026", "21", "Phúc (BE)", "2,000,000"],
    [23, "5.4", "Viết HDSD & Bàn giao hệ thống MVP", 2, "31/10/2026", "01/11/2026", "22", "Hiển (BA)", "2,000,000"],
    
    [24, "6", "DỰ PHÒNG PHÍ (Contingency 10%)", 0, "01/11/2026", "01/11/2026", "", "Quỹ dự phòng", "8,500,000"]
]

for row_idx, row_data in enumerate(data, 2):
    for col_idx, cell_value in enumerate(row_data, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=cell_value)
        cell.border = thin_border
        
        # Header formatting
        for i in range(1, 10):
            ws.cell(row=1, column=i).fill = header_fill
            ws.cell(row=1, column=i).font = header_font
            ws.cell(row=1, column=i).alignment = align_center

        wbs_code = str(row_data[1])
        if "." not in wbs_code:
            cell.fill = phase_fill
            cell.font = Font(bold=True)
            
        # Alignment for specific columns
        if col_idx in [1, 2, 4, 5, 6, 7]:
            cell.alignment = align_center
        if col_idx == 9:
            cell.alignment = align_right
            
        # Indent level 2
        if col_idx == 3 and "." in wbs_code:
            cell.value = "   " + str(cell_value)

# Set Column Widths
ws.column_dimensions['A'].width = 5
ws.column_dimensions['B'].width = 8
ws.column_dimensions['C'].width = 45
ws.column_dimensions['D'].width = 15
ws.column_dimensions['E'].width = 12
ws.column_dimensions['F'].width = 12
ws.column_dimensions['G'].width = 12
ws.column_dimensions['H'].width = 20
ws.column_dimensions['I'].width = 15

wb.save("d:\\EVManager\\docs\\planning\\WBS_EVManager_Agile.xlsx")
