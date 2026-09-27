import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Create workbook and sheet
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "EVM_Day20_Analysis"

# Ensure grid lines are visible
ws.views.sheetView[0].showGridLines = True

# Define styles
title_font = Font(name="Calibri", size=16, bold=True, color="1B365D")
subtitle_font = Font(name="Calibri", size=11, italic=True, color="555555")
section_font = Font(name="Calibri", size=12, bold=True, color="1B365D")
header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
bold_font = Font(name="Calibri", size=11, bold=True)
regular_font = Font(name="Calibri", size=11)
kpi_label_font = Font(name="Calibri", size=10, bold=True, color="333333")
kpi_val_font = Font(name="Calibri", size=14, bold=True, color="1B365D")

header_fill = PatternFill(start_color="1B365D", end_color="1B365D", fill_type="solid")
subtotal_fill = PatternFill(start_color="E6EEF8", end_color="E6EEF8", fill_type="solid")
kpi_box_fill = PatternFill(start_color="F0F4F8", end_color="F0F4F8", fill_type="solid")
warn_fill = PatternFill(start_color="FFF0F0", end_color="FFF0F0", fill_type="solid")
good_fill = PatternFill(start_color="F0FFF0", end_color="F0FFF0", fill_type="solid")

thin_border = Border(
    left=Side(style='thin', color='D0D0D0'),
    right=Side(style='thin', color='D0D0D0'),
    top=Side(style='thin', color='D0D0D0'),
    bottom=Side(style='thin', color='D0D0D0')
)
double_bottom_border = Border(
    top=Side(style='thin', color='1B365D'),
    bottom=Side(style='double', color='1B365D')
)

# 1. Title Block
ws.merge_cells("A1:K1")
ws["A1"] = "BẢNG PHÂN TÍCH CHỈ SỐ EARNED VALUE MANAGEMENT (EVM) — TẠI NGÀY THỨ 20"
ws["A1"].font = title_font
ws["A1"].alignment = Alignment(vertical="center")

ws.merge_cells("A2:K2")
ws["A2"] = "Dự án: LV34-001 — EVManager | Môn học: MAN104 — QLDA CNTT | Ngày đánh giá: 27/09/2026 (Cuối Tuần 3)"
ws["A2"].font = subtitle_font
ws["A2"].alignment = Alignment(vertical="center")

# Metadata table
ws["A4"] = "Tổng ngân sách (BAC):"
ws["B4"] = 130000000
ws["B4"].number_format = "#,##0 \"VNĐ\""
ws["B4"].font = bold_font

ws["D4"] = "Tổng thời gian kế hoạch:"
ws["E4"] = "56 ngày (8 tuần)"
ws["E4"].font = bold_font

ws["G4"] = "Mốc đo lường:"
ws["H4"] = "Ngày thứ 20 (Day 20 / End of Week 3)"
ws["H4"].font = bold_font

ws["A5"] = "Đơn giá ngày công:"
ws["B5"] = 500000
ws["B5"].number_format = "#,##0 \"VNĐ/ngày\""
ws["B5"].font = bold_font

ws["D5"] = "Người lập báo cáo:"
ws["E5"] = "Phạm Lê Huy Hoàng (PM)"
ws["E5"].font = bold_font

ws["G5"] = "Trạng thái mốc:"
ws["H5"] = "Chuẩn bị Demo giữa kỳ 50%"
ws["H5"].font = bold_font

# Table headers
headers = [
    ("Mã WBS", 10, Alignment(horizontal="center", vertical="center")),
    ("Gói công việc (WBS Package)", 36, Alignment(horizontal="left", vertical="center")),
    ("Ngân sách (BAC)", 16, Alignment(horizontal="right", vertical="center")),
    ("% Kế hoạch", 13, Alignment(horizontal="right", vertical="center")),
    ("Planned Value (PV / BCWS)", 22, Alignment(horizontal="right", vertical="center")),
    ("% Thực tế", 13, Alignment(horizontal="right", vertical="center")),
    ("Earned Value (EV / BCWP)", 22, Alignment(horizontal="right", vertical="center")),
    ("Actual Cost (AC / ACWP)", 22, Alignment(horizontal="right", vertical="center")),
    ("CV (EV - AC)", 16, Alignment(horizontal="right", vertical="center")),
    ("SV (EV - PV)", 16, Alignment(horizontal="right", vertical="center")),
    ("Chỉ số CPI", 12, Alignment(horizontal="right", vertical="center")),
    ("Chỉ số SPI", 12, Alignment(horizontal="right", vertical="center")),
]

