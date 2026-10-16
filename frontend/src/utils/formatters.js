/**
 * Hàm định dạng số tiền sang chuẩn Việt Nam Đồng (VND)
 * @param {number|string} amount
 * @returns {string} ví dụ: "15.000.000 ₫"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(amount));
};

/**
 * Hàm định dạng ngày tháng chuẩn Việt Nam
 * @param {string|Date} dateInput
 * @param {boolean} includeTime
 * @returns {string} ví dụ: "15/10/2026" hoặc "15/10/2026 18:30"
 */
export const formatDate = (dateInput, includeTime = false) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
