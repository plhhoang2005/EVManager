# Review Checklist

Điền `Pass`, `Fail` hoặc `Not Applicable` cho từng mục. Với `Fail`, ghi mức độ `Critical`, `High`, `Medium` hoặc `Low`, vị trí và cách xử lý. Critical/High phải được xử lý trước khi hoàn thành task.

## Thông tin review

- **Issue:**
- **Reviewer:**
- **Ngày:**
- **Commit/diff được review:**

## Checklist

| # | Nội dung kiểm tra | Trạng thái | Mức độ nếu Fail | Ghi chú/Bằng chứng |
|---|---|---|---|---|
| 1 | Thay đổi đúng issue |  |  |  |
| 2 | Đáp ứng Acceptance Criteria |  |  |  |
| 3 | Không sửa file ngoài phạm vi |  |  |  |
| 4 | Không để lộ secret hoặc dữ liệu nhạy cảm |  |  |  |
| 5 | Không có dependency không sử dụng hoặc không cần thiết |  |  |  |
| 6 | Không có code trùng lặp rõ ràng |  |  |  |
| 7 | Không có `any` không cần thiết |  |  |  |
| 8 | Không có `catch` rỗng hoặc exception bị nuốt |  |  |  |
| 9 | Input validation đầy đủ |  |  |  |
| 10 | Authentication đúng |  |  |  |
| 11 | Authorization/RBAC đúng |  |  |  |
| 12 | Error response nhất quán |  |  |  |
| 13 | API contract được giữ ổn định hoặc thay đổi đã được duyệt/cảnh báo |  |  |  |
| 14 | Migration an toàn, đã đối chiếu ERD và có rollback khi cần |  |  |  |
| 15 | Query không có vấn đề hiệu năng rõ ràng |  |  |  |
| 16 | Logging không chứa dữ liệu nhạy cảm |  |  |  |
| 17 | Test bao phủ business rule quan trọng và edge case phù hợp |  |  |  |
| 18 | README/Swagger được cập nhật khi cần |  |  |  |
| 19 | Không có dead code |  |  |  |
| 20 | Không ghi đè thay đổi của thành viên khác |  |  |  |

## Phát hiện

| ID | Mức độ | File/Vị trí | Mô tả và ảnh hưởng | Cách xử lý | Trạng thái |
|---|---|---|---|---|---|
| REV-001 |  |  |  |  | Open / Resolved |

## Kết luận

- [ ] Không còn phát hiện Critical.
- [ ] Không còn phát hiện High.
- **Kết quả review:** Pass / Fail
- **Ghi chú:**
