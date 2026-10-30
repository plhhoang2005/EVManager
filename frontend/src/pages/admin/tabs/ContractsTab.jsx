import React, { useState } from 'react';
import ContractPrintModal from '../../../components/features/print/ContractPrintModal';

export const ContractsTab = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const contracts = [
    {
      id: 'HD-2026-001',
      customer: 'Nguyễn Văn Hoàng',
      customerPhone: '0901 234 567',
      event: 'Tiệc Cưới Hoàng & Linh',
      venue: 'Sảnh Kim Cương (Diamond Hall) - Tầng 3',
      total: 250000000,
      totalFormatted: '250.000.000 ₫',
      deposit: 75000000,
      depositFormatted: '75.000.000 ₫',
      status: 'Đã ký kết',
      statusClass: 'status-confirmed',
    },
    {
      id: 'HD-2026-002',
      customer: 'Tập đoàn TechCorp',
      customerPhone: '028 38 888 999',
      event: 'Gala Dinner Techcombank',
      venue: 'Sảnh Hoàng Gia (Imperial Hall) - Tầng 2',
      total: 180000000,
      totalFormatted: '180.000.000 ₫',
      deposit: 54000000,
      depositFormatted: '54.000.000 ₫',
      status: 'Chờ duyệt',
      statusClass: 'status-pending',
    },
    {
      id: 'HD-2026-003',
      customer: 'Trần Thị Thu Linh',
      customerPhone: '0912 345 678',
      event: 'Thôi Nôi Bé Bảo An',
      venue: 'Sảnh Ngọc Bích (Emerald Hall) - Tầng 1',
      total: 45000000,
      totalFormatted: '45.000.000 ₫',
      deposit: 15000000,
      depositFormatted: '15.000.000 ₫',
      status: 'Hoàn thành',
      statusClass: 'status-completed',
    },
  ];

  const handleOpenPrint = (contract) => {
    setSelectedContract(contract);
    setShowPrintModal(true);
  };

  return (
    <section id="tab-contracts" className="admin-tab-pane active">
      <div className="tab-header-row">
        <div>
          <h2>Quản lý hợp đồng dịch vụ</h2>
          <p className="section-subtitle" style={{ margin: 0 }}>Theo dõi tiến độ ký kết và dòng tiền đặt cọc</p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleOpenPrint(contracts[0])}
        >
          ➕ Tạo hợp đồng mới
        </button>
      </div>

      <div className="panel table-panel" style={{ marginTop: '20px' }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Số hợp đồng</th>
                <th>Khách hàng</th>
                <th>Sự kiện</th>
                <th>Tổng giá trị</th>
                <th>Tiền cọc (30%)</th>
                <th>Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td>{c.customer}</td>
                  <td><strong>{c.event}</strong></td>
                  <td><strong>{c.totalFormatted}</strong></td>
                  <td>{c.depositFormatted}</td>
                  <td><span className={`status-badge ${c.statusClass}`}>{c.status}</span></td>
                  <td className="text-right">
                    <button
                      className="btn-action-small"
                      onClick={() => handleOpenPrint(c)}
                      title="Xem và In bản hợp đồng khổ A4"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>🖨️</span> Xem & In A4
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL IN HỢP ĐỒNG TIỆC CƯỚI CHUẨN A4 */}
      <ContractPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        contractData={selectedContract}
      />
    </section>
  );
};

export default ContractsTab;
