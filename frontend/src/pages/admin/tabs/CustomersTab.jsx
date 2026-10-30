import React, { useState } from 'react';
import CustomerFormModal from '../../../components/features/customer/CustomerFormModal';

export const CustomersTab = () => {
  const [tierFilter, setTierFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [customers, setCustomers] = useState([
    { id: 'KH-001', name: 'Nguyễn Văn Hoàng', phone: '0901 234 567', email: 'hoang.nv@gmail.com', tier: 'VIP', eventsCount: 1, spent: '250.000.000 ₫', joinDate: '15/08/2026' },
    { id: 'KH-002', name: 'Tập đoàn TechCorp', phone: '028 38 888 999', email: 'events@techcorp.vn', tier: 'VIP', eventsCount: 3, spent: '480.000.000 ₫', joinDate: '20/07/2026' },
    { id: 'KH-003', name: 'Trần Thị Thu Linh', phone: '0912 345 678', email: 'linh.tt@gmail.com', tier: 'Thường', eventsCount: 1, spent: '45.000.000 ₫', joinDate: '01/09/2026' },
    { id: 'KH-004', name: 'Lê Hoàng Nam', phone: '0988 777 666', email: 'nam.lh@gmail.com', tier: 'Tiềm năng', eventsCount: 0, spent: '0 ₫', joinDate: '25/09/2026' },
  ]);

  const handleSaveCustomer = (formData) => {
    const nextId = `KH-00${customers.length + 1}`;
    const newCustomer = {
      id: nextId,
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      tier: formData.tier,
      eventsCount: 0,
      spent: '0 ₫',
      joinDate: new Date().toLocaleDateString('vi-VN'),
    };
    setCustomers([newCustomer, ...customers]);
    alert(`Thêm mới khách hàng "${formData.fullName}" thành công với mã ${nextId}!`);
  };

  const filtered = customers.filter((c) => {
    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    const matchesSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <section id="tab-customers" className="admin-tab-pane active">
      <div className="tab-header-row">
        <div className="tab-summary-pills">
          <button
            type="button"
            className={`summary-pill ${tierFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setTierFilter('ALL')}
          >
            Tất cả (<span id="countCustAll">{customers.length}</span>)
          </button>
          <button
            type="button"
            className={`summary-pill vip ${tierFilter === 'VIP' ? 'active' : ''}`}
            onClick={() => setTierFilter('VIP')}
          >
            VIP (<span id="countCustVip">{customers.filter((c) => c.tier === 'VIP').length}</span>)
          </button>
          <button
            type="button"
            className={`summary-pill normal ${tierFilter === 'Thường' ? 'active' : ''}`}
            onClick={() => setTierFilter('Thường')}
          >
            Thường (<span id="countCustNormal">{customers.filter((c) => c.tier === 'Thường').length}</span>)
          </button>
          <button
            type="button"
            className={`summary-pill lead ${tierFilter === 'Tiềm năng' ? 'active' : ''}`}
            onClick={() => setTierFilter('Tiềm năng')}
          >
            Tiềm năng (<span id="countCustLead">{customers.filter((c) => c.tier === 'Tiềm năng').length}</span>)
          </button>
        </div>
        <button
          className="btn btn-primary"
          id="btnOpenAddCustomerModal"
          type="button"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Thêm khách hàng mới
        </button>
      </div>

      <div className="table-filter-bar">
        <div className="filter-group">
          <span className="filter-icon">🔍</span>
          <input
            type="text"
            id="customerSearchInput"
            placeholder="Tìm theo tên khách hàng, số điện thoại, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group select-group">
          <label htmlFor="customerTierFilter">Phân loại khách hàng:</label>
          <select id="customerTierFilter" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
            <option value="ALL">Tất cả nhóm</option>
            <option value="VIP">Khách VIP</option>
            <option value="Thường">Khách Thường</option>
            <option value="Tiềm năng">Khách Tiềm Năng</option>
          </select>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã KH</th>
                <th>Họ và tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Phân loại</th>
                <th>Sự kiện</th>
                <th>Tổng chi tiêu</th>
                <th>Ngày tham gia</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody id="customersTableBody">
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>
                    <span className={`status-badge ${c.tier === 'VIP' ? 'status-confirmed' : c.tier === 'Tiềm năng' ? 'status-pending' : 'status-completed'}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td>{c.eventsCount} sự kiện</td>
                  <td><strong>{c.spent}</strong></td>
                  <td>{c.joinDate}</td>
                  <td className="text-right">
                    <button className="btn-action-small">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL THÊM KHÁCH HÀNG VỚI ZOD VALIDATION */}
      <CustomerFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCustomer}
      />
    </section>
  );
};

export default CustomersTab;
