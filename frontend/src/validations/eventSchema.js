import { z } from 'zod';

/**
 * Schema kiểm tra dữ liệu Đặt Sự kiện / Tiệc cưới
 */
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Tên sự kiện / Tiệc cưới không được để trống')
    .min(5, 'Tên sự kiện tối thiểu 5 ký tự'),
  customerName: z
    .string()
    .min(1, 'Vui lòng chọn hoặc nhập tên khách hàng'),
  venue: z
    .string()
    .min(1, 'Vui lòng chọn sảnh tiệc tổ chức'),
  date: z
    .string()
    .min(1, 'Vui lòng chọn ngày tổ chức'),
  session: z
    .enum(['Sáng', 'Trưa', 'Tối', 'Cả ngày'], {
      errorMap: () => ({ message: 'Vui lòng chọn ca tiệc hợp lệ' }),
    }),
  tableCount: z
    .number({ invalid_type_error: 'Số lượng bàn phải là chữ số' })
    .min(1, 'Số lượng bàn tiệc tối thiểu là 1 bàn')
    .max(150, 'Số lượng bàn tiệc tối đa cho một sảnh là 150 bàn'),
  notes: z
    .string()
    .optional(),
});
