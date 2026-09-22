import docx
from docx.shared import Pt, Twips
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import nsdecls
from docx.oxml import parse_xml

doc = docx.Document()

# Use standard Portrait orientation (default is already portrait)

title = doc.add_heading('CẤU TRÚC PHÂN RÃ CÔNG VIỆC (WORK BREAKDOWN STRUCTURE – WBS)', 1)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

p = doc.add_paragraph()
p.add_run('Tên dự án (Project Title): ').bold = True
p.add_run('EVManager — Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới\n')
p.add_run('WBS phân rã dự án thành 6 nhóm công việc: (1) Quản lý dự án xuyên suốt; (2)–(5) bốn Sprint, mỗi Sprint 2 tuần; và (6) dự phòng phí 10%. Tổng thời gian 07/09–01/11/2026 (56 ngày), tổng chi phí 93.500.000 VNĐ. Nguồn lực: PM – Hoàng; BA – Hiển; BE – Phúc; FE – Nhân; QA – Hậu.')

# Change default font size to 9pt for the document body just in case
style = doc.styles['Normal']
font = style.font
font.size = Pt(9)

# Table data
headers = ["ID", "WBS", "Tên công việc (Task Name)", "TL\n(ngày)", "Bắt đầu", "Kết thúc", "Tiền\nnhiệm", "Nguồn lực", "Chi phí (VNĐ)"]

data = [
    [1, "1", "QUẢN LÝ DỰ ÁN (Xuyên suốt)", "56", "07/09/2026", "01/11/2026", "", "Hoàng (PM)", "12.000.000"],
    [2, "1.1", "Khởi tạo: Tôn chỉ dự án & Phạm vi", "2", "07/09/2026", "08/09/2026", "", "PM, Hiển (BA)", "1.000.000"],
    [3, "1.2", "Lập kế hoạch: WBS, Lịch trình, Chi phí", "3", "09/09/2026", "11/09/2026", "2", "PM", "2.000.000"],
    [4, "1.3", "Theo dõi, Kiểm soát & Báo cáo tiến độ", "50", "12/09/2026", "30/10/2026", "3", "PM", "6.000.000"],
    [5, "1.4", "Đóng dự án & Tổng kết bài học", "2", "31/10/2026", "01/11/2026", "4", "Toàn bộ nhóm", "3.000.000"],
    
    [6, "2", "SPRINT 1: PHÂN TÍCH & THIẾT KẾ", "14", "07/09/2026", "20/09/2026", "", "", "15.000.000"],
    [7, "2.1", "Khảo sát và Phân tích yêu cầu (SRS)", "6", "07/09/2026", "12/09/2026", "", "Hiển (BA)", "4.000.000"],
    [8, "2.2", "Thiết kế Cơ sở dữ liệu (Database)", "5", "13/09/2026", "17/09/2026", "7", "Hậu (QA)", "3.000.000"],
    [9, "2.3", "Thiết kế Giao diện (Wireframe UI/UX)", "7", "14/09/2026", "20/09/2026", "7", "Nhân (FE)", "5.000.000"],
    [10, "2.4", "Mua sắm công cụ & Thuê Cloud Server", "3", "18/09/2026", "20/09/2026", "", "Phúc (BE)", "3.000.000"],
    
    [11, "3", "SPRINT 2: MODULE ĐẶT SẢNH & DỊCH VỤ", "14", "21/09/2026", "04/10/2026", "6", "", "22.000.000"],
    [12, "3.1", "Phát triển API & DB Đặt sảnh, Dịch vụ", "7", "21/09/2026", "27/09/2026", "8", "Phúc (BE)", "8.000.000"],
    [13, "3.2", "Xây dựng UI Dashboard & Quản lý Sảnh", "7", "21/09/2026", "27/09/2026", "9", "Nhân (FE)", "8.000.000"],
    [14, "3.3", "Tích hợp & Kiểm thử module Đặt sảnh", "7", "28/09/2026", "04/10/2026", "12,13", "Hậu (QA)", "6.000.000"],
    
    [15, "4", "SPRINT 3: MODULE HỢP ĐỒNG & THANH TOÁN", "14", "05/10/2026", "18/10/2026", "11", "", "21.000.000"],
    [16, "4.1", "Phát triển API Hợp đồng & Thanh toán", "7", "05/10/2026", "11/10/2026", "12", "Phúc (BE)", "7.500.000"],
    [17, "4.2", "Xây dựng UI Hợp đồng & Xử lý Thanh toán", "7", "05/10/2026", "11/10/2026", "13", "Nhân (FE)", "7.500.000"],
    [18, "4.3", "Tích hợp & Kiểm thử module Hợp đồng", "7", "12/10/2026", "18/10/2026", "16,17", "Hậu (QA)", "6.000.000"],
    
    [19, "5", "SPRINT 4: BÁO CÁO, KIỂM THỬ UAT & TRIỂN KHAI", "14", "19/10/2026", "01/11/2026", "15", "", "15.000.000"],
    [20, "5.1", "Phát triển module Báo cáo & Thống kê", "5", "19/10/2026", "23/10/2026", "16,17", "BE, FE", "6.000.000"],
    [21, "5.2", "Kiểm thử tổng hợp toàn hệ thống (UAT)", "6", "24/10/2026", "29/10/2026", "20", "BA, QA", "5.000.000"],
    [22, "5.3", "Triển khai lên máy chủ (Golive)", "2", "30/10/2026", "31/10/2026", "21", "Phúc (BE)", "2.000.000"],
    [23, "5.4", "Viết HDSD & Bàn giao hệ thống MVP", "2", "31/10/2026", "01/11/2026", "22", "Hiển (BA)", "2.000.000"],
    
    [24, "6", "DỰ PHÒNG PHÍ (Contingency 10%)", "0", "01/11/2026", "01/11/2026", "", "Quỹ dự phòng", "8.500.000"]
]

table = doc.add_table(rows=1, cols=9)
table.style = 'Table Grid'
table.autofit = False
table.allow_autofit = False

widths = [304800, 355600, 1905000, 431800, 660400, 660400, 508000, 1054100, 698500]

# Header
hdr_cells = table.rows[0].cells
for i, header in enumerate(headers):
    hdr_cells[i].text = header
    hdr_cells[i].width = Twips(widths[i])
    for p in hdr_cells[i].paragraphs:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.bold = True
            r.font.size = Pt(9)
    shading_elm = parse_xml(r'<w:shd {} w:fill="D9D9D9"/>'.format(nsdecls('w')))
    hdr_cells[i]._tc.get_or_add_tcPr().append(shading_elm)

# Content
for row_data in data:
    row_cells = table.add_row().cells
    for i, cell_value in enumerate(row_data):
        val = str(cell_value)
        if i == 2 and "." in str(row_data[1]):
            val = "  " + val
        
        row_cells[i].text = val
        row_cells[i].width = Twips(widths[i])
        
        for p in row_cells[i].paragraphs:
            if i in [0, 1, 3, 4, 5, 6]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            for r in p.runs:
                r.font.size = Pt(9)
                if "." not in str(row_data[1]):
                    r.bold = True
                
        # Highlight phases
        if "." not in str(row_data[1]):
            shading_elm = parse_xml(r'<w:shd {} w:fill="EAF1DD"/>'.format(nsdecls('w')))
            row_cells[i]._tc.get_or_add_tcPr().append(shading_elm)

doc.save('d:\\EVManager\\docs\\planning\\TÔN CHỈ DỰ ÁN - PHÁT BIỂU VỀ PHẠM VI-WBS- EVManager_Resize.docx')
