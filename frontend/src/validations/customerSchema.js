import { z } from 'zod';
import { VIETNAMESE_PHONE_REGEX } from './authSchema';

/**
 * Schema kiểm tra dữ liệu Khách hàng (Thêm mới / Cập nhật)
 */
export const customerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ và tên khách hàng không được để trống')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không quá 100 ký tự'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(VIETNAMESE_PHONE_REGEX, 'Số điện thoại không hợp lệ (Phải là 10 chữ số: 03x, 05x, 07x, 08x, 09x)'),
  email: z
    .string()
    .min(1, 'Email liên hệ không được để trống')
    .email('Địa chỉ email không đúng định dạng (ví dụ: contact@example.com)'),
  tier: z
    .enum(['VIP', 'Thường', 'Tiềm năng'], {
      errorMap: () => ({ message: 'Vui lòng chọn phân khúc khách hàng hợp lệ' }),
    }),
  address: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional(),
});
