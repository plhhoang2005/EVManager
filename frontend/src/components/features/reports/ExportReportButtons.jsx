import React from 'react';
import * as XLSX from 'xlsx';

export const ExportReportButtons = ({ contracts, totalRevenue, totalPaid, totalRemaining, onPrintReport }) => {
  const handleExportXLSX = () => {
    try {
      // 1. Tạo sheet dữ liệu chi tiết các hợp đồng
      const detailRows = contracts.map((c, index) => ({
        'STT': index + 1,
        'Mã Hợp Đồng': c.id,
        'Khách Hàng': c.customer,
        'Số Điện Thoại': c.customerPhone || '0901234567',
        'Tên Sự Kiện': c.event,
        'Sảnh Tiệc': c.venue || 'Sảnh Kim Cương',
        'Ngày Ký Kết': c.date || '15/10/2026',
        'Tổng Giá Trị (VNĐ)': c.total,
        'Đã Thanh Toán (VNĐ)': c.paid || Math.round(c.total * 0.3),
        'Công Nợ Còn Lại (VNĐ)': c.remaining || Math.round(c.total * 0.7),
        'Tỷ Lệ (%)': c.percent || (c.paid ? Math.round((c.paid / c.total) * 100) : 30),
        'Trạng Thái HĐ': c.status,
      }));

      // 2. Tạo sheet tổng hợp KPI
      const summaryRows = [
        { 'Chỉ số KPI': 'Tổng doanh thu hợp đồng ký kết', 'Giá trị (VNĐ)': totalRevenue },
        { 'Chỉ số KPI': 'Tổng thực thu dòng tiền', 'Giá trị (VNĐ)': totalPaid },
        { 'Chỉ số KPI': 'Tổng công nợ còn phải thu', 'Giá trị (VNĐ)': totalRemaining },
        { 'Chỉ số KPI': 'Số lượng hợp đồng', 'Giá trị (VNĐ)': contracts.length },
        { 'Chỉ số KPI': 'Ngày xuất báo cáo', 'Giá trị (VNĐ)': new Date().toLocaleDateString('vi-VN') },
      ];

      // 3. Tạo Workbook với 2 sheets
      const wb = XLSX.utils.book_new();

      const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng quan KPI');

      const wsDetails = XLSX.utils.json_to_sheet(detailRows);
      XLSX.utils.book_append_sheet(wb, wsDetails, 'Chi tiết Hợp đồng');

      // Tùy chỉnh độ rộng cột cho đẹp
      wsDetails['!cols'] = [
        { wch: 6 },  // STT
        { wch: 15 }, // Mã HĐ
        { wch: 22 }, // Khách hàng
        { wch: 14 }, // SĐT
        { wch: 28 }, // Sự kiện
        { wch: 18 }, // Sảnh
        { wch: 14 }, // Ngày ký
        { wch: 18 }, // Tổng tiền
        { wch: 18 }, // Đã thanh toán
        { wch: 18 }, // Còn lại
        { wch: 10 }, // Tỷ lệ
        { wch: 16 }, // Trạng thái
      ];

      // 4. Xuất file .xlsx
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `Bao_Cao_Doanh_Thu_EVManager_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error('Lỗi khi xuất file Excel .xlsx:', err);
      alert('Đã xảy ra lỗi khi xuất file Excel. Vui lòng thử lại!');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={handleExportXLSX}
        className="btn btn-outline"
        title="Tải bảng tính Excel định dạng chuẩn .xlsx"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          background: '#ffffff',
          color: '#087f82',
          borderColor: '#087f82',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        <span>📊</span> Xuất Excel (.xlsx)
      </button>

      <button
        type="button"
        onClick={onPrintReport || (() => window.print())}
        className="btn btn-primary"
        title="In hoặc Lưu báo cáo tài chính sang PDF"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        <span>🖨️</span> In Báo Cáo / Xuất PDF
      </button>
    </div>
  );
};

export default ExportReportButtons;
