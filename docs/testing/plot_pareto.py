import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter
import numpy as np

# Thiết lập font chữ tiếng Việt sắc nét và không bị lỗi unicode minus
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'Tahoma', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 1. Số liệu thống kê lỗi phát sinh
categories = [
    'Lệch ngày giờ\n(Timezone)', 
    'Lỗi tính toán sai\n(Chiết khấu/Phí)', 
    'In ấn thiếu\n(Hóa đơn/HĐ)', 
    'Lỗi giao diện\n(UI/Responsive)', 
    'Lỗi mất kết nối\n(Network/Timeout)'
]
counts = [50, 30, 10, 7, 3]
total_defects = sum(counts)

# Tính % thành phần và % tích lũy
percentages = [(c / total_defects) * 100 for c in counts]
cum_percentages = np.cumsum(percentages)

# 2. Khởi tạo biểu đồ với tỷ lệ cân đối chuẩn báo cáo
fig, ax1 = plt.subplots(figsize=(11.5, 6.8), dpi=300)

# Bảng màu phân biệt trực quan giữa Vital Few và Useful Many
bar_colors = ['#1d65a6', '#2b78b8', '#86b3d1', '#a8c8de', '#cadbe8']
curve_color = '#c92a2a'
threshold_color = '#d9480f'

# 3. Vẽ biểu đồ cột (Tần số xuất hiện lỗi)
x_pos = np.arange(len(categories))
bars = ax1.bar(x_pos, counts, color=bar_colors, edgecolor='#124370', linewidth=1.2, width=0.52, zorder=2)

ax1.set_xlabel('Phân loại Khuyết tật (Defect Categories)', fontsize=12, fontweight='bold', labelpad=12)
ax1.set_ylabel('Số lượng lỗi phát hiện (Tần số)', fontsize=12, fontweight='bold', color='#124370', labelpad=12)
ax1.tick_params(axis='y', labelcolor='#124370', labelsize=11)
ax1.tick_params(axis='x', labelsize=10.5)
ax1.set_xticks(x_pos)
ax1.set_xticklabels(categories)
ax1.set_ylim(0, 115)
ax1.grid(axis='y', linestyle='--', alpha=0.35, zorder=1)

# Ghi chú số lượng lỗi và % thành phần trên đỉnh cột
for bar, count, pct in zip(bars, counts, percentages):
    height = bar.get_height()
    ax1.annotate(f'{count} ({pct:.0f}%)',
                 xy=(bar.get_x() + bar.get_width() / 2, height),
                 xytext=(0, 5), textcoords="offset points",
                 ha='center', va='bottom', fontsize=10, fontweight='bold', color='#124370')

# 4. Trục thứ hai cho Đường cong phần trăm tích lũy
ax2 = ax1.twinx()
ax2.set_ylabel('Tỷ lệ phần trăm tích lũy (%)', fontsize=12, fontweight='bold', color=curve_color, labelpad=12)
line = ax2.plot(x_pos, cum_percentages, color=curve_color, marker='o', markersize=8,
                markerfacecolor='white', markeredgewidth=2.2, markeredgecolor=curve_color,
                linewidth=2.5, zorder=4, label='Tỷ lệ tích lũy (%)')
ax2.tick_params(axis='y', labelcolor=curve_color, labelsize=11)
ax2.yaxis.set_major_formatter(PercentFormatter(xmax=100))
ax2.set_ylim(0, 115)

# Ghi chú giá trị % tích lũy tại mỗi điểm nút (tuyệt đối không va chạm nhãn cột)
offsets = [
    (0, -18),   # Điểm 1 (50.0%): đặt phía dưới điểm tròn (trong thân cột)
    (-26, -12), # Điểm 2 (80.0%): phía dưới bên trái điểm cắt 80%
    (0, 12),    # Điểm 3 (90.0%): phía trên điểm tròn
    (0, 12),    # Điểm 4 (97.0%): phía trên điểm tròn
    (0, 12)     # Điểm 5 (100.0%): phía trên điểm tròn
]

for i, (cum_pct, (ox, oy)) in enumerate(zip(cum_percentages, offsets)):
    ax2.annotate(f'{cum_pct:.1f}%',
                 xy=(x_pos[i], cum_pct),
                 xytext=(ox, oy), textcoords="offset points",
                 ha='center', va='center', fontsize=9.5, fontweight='bold', color=curve_color,
                 bbox=dict(boxstyle="round,pad=0.25", facecolor="#fff5f5", edgecolor=curve_color, alpha=0.9, linewidth=0.8))

# 5. Đường tham chiếu Ngưỡng Pareto 80% (mốc quan trọng nhất)
ax2.axhline(80, color=threshold_color, linestyle='--', linewidth=1.8, zorder=3, alpha=0.95)
ax2.axvline(1, ymin=0, ymax=80/115, color=threshold_color, linestyle=':', linewidth=1.8, zorder=3, alpha=0.95)

# Đánh dấu điểm giao cắt 80% bằng hình thoi
ax2.plot(1, 80, marker='D', markersize=9, markerfacecolor=threshold_color, markeredgecolor='white', markeredgewidth=1.5, zorder=5)

# Callout Box giải thích quy tắc 80/20
ax2.annotate('Ngưỡng 80% (Quy tắc Pareto):\n2 nhóm lỗi đầu chiếm đúng 80% khuyết tật',
             xy=(1, 80), xytext=(1.35, 62),
             arrowprops=dict(facecolor=threshold_color, edgecolor=threshold_color, width=1.5, headwidth=8, headlength=8, shrink=0.08),
             fontsize=10.5, fontweight='bold', color='#b23b00',
             bbox=dict(boxstyle="round,pad=0.5", facecolor="#fff8e1", edgecolor="#ffa000", linewidth=1.2, alpha=0.95))

# 6. Nhãn phân vùng Vital Few (80%) vs Useful Many (20%) ở đỉnh biểu đồ thoáng mát
ax1.axvspan(-0.4, 1.45, facecolor='#e8f4fd', alpha=0.35, zorder=0)
ax1.text(0.52, 108, 'NHÓM TRỌNG YẾU (VITAL FEW - 80%)', ha='center', va='center',
         fontsize=10, fontweight='bold', color='#0b4a8b',
         bbox=dict(boxstyle="round,pad=0.3", facecolor="#d0e7fa", edgecolor="#1d65a6", alpha=0.85))

ax1.axvspan(1.55, 4.4, facecolor='#f8f9fa', alpha=0.35, zorder=0)
ax1.text(3.0, 108, 'NHÓM CÒN LẠI (USEFUL MANY - 20%)', ha='center', va='center',
         fontsize=10, fontweight='bold', color='#495057',
         bbox=dict(boxstyle="round,pad=0.3", facecolor="#e9ecef", edgecolor="#adb5bd", alpha=0.85))

# 7. Tiêu đề chính
plt.title('BIỂU ĐỒ PARETO 80/20 PHÂN LOẠI KHUYẾT TẬT PHẦN MỀM\n'
          'Dự án EVManager — Căn cứ Chương 5.3 Báo Cáo Kiểm Thử (Task QA-21 / Issue #152)',
          fontsize=13.5, fontweight='bold', pad=18, color='#111827')

fig.tight_layout()

# 8. Xuất file ảnh độ phân giải cao 300 DPI
output_png = r'd:\EVManager\docs\testing\pareto-defects-chart.png'
plt.savefig(output_png, dpi=300, bbox_inches='tight')
print(f"Bieu do Pareto da duoc xuat thanh cong tai: {output_png}")
