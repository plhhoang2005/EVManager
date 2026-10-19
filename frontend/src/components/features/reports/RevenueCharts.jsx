import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Đăng ký các modules của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const RevenueCharts = ({ revenueData, venueData }) => {
  // Dữ liệu 6 tháng mặc định (khớp kịch bản demo và CSDL)
  const monthlyLabels = revenueData?.labels || ['T5/2026', 'T6/2026', 'T7/2026', 'T8/2026', 'T9/2026', 'T10/2026'];
  const contractRevenue = revenueData?.contractRevenue || [180, 240, 290, 350, 410, 485]; // Triệu VNĐ
  const receivedCash = revenueData?.receivedCash || [120, 190, 250, 300, 360, 420]; // Triệu VNĐ

  // 1. Dữ liệu biểu đồ cột kép (Doanh thu Hợp đồng vs Thực thu tiền mặt)
  const barChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Doanh số Hợp đồng (Triệu VNĐ)',
        data: contractRevenue,
        backgroundColor: 'rgba(8, 127, 130, 0.85)',
        borderColor: '#087f82',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Thực thu dòng tiền (Triệu VNĐ)',
        data: receivedCash,
        backgroundColor: 'rgba(217, 118, 61, 0.85)',
        borderColor: '#d9763d',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'inherit', size: 12, weight: 600 },
          color: '#334155',
          boxWidth: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.raw.toLocaleString('vi-VN')} Triệu VNĐ`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}M`,
          color: '#64748b',
        },
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        ticks: {
          color: '#64748b',
          font: { weight: 600 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // 2. Dữ liệu biểu đồ tròn tỷ trọng doanh thu theo Sảnh
  const venueLabels = venueData?.labels || ['Sảnh Kim Cương', 'Sảnh Hoàng Gia', 'Sảnh Ngọc Bích', 'Sảnh Ruby', 'Sảnh Bạch Kim'];
  const venueRevenue = venueData?.data || [185, 120, 80, 55, 45]; // Triệu VNĐ

  const doughnutData = {
    labels: venueLabels,
    datasets: [
      {
        data: venueRevenue,
        backgroundColor: [
          '#087f82',
          '#d9763d',
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
        ],
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'inherit', size: 11 },
          color: '#475569',
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const sum = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / sum) * 100).toFixed(1);
            return ` ${context.label}: ${context.raw}M ₫ (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="revenue-charts-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: '20px',
      marginBottom: '24px',
    }}>
      {/* CỘT 1: BIỂU ĐỒ DOANH THU 6 THÁNG GẦN NHẤT */}
      <article className="panel chart-panel" style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
      }}>
        <div className="panel-heading" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 700, color: '#087f82', letterSpacing: '0.5px' }}>
              HIỆU SUẤT TÀI CHÍNH (CHART.JS)
            </p>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
              Xu Hướng Doanh Thu 6 Tháng Gần Nhất
            </h3>
          </div>
          <span style={{
            background: '#ecfdf5',
            color: '#047857',
            fontSize: '0.8rem',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: 700,
          }}>
            +24.8% Quý này
          </span>
        </div>

        <div style={{ height: '260px', position: 'relative' }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </article>

      {/* CỘT 2: BIỂU ĐỒ CƠ CẤU DOANH THU THEO SẢNH */}
      <article className="panel chart-panel" style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
      }}>
        <div className="panel-heading" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 700, color: '#087f82', letterSpacing: '0.5px' }}>
              PHÂN BỔ NGUỒN THU
            </p>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
              Tỷ Trọng Doanh Thu Theo Sảnh Tiệc
            </h3>
          </div>
          <span style={{
            background: '#f1f5f9',
            color: '#475569',
            fontSize: '0.8rem',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: 600,
          }}>
            5 Sảnh hoạt động
          </span>
        </div>

        <div style={{ height: '260px', position: 'relative' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </article>
    </div>
  );
};

export default RevenueCharts;
