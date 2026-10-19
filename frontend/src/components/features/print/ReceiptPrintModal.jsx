import React from 'react';

export const ReceiptPrintModal = ({ isOpen, onClose, receiptData }) => {
  if (!isOpen || !receiptData) return null;

  const data = {
    id: receiptData.id || 'PT-20261016-001',
    contractId: receiptData.contractId || 'HD-20261016-001',
    date: receiptData.date || new Date().toLocaleDateString('vi-VN'),
    customer: receiptData.customer || 'Nguyễn Văn Hoàng',
    customerPhone: receiptData.customerPhone || '0901 234 567',
    customerAddress: receiptData.customerAddress || '123 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    amount: receiptData.amount || 75000000,
    amountInWords: receiptData.amountInWords || 'Bảy mươi lăm triệu đồng chẵn',
    reason: receiptData.reason || 'Thu tiền đặt cọc đợt 1 (30%) theo Hợp đồng tổ chức tiệc cưới',
    method: receiptData.method || 'Chuyển khoản qua ngân hàng Vietcombank',
    cashier: receiptData.cashier || 'Nguyễn Thảo (Thủ quỹ)',
    accountant: receiptData.accountant || 'Lê Thị Mỹ Hạnh (Kế toán trưởng)',
  };

  const fmt = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-modal open" id="receiptPrintModal" style={{ zIndex: 9999 }}>
      <div className="modal-backdrop no-print" onClick={onClose}></div>
      <div
        className="modal-card"
        style={{
          maxWidth: '720px',
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
              🧾 Bản In Phiếu Thu Tiền Chuẩn Kế Toán (A4/A5)
            </h3>
            <small style={{ color: '#64748b' }}>
              Số phiếu: <strong>{data.id}</strong> | Quy chuẩn kế toán UC-10
            </small>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <span>🖨️</span> In Phiếu Thu
            </button>
            <button type="button" className="modal-close" onClick={onClose} style={{ marginLeft: '12px' }}>
              ✕
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT */}
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
              maxWidth: '680px',
              margin: '0 auto',
              padding: '36px 40px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '12pt',
              lineHeight: 1.5,
              color: '#000000',
            }}
          >
            {/* HEADER THÔNG TIN ĐƠN VỊ VÀ MẪU BIỂU */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontSize: '10.5pt', lineHeight: 1.3 }}>
                <strong>CÔNG TY CỔ PHẦN EVMANAGER</strong><br />
                Đ/c: Số 08 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM<br />
                Mã số thuế: 0314899999<br />
                Hotline: 1900 8888
              </div>
              <div style={{ textAlign: 'right', fontSize: '10pt', fontStyle: 'italic' }}>
                <strong>Mẫu số 01 – TT</strong><br />
                (Ban hành theo Thông tư số 200/2014/TT-BTC<br />
                ngày 22/12/2014 của Bộ Tài chính)<br />
                Quyển số: 01 / EVM<br />
                Số: <strong>{data.id}</strong>
              </div>
            </div>

            {/* TIÊU ĐỀ PHIẾU THU */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '4px 0', textTransform: 'uppercase' }}>
                PHIẾU THU TIỀN
              </h2>
              <div style={{ fontSize: '11pt', fontStyle: 'italic' }}>
                Ngày {data.date.split('/')[0]} tháng {data.date.split('/')[1]} năm {data.date.split('/')[2]}
              </div>
              <div style={{ fontSize: '10.5pt', color: '#475569', marginTop: '2px' }}>
                (Liên 2: Giao cho người nộp tiền)
              </div>
            </div>

            {/* NỘI DUNG CHI TIẾT */}
            <div style={{ lineHeight: 1.8, fontSize: '12pt', marginBottom: '20px' }}>
              <div>- Họ và tên người nộp tiền: <strong>{data.customer}</strong></div>
              <div>- Địa chỉ liên hệ: {data.customerAddress}</div>
              <div>- Số điện thoại: <strong>{data.customerPhone}</strong></div>
              <div>- Kèm theo hợp đồng số: <strong>{data.contractId}</strong></div>
              <div>- Lý do thu: {data.reason}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                <span>- Số tiền thực thu: </span>
                <span style={{
                  fontSize: '14pt',
                  fontWeight: 'bold',
                  color: '#087f82',
                  marginLeft: '8px',
                  background: '#f1f5f9',
                  padding: '2px 10px',
                  borderRadius: '4px',
                }}>
                  {fmt(data.amount)}
                </span>
              </div>
              <div>- Viết bằng chữ: <em style={{ fontWeight: 'bold' }}>{data.amountInWords}</em></div>
              <div>- Hình thức thanh toán: {data.method}</div>
            </div>

            {/* KHU VỰC CHỮ KÝ 4 BÊN */}
            <div className="print-avoid-break" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', marginTop: '30px' }}>
              <div>
                <strong style={{ fontSize: '10pt', textTransform: 'uppercase' }}>Giám đốc</strong><br />
                <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>(Ký, đóng dấu)</span>
                <div style={{ height: '60px' }}></div>
                <strong style={{ fontSize: '10pt' }}>Trần Quang Huy</strong>
              </div>

              <div>
                <strong style={{ fontSize: '10pt', textTransform: 'uppercase' }}>Kế toán trưởng</strong><br />
                <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>(Ký, họ tên)</span>
                <div style={{ height: '60px' }}></div>
                <strong style={{ fontSize: '10pt' }}>Lê Thị Mỹ Hạnh</strong>
              </div>

              <div>
                <strong style={{ fontSize: '10pt', textTransform: 'uppercase' }}>Người nộp tiền</strong><br />
                <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>(Ký, họ tên)</span>
                <div style={{ height: '60px' }}></div>
                <strong style={{ fontSize: '10pt' }}>{data.customer}</strong>
              </div>

              <div>
                <strong style={{ fontSize: '10pt', textTransform: 'uppercase' }}>Thủ quỹ</strong><br />
                <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>(Ký, họ tên)</span>
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    border: '1.5px solid #087f82',
                    color: '#087f82',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    transform: 'rotate(-5deg)',
                  }}>
                    ✓ ĐÃ THU ĐỦ
                  </div>
                </div>
                <strong style={{ fontSize: '10pt' }}>Nguyễn Thảo</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '24px', fontSize: '9.5pt', fontStyle: 'italic', color: '#64748b' }}>
              Đã nhận đủ số tiền (viết bằng chữ): {data.amountInWords}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPrintModal;
