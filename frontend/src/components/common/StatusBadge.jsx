import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'CONFIRMED':
      case 'SIGNED':
      case 'ACTIVE':
      case 'Đã xác nhận':
      case 'Đã ký':
        return 'status-confirmed';
      case 'IN_PROGRESS':
      case 'PENDING':
      case 'PENDING_SIGNATURE':
      case 'Đang chuẩn bị':
      case 'Chờ ký':
        return 'status-pending';
      case 'COMPLETED':
      case 'Hoàn thành':
      case 'Hoàn tất':
        return 'status-completed';
      case 'CANCELLED':
      case 'Đã hủy':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  return <span className={`status-badge ${getBadgeClass()}`}>{status}</span>;
};

export default StatusBadge;
