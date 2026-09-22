# AgentFlow thực hiện một issue

Quy trình này áp dụng các quy tắc bắt buộc trong [`AGENTS.md`](../../AGENTS.md). Đây là luồng làm việc theo vai trò logic cho một trợ lý Codex, không phải tuyên bố về một hệ thống multi-agent độc lập.

## Luồng tổng quát

`Phân tích → Lập kế hoạch → Human Approval (khi cần) → Triển khai → Review → Test → Báo cáo`

Mỗi issue nên được ghi nhận bằng [`TASK_TEMPLATE.md`](TASK_TEMPLATE.md). Không chuyển sang issue khác trước khi kết thúc hoặc bàn giao rõ issue hiện tại.

## 1. Orchestrator

- Đọc issue, xác định mục tiêu, phạm vi, Acceptance Criteria và Definition of Done.
- Kiểm tra branch, `git status`, source và tài liệu liên quan.
- Xác định module, dependency, file có khả năng bị ảnh hưởng và thứ tự công việc.
- Điều phối các bước Analyst → Implementer → Reviewer → Tester → Reporter.
- Không tự quyết định yêu cầu nghiệp vụ còn mơ hồ; chuyển vấn đề tới Human Approval.

**Đầu ra:** phạm vi, Definition of Done, tài liệu liên quan và trạng thái repository ban đầu.

## 2. Analyst

- Phân tích yêu cầu và chuyển thành Acceptance Criteria có thể kiểm chứng.
- Trích xuất business rule, giả định và dependency.
- Liệt kê happy path, edge case và trường hợp lỗi.
- So sánh issue với tài liệu và source; ghi rõ mọi mâu thuẫn.
- Chuyển vấn đề chưa rõ hoặc quyết định có ảnh hưởng lớn tới Human Approval.

**Đầu ra:** Acceptance Criteria, business rule, edge case, câu hỏi cần xác nhận.

## 3. Lập kế hoạch và Human Approval

- Viết kế hoạch ngắn theo từng thay đổi có thể kiểm chứng.
- Liệt kê chính xác file dự kiến tạo hoặc sửa, test cần chạy và phần ngoài phạm vi.
- Kiểm tra ba approval gate bên dưới.
- Nếu một điều kiện gate được kích hoạt, dừng phần bị ảnh hưởng cho đến khi có xác nhận. Những kiểm tra đọc-only an toàn vẫn có thể tiếp tục.

## 4. Implementer

- Chỉ code khi yêu cầu và kế hoạch cho phần triển khai đã rõ.
- Thực hiện thay đổi nhỏ nhất đúng phạm vi và tuân thủ kiến trúc/coding convention hiện có.
- Thêm validation, error handling và logging phù hợp, không để lộ dữ liệu nhạy cảm.
- Thêm hoặc cập nhật test để chứng minh business rule và ngăn regression.
- Không tự sửa, xóa hoặc bỏ qua test để che lỗi triển khai.
- Kiểm tra diff thường xuyên để tránh kéo theo thay đổi ngoài ý muốn.

**Đầu ra:** thay đổi triển khai và test trong phạm vi đã duyệt.

## 5. Reviewer

Review độc lập về mặt logic bằng [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md), tập trung vào:

- Đúng yêu cầu và Acceptance Criteria; không mở rộng phạm vi.
- Không có lỗi bảo mật rõ ràng, lộ secret hoặc logging dữ liệu nhạy cảm.
- Không phá API contract hay tạo dependency thừa.
- Không có code lặp không cần thiết, dead code hoặc edge case quan trọng bị bỏ sót.
- Không ghi đè thay đổi của thành viên khác.

Mỗi phát hiện phải có mức độ, vị trí, ảnh hưởng và đề xuất xử lý:

| Mức độ | Ý nghĩa | Điều kiện hoàn thành |
|---|---|---|
| Critical | Có thể gây mất dữ liệu, lộ bí mật, lỗ hổng nghiêm trọng hoặc làm hệ thống không dùng được | Bắt buộc xử lý |
| High | Sai business rule chính, phá contract hoặc gây lỗi nghiêm trọng trong luồng phổ biến | Bắt buộc xử lý |
| Medium | Lỗi có ảnh hưởng giới hạn hoặc thiếu sót chất lượng đáng kể | Xử lý hoặc ghi nhận rõ |
| Low | Cải thiện nhỏ, ít ảnh hưởng | Có thể ghi nhận để xử lý sau |

Sau khi sửa phát hiện, review lại phần diff liên quan. Task không hoàn thành khi còn phát hiện Critical hoặc High chưa xử lý.

## 6. Tester

