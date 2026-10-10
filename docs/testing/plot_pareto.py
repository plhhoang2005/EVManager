import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter
import sys
import os

# Thiết lập font hỗ trợ tiếng Việt nếu cần (chọn font mặc định)
plt.rcParams['font.sans-serif'] = ['Arial', 'Tahoma', 'DejaVu Sans', 'sans-serif']

# Dữ liệu
labels = ['Lệch ngày giờ', 'Tính toán sai', 'In ấn thiếu', 'Lỗi giao diện', 'Mất kết nối']
counts = [50, 30, 10, 7, 3]

# Tính phần trăm tích lũy
total = sum(counts)
cum_counts = []
c = 0
for count in counts:
    c += count
    cum_counts.append(c / total * 100)

fig, ax1 = plt.subplots(figsize=(10, 6))

# Biểu đồ cột
color = '#4C72B0'
ax1.set_xlabel('Loại lỗi (Khuyết tật)', fontsize=12)
ax1.set_ylabel('Số lượng (Tần số)', color=color, fontsize=12)
bars = ax1.bar(labels, counts, color=color, width=0.6)
ax1.tick_params(axis='y', labelcolor=color)
ax1.set_ylim(0, 100)

# Thêm số lượng trên cột
for bar in bars:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2, yval + 1, yval, ha='center', va='bottom', color=color, fontweight='bold')

# Đường cong phần trăm tích lũy
ax2 = ax1.twinx()
color = '#C44E52'
ax2.set_ylabel('Phần trăm tích lũy (%)', color=color, fontsize=12)
ax2.plot(labels, cum_counts, color=color, marker='o', ms=8, linewidth=2)
ax2.tick_params(axis='y', labelcolor=color)
ax2.yaxis.set_major_formatter(PercentFormatter())
ax2.set_ylim(0, 110)

# Vẽ đường nét đứt tại mốc 80%
ax2.axhline(80, color='gray', linestyle='dashed', alpha=0.7)
ax2.text(2.5, 82, 'Mốc 80%', color='gray', fontweight='bold')

# Tiêu đề biểu đồ
plt.title('Biểu đồ Pareto 80/20 Phân loại Khuyết tật (EVManager)', fontsize=14, fontweight='bold', pad=20)
fig.tight_layout()

# Lưu biểu đồ
output_path = r'd:\EVManager\docs\testing\pareto-defects-chart.png'
plt.savefig(output_path, dpi=300)
print(f"Chart saved successfully at {output_path}")
