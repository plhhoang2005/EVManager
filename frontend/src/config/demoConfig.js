/**
 * Cấu hình chế độ dữ liệu mẫu / Demo Mock.
 * Mặc định TẮT (false) để ưu tiên kết nối Backend thật.
 * Chỉ kích hoạt khi biến môi trường VITE_ENABLE_DEMO_MOCK được đặt là 'true'.
 */
export const isDemoMockEnabled = () => {
  return import.meta.env.VITE_ENABLE_DEMO_MOCK === 'true';
};

export default {
  isDemoMockEnabled,
};
