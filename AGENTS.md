# Quy tắc làm việc với Codex

Tệp này là nguồn quy tắc chính khi Codex làm việc trong repository EVManager. [Quy trình AgentFlow](docs/agentflow/WORKFLOW.md) giải thích cách áp dụng; các template trong `docs/agentflow/` chỉ hỗ trợ thực thi.

## Quy trình bắt buộc cho mỗi issue

1. Đọc đầy đủ issue và xác định mục tiêu, Acceptance Criteria, Definition of Done.
2. Đọc tài liệu liên quan trong `docs/`.
3. Kiểm tra source, branch hiện tại và `git status`; bảo vệ mọi thay đổi đang có.
4. Xác định rõ phạm vi file được phép thay đổi và phần ngoài phạm vi.
5. Tìm business rule, dependency, edge case và trường hợp lỗi.
6. Viết kế hoạch ngắn cùng danh sách file dự kiến tạo hoặc sửa.
7. Dừng để xin Human Approval khi có quyết định quan trọng chưa được chốt theo [các approval gate](docs/agentflow/WORKFLOW.md#human-approval-gates).
8. Chỉ sửa file liên quan, với thay đổi nhỏ nhất đáp ứng issue.
9. Chạy static analysis, build và các test phù hợp với phần thay đổi.
10. Review toàn bộ diff theo [Review Checklist](docs/agentflow/REVIEW_CHECKLIST.md).
11. Báo cáo kết quả, lệnh đã chạy, kết quả kiểm tra và rủi ro còn lại.
12. Không commit, push, merge hoặc deploy nếu người dùng chưa yêu cầu rõ ràng.

Có thể dùng [Task Template](docs/agentflow/TASK_TEMPLATE.md) để ghi nhận toàn bộ vòng đời issue và [Test Checklist](docs/agentflow/TEST_CHECKLIST.md) để lưu bằng chứng kiểm thử.

## Phạm vi

- Mỗi lần chỉ thực hiện một issue; không tự mở rộng sang issue khác.
- Không tự thêm chức năng AI/ML. Dự báo chi phí chỉ được xem xét sau khi MVP hoàn chỉnh và có issue được duyệt.
- Không tự sửa Frontend khi nhiệm vụ thuộc Backend và ngược lại.
- Không thay đổi database schema khi chưa đối chiếu ERD và migration liên quan.
- Không thay đổi API contract mà không cảnh báo ảnh hưởng tới Frontend/Desktop và xin xác nhận khi contract chưa được chốt.
- Không tạo hoặc sửa file ngoài phạm vi đã xác định. Nếu phát hiện nhu cầu mở rộng phạm vi, phải xin Human Approval.

## An toàn dữ liệu và bảo mật

- Không xóa dữ liệu hoặc migration hiện có.
- Không dùng lệnh Git có tính phá hủy hoặc ghi đè thay đổi của thành viên khác.
- Không commit `.env`, password, token, secret hoặc connection string.
- Không hard-code password, token hoặc secret.
- Không log password, JWT, connection string hoặc dữ liệu nhạy cảm.
- Chỉ dùng dữ liệu giả cho fixture, seed, ví dụ và tài liệu.
- Xác nhận đúng đường dẫn trước khi tạo, đổi tên, di chuyển hoặc xóa file.
- Mọi thao tác có khả năng ảnh hưởng dữ liệu phải tuân theo Gate 2 trong `WORKFLOW.md`.

## Backend

- Sử dụng Java 21 LTS, Spring Boot và Maven; không hạ tiêu chuẩn compiler hoặc build để che lỗi.
- Không dùng raw type hoặc unchecked cast nếu không có lý do rõ ràng được ghi chú.
- Controller chỉ tiếp nhận request, gọi lớp phù hợp và trả response.
- Business logic đặt trong service.
- Database access đặt trong Spring Data JPA repository hoặc lớp persistence phù hợp.
- Validate toàn bộ input không tin cậy bằng Jakarta Bean Validation.
- Luôn kiểm tra Authentication và Authorization ở Backend; không dựa vào giao diện để bảo vệ quyền truy cập.
- Response thành công và error response phải nhất quán với API contract.
- Không dùng `catch` rỗng hoặc nuốt exception; xử lý, chuyển tiếp hoặc log lỗi an toàn.
- Dùng `@Transactional` cho nghiệp vụ nhiều bước cần tính nguyên tử, đặc biệt là thanh toán và hợp đồng.
- API danh sách có khả năng tăng lớn phải hỗ trợ pagination bằng cơ chế Spring Data phù hợp.
- Quản lý thay đổi schema bằng Flyway; không dùng Hibernate `ddl-auto` để thay thế migration trong quy trình chính thức.
- Không trả stack trace trong production.

## Testing

- Mỗi business rule quan trọng phải có test.
- Bug fix phải có regression test khi phù hợp.
- Không xóa, bỏ qua hoặc làm yếu test chỉ để build thành công.
- Không giảm tiêu chuẩn compiler, static analysis, build hoặc validation để che lỗi.
- Luôn xét happy path, validation error, unauthorized, forbidden, not found và duplicate/conflict khi phù hợp.
- Nghiệp vụ thanh toán và kiểm tra trùng lịch phải có test cho edge case và tính nhất quán dữ liệu.
- Chỉ báo một kiểm tra là đã chạy khi có lệnh và kết quả thực tế; nếu không chạy được phải ghi rõ lý do.

## Git

- `main`: phiên bản ổn định; không làm việc hoặc merge trực tiếp trên nhánh này.
- `develop`: nhánh tích hợp.
- `feature/<issue>-<name>`: chức năng mới.
- `fix/<issue>-<name>`: sửa lỗi.
- Mỗi task phải gắn với một issue.
- Commit message tuân theo Conventional Commits.
- Kiểm tra branch và `git status` trước khi sửa; kiểm tra lại `git status` và diff sau khi sửa.
- Không tự động commit, push, merge, tạo Pull Request hoặc deploy.

## Thứ tự ưu tiên khi có mâu thuẫn

1. Yêu cầu đã được con người xác nhận cho issue hiện tại.
2. Quy tắc trong `AGENTS.md` này.
3. Tài liệu thiết kế, yêu cầu và API đã được duyệt trong `docs/`.
4. Quy ước thể hiện trong source hiện tại.

Khi không thể giải quyết mâu thuẫn mà không làm thay đổi nghiệp vụ, API, database hoặc phạm vi, dừng tại Human Approval Gate và nêu rõ các lựa chọn cùng ảnh hưởng.