start_row = 7
for col_idx, (h_text, width, align) in enumerate(headers, 1):
    cell = ws.cell(row=start_row, column=col_idx)
    cell.value = h_text
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = align
    ws.column_dimensions[get_column_letter(col_idx)].width = width

# WBS Data rows
wbs_data = [
    ("1.1", "Khởi tạo dự án (Charter, RACI, Kick-off)", 12000000, 1.00, 1.00, 12000000),
    ("1.2", "Lập kế hoạch dự án (WBS, Gantt, COCOMO, Risk)", 18000000, 1.00, 1.00, 18500000),
    ("1.3", "Phân tích & Thiết kế (SRS, ERD 3NF, Data Dict, UI Proto)", 30000000, 0.95, 1.00, 32000000),
    ("1.4", "Phát triển phần mềm (Skeleton, Auth, Users, Customers, UI)", 45000000, 0.45, 0.38, 21000000),
    ("1.5", "Kiểm thử phần mềm (Test plan, 35 TC, Demo test, Bug-01)", 15000000, 0.40, 0.35, 5800000),
    ("1.6", "Triển khai & Đóng dự án (UAT, Golive, Manual, Closure)", 10000000, 0.00, 0.00, 0),
]

current_row = start_row + 1
for code, name, bac, plan_pct, act_pct, ac in wbs_data:
    row_num = current_row
    ws.cell(row=row_num, column=1, value=code).alignment = Alignment(horizontal="center")
    ws.cell(row=row_num, column=2, value=name).alignment = Alignment(horizontal="left")
    
    c_bac = ws.cell(row=row_num, column=3, value=bac)
    c_bac.number_format = "#,##0"
    
    c_plan = ws.cell(row=row_num, column=4, value=plan_pct)
    c_plan.number_format = "0.0%"
    
    c_pv = ws.cell(row=row_num, column=5, value=f"=C{row_num}*D{row_num}")
    c_pv.number_format = "#,##0"
    
    c_act = ws.cell(row=row_num, column=6, value=act_pct)
    c_act.number_format = "0.0%"
    
    c_ev = ws.cell(row=row_num, column=7, value=f"=C{row_num}*F{row_num}")
    c_ev.number_format = "#,##0"
    
    c_ac = ws.cell(row=row_num, column=8, value=ac)
    c_ac.number_format = "#,##0"
    
    c_cv = ws.cell(row=row_num, column=9, value=f"=G{row_num}-H{row_num}")
    c_cv.number_format = "#,##0"
    
    c_sv = ws.cell(row=row_num, column=10, value=f"=G{row_num}-E{row_num}")
    c_sv.number_format = "#,##0"
    
    c_cpi = ws.cell(row=row_num, column=11, value=f"=IF(H{row_num}>0, G{row_num}/H{row_num}, 1.00)")
    c_cpi.number_format = "0.000"
    
    c_spi = ws.cell(row=row_num, column=12, value=f"=IF(E{row_num}>0, G{row_num}/E{row_num}, 1.00)")
    c_spi.number_format = "0.000"
    
    for c in range(1, 13):
        ws.cell(row=row_num, column=c).font = regular_font
        ws.cell(row=row_num, column=c).border = thin_border
        
    current_row += 1

# Total Row
tot_row = current_row
ws.cell(row=tot_row, column=1, value="TỔNG").alignment = Alignment(horizontal="center")
ws.cell(row=tot_row, column=2, value="TOÀN BỘ DỰ ÁN EVMANAGER").alignment = Alignment(horizontal="left")

c_tot_bac = ws.cell(row=tot_row, column=3, value=f"=SUM(C8:C{tot_row-1})")
c_tot_bac.number_format = "#,##0"

c_tot_plan = ws.cell(row=tot_row, column=4, value=f"=E{tot_row}/C{tot_row}")
c_tot_plan.number_format = "0.0%"

c_tot_pv = ws.cell(row=tot_row, column=5, value=f"=SUM(E8:E{tot_row-1})")
c_tot_pv.number_format = "#,##0"