- Chọn lệnh phù hợp từ cấu hình thực tế của repository; không đoán lệnh.
- Chạy static analysis, Maven build, unit test và integration test liên quan.
- Kiểm tra API bằng automated test hoặc smoke test khi có API bị ảnh hưởng.
- Dùng [`TEST_CHECKLIST.md`](TEST_CHECKLIST.md) để ghi lệnh, kết quả và bằng chứng.
- Không ghi “đã kiểm tra” nếu chưa thực sự chạy. Nếu một kiểm tra không áp dụng hoặc bị chặn, ghi rõ lý do.
- Chuyển lỗi về Implementer để sửa, sau đó chạy lại kiểm tra bị ảnh hưởng.

**Đầu ra:** danh sách lệnh thực tế, trạng thái pass/fail, lỗi và phần chưa kiểm tra.

## 7. Reporter

Báo cáo cuối task phải gồm:

- Mục tiêu đã hoàn thành.
- File đã tạo hoặc sửa.
- Business rule đã triển khai.
- Test đã thêm.
- Lệnh đã chạy và kết quả lint/build/test.
- Phần chưa thực hiện và lý do.
- Rủi ro còn lại.
- Commit message đề xuất theo Conventional Commits.
- Hướng dẫn ngắn để người dùng tự kiểm tra.

Báo cáo không đồng nghĩa với commit, push, merge hoặc deploy.

## Human Approval Gates

### Gate 1: Trước khi code

Phải hỏi người dùng trước khi tiếp tục phần liên quan nếu:

- Yêu cầu chưa rõ hoặc có mâu thuẫn chưa giải quyết.
- Có nhiều phương án kiến trúc với ảnh hưởng lớn.
- API contract chưa được chốt.
- Database schema chưa được duyệt hoặc chưa đối chiếu ERD/migration.
- Cần thay đổi file đang thuộc phạm vi làm việc của thành viên khác.
- Cần thêm hoặc thay thế dependency quan trọng.
- Cần thay đổi phạm vi issue.

Yêu cầu phê duyệt phải nêu: quyết định cần chốt, các lựa chọn khả thi, ảnh hưởng và phương án đề xuất.

### Gate 2: Trước thao tác ảnh hưởng dữ liệu

Phải hỏi người dùng trước khi:

- Xóa hoặc đổi tên bảng/cột.
- Xóa migration.
- Reset database.
- Xóa dữ liệu.
- Chạy migration phá vỡ tương thích.
- Thay đổi seed data quan trọng.

Trước khi xin duyệt, phải nêu dữ liệu bị ảnh hưởng, kế hoạch backup, kiểm tra migration và phương án rollback. Phê duyệt thiết kế migration không mặc nhiên cho phép chạy migration trên môi trường dùng chung hoặc production.

### Gate 3: Trước Git hoặc Deployment

Phải hỏi người dùng trước khi:

- Commit.
- Push.
- Merge.
- Tạo Pull Request nếu chưa được giao.
- Deploy.
- Thay đổi secret hoặc biến môi trường production.

Mỗi hành động chỉ được thực hiện trong đúng phạm vi đã được phê duyệt; sự cho phép ở một gate không tự động áp dụng cho hành động khác.

## Poka Yoke — cơ chế phòng tránh lỗi

### Trước khi thay đổi

- Kiểm tra branch; không làm việc trực tiếp trên `main`.
- Chạy `git status` và ghi nhận file đang thay đổi để không ghi đè công việc của người khác.
- Xác nhận đường dẫn và phạm vi trước khi tạo hoặc sửa file.
- Đối chiếu API contract, ERD và migration nếu có liên quan.

### Trong triển khai

- Validate environment variables khi khởi động và fail fast nếu thiếu cấu hình bắt buộc.
- Kiểm tra migration trước khi áp dụng; backup trước thay đổi database quan trọng và chuẩn bị rollback.
- Dùng transaction cho thao tác nhiều bước cần tính nguyên tử.
- Dùng unique constraint cho dữ liệu không được trùng.
- Dùng idempotency key hoặc kiểm tra trùng cho thao tác thanh toán phù hợp.
- Giới hạn kích thước request và file upload.
- Dùng pagination cho API danh sách có thể tăng lớn.
- Không trả stack trace trong production.

### Trước khi hoàn thành

- Chạy lại `git status`, xem toàn bộ diff và xác nhận không có file ngoài phạm vi.
- Chạy các kiểm tra phù hợp và ghi lại kết quả thực tế.
- Xác nhận không còn phát hiện Critical/High.
- Có phương án rollback cho migration và deployment trước khi xin phép thực hiện.
- Hoàn tất báo cáo theo vai trò Reporter.

## Điều kiện kết thúc issue

Issue chỉ được báo cáo hoàn thành khi Acceptance Criteria và Definition of Done đều đạt, diff đã review, kiểm tra phù hợp đã chạy hoặc được ghi rõ là không áp dụng, không còn lỗi Critical/High, và mọi approval bắt buộc đã được ghi nhận.
