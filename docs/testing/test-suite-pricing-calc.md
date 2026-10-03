# Test Suite: Contract Pricing Calculator (Kiểm thử phép tính Tổng tiền Hợp đồng)

## Mục tiêu
Đảm bảo hệ thống backend (sắp được phát triển) tính toán chính xác tuyệt đối các con số liên quan đến Tiền bàn, Tiền dịch vụ, Thuế VAT, Chiết khấu và Tiền cọc tối thiểu.

---

## 1. Các kịch bản kiểm thử (Test Cases)

### TC-CALC-01: Tính tổng tiền cơ bản (Không chiết khấu)
- **Đầu vào:**
  - Số lượng bàn: 20 bàn
  - Đơn giá bàn: 4.500.000 đ
  - Dịch vụ đi kèm: 10.000.000 đ
  - Mức thuế VAT: 8%
- **Cách tính tay:**
  - Tiền bàn: 20 x 4.500.000 = 90.000.000 đ
  - Tổng trước thuế: 90.000.000 + 10.000.000 = 100.000.000 đ
  - Thuế VAT: 100.000.000 x 8% = 8.000.000 đ
  - **Tổng hợp đồng**: 100.000.000 + 8.000.000 = 108.000.000 đ
- **Kết quả mong đợi:** Hệ thống trả về `108.000.000 đ` (hoặc `108000000`).

### TC-CALC-02: Áp dụng chiết khấu 10% trên tiền bàn
- **Mục tiêu:** Kiểm tra hệ thống chỉ giảm giá trên tiền bàn (không giảm trên VAT hay Dịch vụ).
- **Đầu vào:**
  - Tiền bàn: 90.000.000 đ
  - Chiết khấu: 10% (Chỉ áp dụng cho bàn)
  - Dịch vụ: 10.000.000 đ
  - Thuế VAT: 8%
- **Cách tính tay:**
  - Số tiền chiết khấu: 90.000.000 x 10% = 9.000.000 đ
  - Tiền bàn sau chiết khấu: 81.000.000 đ
  - Tổng trước thuế: 81.000.000 + 10.000.000 = 91.000.000 đ
  - Thuế VAT: 91.000.000 x 8% = 7.280.000 đ
  - **Tổng hợp đồng**: 91.000.000 + 7.280.000 = 98.280.000 đ
- **Kết quả mong đợi:** Hệ thống trả về tổng `98.280.000 đ`.

### TC-CALC-03: Kiểm tra quy định tiền cọc tối thiểu
- **Mục tiêu:** Tiền cọc đợt 1 luôn phải bằng hoặc lớn hơn 30% Tổng giá trị hợp đồng cuối cùng.
- **Dựa trên dữ liệu TC-CALC-02 (Tổng = 98.280.000 đ):**
  - **Mức cọc tính tay (30%)**: 98.280.000 x 30% = 29.484.000 đ
- **Kết quả mong đợi:** Hệ thống báo lỗi nếu User nhập số tiền cọc < 29.484.000 đ. Nếu nhập đúng hoặc lớn hơn thì lưu thành công.

### TC-CALC-04: Kiểm tra tránh sai số thập phân (Rounding Error)
- **Mục tiêu:** Backend bắt buộc dùng `BigDecimal` cho phép toán tiền tệ, không dùng `float/double`.
- **Đầu vào:**
  - Tiền dịch vụ: 10.000.001 đ
  - VAT: 8%
- **Cách tính tay:**
  - Thuế VAT: 10.000.001 x 8% = 800.000,08 đ
  - Làm tròn chuẩn (Round Half Up): 800.000 đ
  - **Tổng hợp đồng**: 10.800.001 đ
- **Kết quả mong đợi:** Hệ thống phải trả về số nguyên làm tròn chuẩn, không bị lỗi số thập phân dạng `10800001.079999999`.

---

## 2. Bảng đối chiếu số liệu tính tay vs Hệ thống

| Mã Test Case | Tổng trước thuế | Thuế VAT (8%) | Chiết khấu | Tiền Cọc 30% | Tổng cộng (Tính tay) | Hệ thống tự sinh | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CALC-01** | 100.000.000 đ | 8.000.000 đ | 0 đ | 32.400.000 đ | **108.000.000 đ** | *(Chưa có API)* | Pending |
| **TC-CALC-02** | 91.000.000 đ | 7.280.000 đ | 9.000.000 đ | 29.484.000 đ | **98.280.000 đ** | *(Chưa có API)* | Pending |
| **TC-CALC-03** | 91.000.000 đ | 7.280.000 đ | 9.000.000 đ | **29.484.000 đ** | 98.280.000 đ | *(Chưa có API)* | Pending |
| **TC-CALC-04** | 10.000.001 đ | 800.000 đ | 0 đ | 3.240.000 đ | **10.800.001 đ** | *(Chưa có API)* | Pending |

> **Lưu ý:** Hiện tại thư mục `contracts` của Backend chưa được triển khai code. Cột "Hệ thống tự sinh" sẽ được điền tự động khi module này hoàn tất và chạy Postman re-test.