c_tot_act = ws.cell(row=tot_row, column=6, value=f"=G{tot_row}/C{tot_row}")
c_tot_act.number_format = "0.0%"

c_tot_ev = ws.cell(row=tot_row, column=7, value=f"=SUM(G8:G{tot_row-1})")
c_tot_ev.number_format = "#,##0"

c_tot_ac = ws.cell(row=tot_row, column=8, value=f"=SUM(H8:H{tot_row-1})")
c_tot_ac.number_format = "#,##0"

c_tot_cv = ws.cell(row=tot_row, column=9, value=f"=G{tot_row}-H{tot_row}")
c_tot_cv.number_format = "#,##0"

c_tot_sv = ws.cell(row=tot_row, column=10, value=f"=G{tot_row}-E{tot_row}")
c_tot_sv.number_format = "#,##0"

c_tot_cpi = ws.cell(row=tot_row, column=11, value=f"=G{tot_row}/H{tot_row}")
c_tot_cpi.number_format = "0.000"

c_tot_spi = ws.cell(row=tot_row, column=12, value=f"=G{tot_row}/E{tot_row}")
c_tot_spi.number_format = "0.000"

for c in range(1, 13):
    cell = ws.cell(row=tot_row, column=c)
    cell.font = bold_font
    cell.fill = subtotal_fill
    cell.border = double_bottom_border

# Summary KPIs Cards
kpi_start = tot_row + 3
ws.cell(row=kpi_start, column=1, value="BẢNG TỔNG HỢP CÁC CHỈ SỐ EVM CỐT LÕI (DÀNH CHO SLIDE BÁO CÁO GIỮA KỲ)").font = section_font

kpis = [
    ("Planned Value (PV)", f"=E{tot_row}", "#,##0 \"VNĐ\"", "Ngân sách kế hoạch tích lũy đến Day 20"),
    ("Earned Value (EV)", f"=G{tot_row}", "#,##0 \"VNĐ\"", "Giá trị nghiệm thu thực tế của các task hoàn thành"),
    ("Actual Cost (AC)", f"=H{tot_row}", "#,##0 \"VNĐ\"", "Chi phí nhân lực thực tế đã tiêu hao (bao gồm OT)"),
    ("Cost Variance (CV)", f"=I{tot_row}", "#,##0 \"VNĐ\"", "CV < 0: Chi phí vượt ngân sách cục bộ"),
    ("Schedule Variance (SV)", f"=J{tot_row}", "#,##0 \"VNĐ\"", "SV < 0: Tiến độ chậm hơn baseline 2.5%"),
    ("Cost Performance Index (CPI)", f"=K{tot_row}", "0.000", "CPI < 1: 1 VNĐ chi ra mang lại 0.873 VNĐ giá trị"),
    ("Schedule Performance Index (SPI)", f"=L{tot_row}", "0.000", "SPI < 1: Tiến độ đạt 94.4% so với kế hoạch ban đầu"),
    ("Estimate at Completion (EAC)", f"=C{tot_row}/K{tot_row}", "#,##0 \"VNĐ\"", "Dự báo tổng chi phí khi hoàn thành dự án"),
    ("Variance at Completion (VAC)", f"=C{tot_row}-(C{tot_row}/K{tot_row})", "#,##0 \"VNĐ\"", "Dự báo vượt ngân sách khi kết thúc dự án"),
    ("To-Complete Performance Index (TCPI)", f"=(C{tot_row}-G{tot_row})/(C{tot_row}-H{tot_row})", "0.000", "Hiệu năng chi phí cần đạt trong nửa sau dự án")
]

kpi_row = kpi_start + 2
for name, formula, fmt, note in kpis:
    ws.cell(row=kpi_row, column=1, value=name).font = bold_font
    c_val = ws.cell(row=kpi_row, column=3, value=formula)
    c_val.font = kpi_val_font
    c_val.number_format = fmt
    c_val.alignment = Alignment(horizontal="right")
    
    ws.cell(row=kpi_row, column=5, value=note).font = regular_font
    
    for c in range(1, 13):
        ws.cell(row=kpi_row, column=c).border = thin_border
    kpi_row += 1

# Save workbook
output_path = r"d:\EVManager\docs\planning\EVM_Analysis_Day20.xlsx"
wb.save(output_path)
print("EVM Excel created successfully at:", output_path)
