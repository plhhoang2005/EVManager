# [BUG-03] Tính sai tổng tiền khi áp dụng đồng thời chiết khấu % và voucher giảm giá trực tiếp

**Labels:** `type: bug`, `priority: high`, `backend`

## Mô tả lỗi
- Khi áp dụng chiết khấu % (ví dụ 5%) kèm theo voucher giảm giá trực tiếp (ví dụ 2.000.000 đ), hệ thống đang thực hiện sai thứ tự phép tính. 
- Hiện tại hệ thống áp dụng voucher trừ thẳng tiền trước, rồi mới tính phần trăm chiết khấu trên số tiền còn lại. Việc này làm sai lệch công thức tài chính và gây thất thoát doanh thu cho trung tâm.

## Quy tắc nghiệp vụ (Business Rule)
Theo thỏa thuận BA đã chốt, thứ tự tính toán bắt buộc phải là:
1. Áp dụng trừ **Chiết khấu %** trên tổng tiền (hoặc tiền bàn).
2. Sau đó mới tiếp tục trừ **Tiền voucher khuyến mãi trực tiếp**.

## Ví dụ Công thức Tính toán mẫu (Để Developer đối chiếu)
- **Đầu vào:**
  - Tiền bàn: 100.000.000 đ
  - Chiết khấu: 5%
  - Voucher giảm giá: 2.000.000 đ
- **Cách tính HIỆN TẠI (SAI):**
  - Tiền sau voucher = 100.000.000 - 2.000.000 = 98.000.000 đ
  - Tiền sau chiết khấu = 98.000.000 - (98.000.000 * 5%) = 93.100.000 đ
- **Cách tính ĐÚNG (BA Yêu Cầu):**
  - Tiền sau chiết khấu = 100.000.000 - (100.000.000 * 5%) = 95.000.000 đ
  - Tiền sau voucher = 95.000.000 - 2.000.000 = **93.000.000 đ**
- *(Sự chênh lệch trong ví dụ này gây thất thoát 100.000 đ cho mỗi hợp đồng)*.

## Yêu cầu xử lý
- Backend Developer cần vào class `ContractsService` để sửa lại thứ tự phép tính trong công thức.
- Bắt buộc phải viết lại Unit Test / Test Case kiểm tra để đảm bảo logic này không bị lỗi lại (Regression).
