import { z } from 'zod';

// Regex chuẩn số điện thoại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
export const VIETNAMESE_PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;

/**
 * Schema kiểm tra dữ liệu Form Đăng nhập
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Tên đăng nhập không được để trống')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

/**
 * Schema kiểm tra dữ liệu Form Đăng ký
 */
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Tên đăng nhập không được để trống')
      .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
      .max(30, 'Tên đăng nhập tối đa 30 ký tự')
      .regex(/^[a-zA-Z0-9_.-]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số, dấu gạch nối hoặc gạch dưới'),
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Định dạng email không hợp lệ (ví dụ: khachhang@gmail.com)'),
    phone: z
      .string()
      .min(1, 'Số điện thoại không được để trống')
      .regex(VIETNAMESE_PHONE_REGEX, 'Số điện thoại phải gồm 10 chữ số hợp lệ của Việt Nam (03, 05, 07, 08, 09)'),
    fullName: z
      .string()
      .min(1, 'Họ và tên không được để trống')
      .min(2, 'Họ và tên tối thiểu 2 ký tự'),
    password: z
      .string()
      .min(1, 'Mật khẩu không được để trống')
      .min(6, 'Mật khẩu bảo mật phải có ít nhất 6 ký tự'),
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng xác nhận lại mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập',
    path: ['confirmPassword'],
  });

/**
 * Schema kiểm tra dữ liệu Form Quên mật khẩu
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập địa chỉ email đã đăng ký')
    .email('Địa chỉ email không đúng định dạng hợp lệ'),
});
