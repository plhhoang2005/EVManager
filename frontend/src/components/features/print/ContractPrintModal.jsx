import React from 'react';

export const ContractPrintModal = ({ isOpen, onClose, contractData }) => {
  if (!isOpen || !contractData) return null;

  const data = {
    id: contractData.id || 'HD-20261016-001',
    date: contractData.date || new Date().toLocaleDateString('vi-VN'),
    customer: contractData.customer || 'Nguyễn Văn Hoàng',
    customerPhone: contractData.customerPhone || '0901 234 567',
    customerEmail: contractData.customerEmail || 'hoang.nv@gmail.com',
    customerAddress: contractData.customerAddress || '123 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    customerIDCard: contractData.customerIDCard || '079095012345 (Cấp ngày 12/03/2021 tại Cục CSQLHC về TTXH)',
    event: contractData.event || 'Tiệc Cưới Hoàng Gia: Nguyễn Văn Hoàng & Lê Thị Mai Linh',
    venue: contractData.venue || 'Sảnh Kim Cương (Diamond Banquet Hall) - Tầng 3',
    eventDate: contractData.eventDate || '28/11/2026 (Thứ Bảy, Ca Tối: 17:30 - 21:30)',
    tableCount: contractData.tableCount || 35,
    spareTables: contractData.spareTables || 3,
    menuName: contractData.menuName || 'Thực đơn Kim Cương Thượng Hạng (7 món Á - Âu)',
    menuPricePerTable: contractData.menuPricePerTable || 4500000,
    dishes: contractData.dishes || [
      'Khai vị 3 món: Gỏi ngó sen tôm thịt, Chả giò hoàng kim, Súp sò điệp măng tây',
      'Món chính 1: Gà ta hấp lá chanh kèm xôi chiên phồng',
      'Món chính 2: Bò Úc áp chảo sốt vang đỏ nấm truffle',
      'Món chính 3: Cá chẽm hấp Hồng Kông thượng hạng',
      'Món chính 4: Lẩu thái hải sản Tom Yum kèm bún tươi',
      'Tráng miệng: Chè hạt sen long nhãn tiến vua',
    ],
    services: contractData.services || [
      { name: 'Gói âm thanh, ánh sáng & Màn hình LED P3 sân khấu', price: 15000000 },
      { name: 'Trang trí hoa tươi lễ đường & Bàn đón khách Reception', price: 18000000 },
      { name: 'MC dẫn chương trình tiệc cưới chuyên nghiệp & Vũ đoàn mở màn', price: 8000000 },
      { name: 'Tháp bánh cưới 5 tầng nghệ thuật & Champagne khai tiệc', price: 4000000 },
    ],
    venuePrice: contractData.venuePrice || 25000000,
    discount: contractData.discount || 10000000,
    total: contractData.total || 250000000,
    deposit: contractData.deposit || 75000000, // 30%
    remaining: contractData.remaining || 175000000, // 70%
    status: contractData.status || 'Đã ký kết',
  };

  const fmt = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-modal open" id="contractPrintModal" style={{ zIndex: 9999 }}>
      <div className="modal-backdrop no-print" onClick={onClose}></div>
      <div
        className="modal-card"
        style={{
          maxWidth: '850px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#f8fafc',
          padding: 0,
        }}
      >
        {/* MODAL ACTION BAR (NO PRINT) */}
        <div
          className="modal-header no-print"
          style={{
            background: '#ffffff',
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
              📄 Bản In Hợp Đồng Tiệc Cưới Chuẩn A4
            </h3>
            <small style={{ color: '#64748b' }}>
              Mã hợp đồng: <strong>{data.id}</strong> | Quy chuẩn pháp lý UC-09
            </small>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <span>🖨️</span> In Hợp Đồng (A4) / Lưu PDF
            </button>
            <button type="button" className="modal-close" onClick={onClose} style={{ marginLeft: '12px' }}>
              ✕
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 CONTENT */}
        <div
          className="modal-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            background: '#e2e8f0',
          }}
        >
          <div
            className="printable-document"
            style={{
              background: '#ffffff',
              maxWidth: '794px', // Khổ A4 ~ 210mm x 297mm tại 96 DPI
              minHeight: '1123px',
              margin: '0 auto',
              padding: '40px 48px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '13pt',
              lineHeight: 1.5,
              color: '#000000',
            }}
          >
            {/* 1. QUỐC HIỆU TIÊU NGỮ */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13pt', textTransform: 'uppercase' }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '13pt' }}>
                Độc lập – Tự do – Hạnh phúc
              </div>
              <div style={{ fontSize: '11pt', marginTop: '2px' }}>
                -----------------o0o-----------------
              </div>
            </div>

            {/* 2. TIÊU ĐỀ HỢP ĐỒNG */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '8px 0 4px 0', textTransform: 'uppercase' }}>
                HỢP ĐỒNG DỊCH VỤ TỔ CHỨC TIỆC CƯỚI
              </h2>
              <div style={{ fontSize: '11pt', fontStyle: 'italic' }}>
                Số: <strong>{data.id}</strong> / HĐKT-EVM
              </div>
            </div>

            {/* CĂN CỨ PHÁP LÝ */}
            <div style={{ fontSize: '11pt', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.4 }}>
              - Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015 và các văn bản hướng dẫn thi hành;<br />
              - Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14/06/2005;<br />
              - Căn cứ vào nhu cầu tổ chức sự kiện và năng lực cung ứng dịch vụ của hai Bên.
            </div>

            <div style={{ fontSize: '12pt', marginBottom: '16px' }}>
              Hôm nay, ngày {data.date.split('/')[0]} tháng {data.date.split('/')[1]} năm {data.date.split('/')[2]}, tại Trung tâm Hội nghị & Tiệc cưới EVManager, chúng tôi gồm có:
            </div>

            {/* BÊN A */}
            <div style={{ marginBottom: '14px', borderLeft: '3px solid #087f82', paddingLeft: '12px' }}>
              <strong style={{ textTransform: 'uppercase' }}>BÊN CUNG CẤP DỊCH VỤ (BÊN A):</strong><br />
              <strong>CÔNG TY CỔ PHẦN TỔ CHỨC SỰ KIỆN & ẨM THỰC EVMANAGER (LV34 EVENTS)</strong><br />
              - Địa chỉ: Số 08 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh<br />
              - Đại diện: <strong>Ông Trần Quang Huy</strong> &nbsp;&nbsp;&nbsp;&nbsp; Chức vụ: Giám đốc Điều hành<br />
              - Mã số thuế: 0314899999 &nbsp;&nbsp;&nbsp;&nbsp; Hotline: 1900 8888 (24/7)<br />
              - Số tài khoản: 1111 8888 9999 tại Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)
            </div>

            {/* BÊN B */}
            <div style={{ marginBottom: '18px', borderLeft: '3px solid #d9763d', paddingLeft: '12px' }}>
              <strong style={{ textTransform: 'uppercase' }}>BÊN SỬ DỤNG DỊCH VỤ (BÊN B):</strong><br />
              - Khách hàng đại diện: <strong>{data.customer}</strong><br />
              - Số CMND / CCCD: {data.customerIDCard}<br />
              - Địa chỉ thường trú: {data.customerAddress}<br />
              - Điện thoại liên hệ: <strong>{data.customerPhone}</strong> &nbsp;&nbsp;&nbsp;&nbsp; Email: {data.customerEmail}
            </div>

            <div style={{ marginBottom: '14px' }}>
              Hai bên cùng thống nhất ký kết Hợp đồng dịch vụ tổ chức tiệc cưới với các điều khoản cụ thể như sau:
            </div>

            {/* ĐIỀU 1 */}
            <div style={{ marginBottom: '14px' }}>
              <strong>ĐIỀU 1: THỜI GIAN, ĐỊA ĐIỂM VÀ QUY MÔ TỔ CHỨC</strong><br />
              1.1. Tên sự kiện: <strong>{data.event}</strong><br />
              1.2. Thời gian tổ chức: <strong>{data.eventDate}</strong><br />
              1.3. Địa điểm sảnh tiệc: <strong>{data.venue}</strong><br />
              1.4. Quy mô bàn tiệc: <strong>{data.tableCount} bàn chính thức</strong> (+ {data.spareTables} bàn sơ cua dự phòng).
            </div>

            {/* ĐIỀU 2 */}
            <div style={{ marginBottom: '14px' }}>
              <strong>ĐIỀU 2: CHI TIẾT THỰC ĐƠN VÀ DỊCH VỤ ĐÍNH KÈM</strong><br />
              2.1. <strong>Tên gói thực đơn:</strong> {data.menuName} (Đơn giá: {fmt(data.menuPricePerTable)}/bàn)<br />
              <ul style={{ margin: '4px 0 8px 20px', padding: 0 }}>
                {data.dishes.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
              2.2. <strong>Các dịch vụ tổ chức trọn gói bổ sung:</strong>
              <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '8px 0', fontSize: '11pt' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ border: '1px solid #333', padding: '6px' }}>STT</th>
                    <th style={{ border: '1px solid #333', padding: '6px' }}>Hạng mục dịch vụ</th>
                    <th style={{ border: '1px solid #333', padding: '6px' }}>Thành tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.services.map((s, idx) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #333', padding: '6px' }}>{s.name}</td>
                      <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'right' }}>{fmt(s.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ĐIỀU 3 */}
            <div style={{ marginBottom: '14px' }}>
              <strong>ĐIỀU 3: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN</strong><br />
              3.1. Tổng giá trị Hợp đồng trọn gói (đã bao gồm phí sảnh, thực đơn, dịch vụ, phí phục vụ 5% và VAT 8%):
              <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', margin: '6px 0', fontWeight: 'bold', fontSize: '13pt', color: '#087f82' }}>
                TỔNG GIÁ TRỊ HỢP ĐỒNG: {fmt(data.total)}
              </div>
              3.2. <strong>Tiến độ thanh toán chia làm 02 đợt theo quy định trung tâm:</strong><br />
              - <strong>Đợt 1 (Đặt cọc 30%):</strong> Bên B thanh toán ngay khi ký hợp đồng số tiền: <strong>{fmt(data.deposit)}</strong> để chính thức khóa lịch sảnh tiệc.<br />
              - <strong>Đợt 2 (Thanh toán 70% còn lại):</strong> Bên B thanh toán toàn bộ số tiền còn lại: <strong>{fmt(data.remaining)}</strong> trước ngày diễn ra sự kiện tối thiểu 03 (ba) ngày làm việc.<br />
              - <strong>Hình thức thanh toán:</strong> Chuyển khoản ngân hàng hoặc tiền mặt tại quầy thu ngân.
            </div>

            {/* ĐIỀU 4 & 5 */}
            <div className="print-avoid-break" style={{ marginBottom: '16px' }}>
              <strong>ĐIỀU 4: ĐIỀU KHOẢN BẢO HÀNH, HỦY CỌC VÀ TRÁCH NHIỆM TÀI SẢN</strong><br />
              4.1. Bên A cam kết cung cấp đúng thực đơn đạt tiêu chuẩn Vệ sinh An toàn Thực phẩm (VSATTP), bảo đảm sảnh tiệc, trang thiết bị âm thanh, ánh sáng vận hành hoàn hảo.<br />
              4.2. Trường hợp Bên B đơn phương hủy tiệc mà không do sự kiện bất khả kháng (thiên tai, dịch bệnh theo quyết định cơ quan nhà nước): Bên B sẽ không được hoàn lại tiền cọc Đợt 1.<br />
              4.3. Bên B có trách nhiệm bảo quản cơ sở vật chất sảnh tiệc và bồi hoàn chi phí nếu khách mời gây hư hại tài sản trung tâm theo biên bản kiểm kê sau tiệc.
            </div>

            {/* ĐIỀU 6 */}
            <div className="print-avoid-break" style={{ marginBottom: '24px' }}>
              <strong>ĐIỀU 5: HIỆU LỰC HỢP ĐỒNG</strong><br />
              Hợp đồng này có hiệu lực kể từ ngày ký và sau khi Bên A nhận đủ khoản tiền cọc Đợt 1 (30%). Hợp đồng được lập thành 02 (hai) bản gốc có giá trị pháp lý như nhau, mỗi bên giữ 01 bản để thực hiện.
            </div>

            {/* CHỮ KÝ HAI BÊN */}
            <div className="print-avoid-break" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center', marginTop: '30px' }}>
              <div>
                <strong style={{ textTransform: 'uppercase' }}>ĐẠI DIỆN BÊN B (KHÁCH HÀNG)</strong><br />
                <span style={{ fontSize: '10pt', fontStyle: 'italic' }}>(Ký và ghi rõ họ tên)</span>
                <div style={{ height: '80px' }}></div>
                <strong>{data.customer}</strong>
              </div>

              <div>
                <strong style={{ textTransform: 'uppercase' }}>ĐẠI DIỆN BÊN A (TRUNG TÂM EVMANAGER)</strong><br />
                <span style={{ fontSize: '10pt', fontStyle: 'italic' }}>(Ký tên, đóng dấu và ghi rõ họ tên)</span>
                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    border: '2px solid #dc2626',
                    color: '#dc2626',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontWeight: 'bold',
                    fontSize: '11pt',
                    transform: 'rotate(-5deg)',
                  }}>
                    ✓ ĐÃ ĐỐI SOÁT & KÝ DUYỆT
                  </div>
                </div>
                <strong>Trần Quang Huy</strong><br />
                <small style={{ color: '#64748b' }}>Giám đốc Điều hành</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPrintModal;
