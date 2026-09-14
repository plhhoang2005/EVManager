# Test Checklist

Chỉ đánh dấu `Pass` hoặc `Fail` sau khi thực sự chạy. Dùng `Not Applicable` khi không liên quan và ghi rõ lý do.

## Thông tin kiểm thử

- **Issue:**
- **Tester:**
- **Ngày:**
- **Môi trường/branch:**

## Kiểm tra kỹ thuật

| # | Kiểm tra | Lệnh/Cách kiểm tra | Trạng thái (Pass/Fail/Not Applicable) | Kết quả/Bằng chứng |
|---|---|---|---|---|
| 1 | Lint |  |  |  |
| 2 | Maven compile/package |  |  |  |
| 3 | Unit test |  |  |  |
| 4 | Integration test |  |  |  |
| 5 | Smoke test/API check |  |  |  |

## Kịch bản chức năng và lỗi

| # | Kịch bản | Test case/Lệnh | Trạng thái (Pass/Fail/Not Applicable) | Kết quả/Bằng chứng |
|---|---|---|---|---|
| 1 | Happy path |  |  |  |
| 2 | Validation error |  |  |  |
| 3 | Authentication error (`401`) |  |  |  |
| 4 | Authorization error (`403`) |  |  |  |
| 5 | Not found (`404`) |  |  |  |
| 6 | Duplicate/conflict (`409` khi phù hợp) |  |  |  |
| 7 | Database failure phù hợp |  |  |  |
| 8 | External service failure phù hợp |  |  |  |
| 9 | Regression test |  |  |  |

## Điều kiện chất lượng

- [ ] Không còn lỗi Critical.
- [ ] Không còn lỗi High.
- [ ] Mọi kiểm tra `Fail` có defect hoặc ghi chú xử lý.
- [ ] Mọi kiểm tra `Not Applicable` có lý do.
- [ ] Lệnh và kết quả ghi ở trên phản ánh lần chạy thực tế.

## Tổng kết

- **Kết quả chung:** Pass / Fail / Blocked
- **Kiểm tra chưa chạy và lý do:**
- **Rủi ro còn lại:**
