import React, { useState } from 'react';

export const EventsTab = () => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const events = [
    { id: 'SK-01', title: 'Tiệc Cưới Hoàng & Linh', customer: 'Nguyễn Văn Hoàng', type: 'Tiệc cưới', time: '15/10/2026 17:30', venue: 'Sảnh Kim Cương', budget: '250.000.000 ₫', status: 'Đã xác nhận', statusClass: 'status-confirmed' },
    { id: 'SK-02', title: 'Gala Dinner Techcombank', customer: 'Tập đoàn TechCorp', type: 'Hội nghị', time: '18/10/2026 18:00', venue: 'Sảnh Sapphire', budget: '180.000.000 ₫', status: 'Đang chuẩn bị', statusClass: 'status-pending' },
    { id: 'SK-03', title: 'Thôi Nôi Bé Bảo An', customer: 'Trần Thị Thu Linh', type: 'Sinh nhật', time: '22/10/2026 11:30', venue: 'Sảnh Ruby', budget: '45.000.000 ₫', status: 'Hoàn thành', statusClass: 'status-completed' },
  ];

  const filtered = events.filter((e) => {
    const matchFilter = filter === 'ALL' || e.status === filter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <section id="tab-events" className="admin-tab-pane active">
      <div className="tab-header-row">
        <div className="tab-summary-pills">
          <button
            type="button"
            className={`summary-pill ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Tất cả (<span id="countEvAll">{events.length}</span>)
          </button>
          <button
            type="button"
            className={`summary-pill confirmed ${filter === 'Đã xác nhận' ? 'active' : ''}`}
            onClick={() => setFilter('Đã xác nhận')}
          >
            Đã xác nhận (<span id="countEvConfirmed">1</span>)
          </button>
          <button
            type="button"
            className={`summary-pill pending ${filter === 'Đang chuẩn bị' ? 'active' : ''}`}
            onClick={() => setFilter('Đang chuẩn bị')}
          >
            Đang chuẩn bị (<span id="countEvPending">1</span>)
          </button>
          <button
            type="button"
            className={`summary-pill completed ${filter === 'Hoàn thành' ? 'active' : ''}`}
            onClick={() => setFilter('Hoàn thành')}
          >
            Hoàn thành (<span id="countEvCompleted">1</span>)
          </button>
        </div>
        <button className="btn btn-primary" id="btnOpenAddEventModal" type="button" onClick={() => alert('Mở form tạo sự kiện mới')}>
          ➕ Thêm sự kiện mới
        </button>
      </div>

      <div className="table-filter-bar">
        <div className="filter-group">
          <span className="filter-icon">🔍</span>
          <input
            type="text"
            id="eventSearchInput"
            placeholder="Tìm theo tên sự kiện, khách hàng, địa điểm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group select-group">
          <label htmlFor="eventStatusFilter">Trạng thái:</label>
          <select id="eventStatusFilter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang chuẩn bị">Đang chuẩn bị</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã SK</th>
                <th>Tên sự kiện</th>
                <th>Khách hàng</th>
                <th>Loại hình</th>
                <th>Thời gian</th>
                <th>Địa điểm</th>
                <th>Ngân sách</th>
                <th>Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody id="eventsTableBody">
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.id}</strong></td>
                  <td><strong>{e.title}</strong></td>
                  <td>{e.customer}</td>
                  <td>{e.type}</td>
                  <td>{e.time}</td>
                  <td>{e.venue}</td>
                  <td><strong>{e.budget}</strong></td>
                  <td><span className={`status-badge ${e.statusClass}`}>{e.status}</span></td>
                  <td className="text-right">
                    <button className="btn-action-small">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EventsTab;
