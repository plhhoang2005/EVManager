import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const OverviewTab = ({ onNavigateToEvents }) => {
  const quickEvents = [
    { title: 'Tiệc Cưới Hoàng & Linh', customer: 'Nguyễn Văn Hoàng', status: 'Đã xác nhận', statusClass: 'status-confirmed' },
    { title: 'Gala Dinner Techcombank', customer: 'Tập đoàn TechCorp', status: 'Đang chuẩn bị', statusClass: 'status-pending' },
    { title: 'Thôi Nôi Bé Bảo An', customer: 'Trần Thị Thu Linh', status: 'Hoàn thành', statusClass: 'status-completed' },
  ];

  const chartData = {
    labels: ['T5', 'T6', 'T7', 'T8', 'T9', 'T10'],
    datasets: [
      {
        label: 'Doanh thu (Triệu VNĐ)',
        data: [180, 240, 290, 350, 410, 485],
        backgroundColor: [
          '#cbd5e1',
          '#cbd5e1',
          '#cbd5e1',
          '#cbd5e1',
          '#cbd5e1',
          '#087f82',
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} Triệu VNĐ`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => `${v}M` },
        grid: { color: '#f1f5f9' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <section id="tab-dashboard" className="admin-tab-pane active">
      <div className="overview-grid">
        <article className="metric-card metric-card--revenue">
          <div className="metric-header">
            <div className="metric-icon">₫</div>
            <span className="metric-trend positive">+14.5%</span>
          </div>
          <div className="metric-body">
            <h2>Tổng doanh thu</h2>
            <p id="doanhThu" className="metric-value">485.000.000 ₫</p>
            <p className="metric-note">Doanh thu sự kiện tích lũy</p>
          </div>
        </article>

        <article className="metric-card metric-card--events">
          <div className="metric-header">
            <div className="metric-icon">🎉</div>
            <span className="metric-trend positive" id="trendEventsText">+3 sự kiện</span>
          </div>
          <div className="metric-body">
            <h2>Số sự kiện</h2>
            <p id="soSuKien" className="metric-value">28</p>
            <p className="metric-note">Sự kiện đang quản lý</p>
          </div>
        </article>

        <article className="metric-card metric-card--customers">
          <div className="metric-header">
            <div className="metric-icon">👥</div>
            <span className="metric-trend positive" id="trendCustomersText">12 VIP</span>
          </div>
          <div className="metric-body">
            <h2>Khách hàng</h2>
            <p id="soKhachHang" className="metric-value">45</p>
            <p className="metric-note">Đối tác & Khách cá nhân</p>
          </div>
        </article>

        <article className="metric-card metric-card--contracts">
          <div className="metric-header">
            <div className="metric-icon">⌛</div>
            <span className="metric-trend warning">Cần xử lý</span>
          </div>
          <div className="metric-body">
            <h2>Hợp đồng chờ</h2>
            <p id="hopDongCho" className="metric-value">4</p>
            <p className="metric-note">Đang chờ chuẩn bị</p>
          </div>
        </article>
      </div>

      <div className="content-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">HIỆU SUẤT TÀI CHÍNH (CHART.JS)</p>
              <h2>Biểu đồ doanh thu 6 tháng gần nhất</h2>
            </div>
            <span className="panel-period">Đơn vị: Triệu VNĐ</span>
          </div>
          <div className="chart-container" style={{ height: '260px', padding: '10px 0' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </article>

        <article className="panel quick-events-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">SỰ KIỆN GẦN ĐÂY</p>
              <h2>Danh sách mới nhất</h2>
            </div>
            <button className="btn-action" id="btnGoToEvents" type="button" onClick={onNavigateToEvents}>
              Xem tất cả →
            </button>
          </div>
          <div className="table-responsive">
            <table className="admin-table mini-table">
              <thead>
                <tr>
                  <th>Sự kiện</th>
                  <th>Khách hàng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody id="quickEventsTableBody">
                {quickEvents.map((e, idx) => (
                  <tr key={idx}>
                    <td><strong>{e.title}</strong></td>
                    <td>{e.customer}</td>
                    <td><span className={`status-badge ${e.statusClass}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};

export default OverviewTab;
