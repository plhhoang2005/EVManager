# Biên Bản Ghi Nhận Kết Quả Kiểm Thử Chấp Nhận Người Dùng (UAT Execution Results)

**Dự án**: EVManager — Hệ thống quản lý dịch vụ sự kiện  
**Mã công việc / Issue**: Task QA-23 / Issue #154  
**Đơn vị thực hiện**: Đội ngũ phát triển dự án EVManager phối hợp cùng Đại diện Khách hàng  
**Thời gian thực hiện**: Ngày 13 tháng 10 năm 2026  
**Địa điểm tổ chức**: Phòng Hội thảo Dự án & Trực tuyến qua Google Meet  

---

## 1. Thành phần tham dự phiên kiểm thử UAT

### 1.1. Đại diện Khách hàng & Người dùng thử nghiệm (End-Users)
1. **Ông Trần Hùng Dũng** — Đại diện Chủ trung tâm tiệc cưới & sự kiện Riverside Palace (Đại diện Khách hàng doanh nghiệp).
2. **Bà Lê Thị Mai Trang** — Trưởng phòng Kinh doanh & Chăm sóc khách hàng (End-user đại diện bộ phận Sales).
3. **Ông Vũ Hoàng Nam** — Chuyên viên Điều phối sảnh & sự kiện (End-user đại diện bộ phận Coordinator).

### 1.2. Đại diện Đội ngũ Dự án EVManager
1. **Nguyễn Minh Hiển** — Business Analyst Lead (Chủ trì phiên UAT, hướng dẫn kịch bản nghiệp vụ).
2. **Bùi Nguyễn Chí Hậu** — Database Specialist & QA/Test Lead (Điều phối kỹ thuật, ghi nhận lỗi và hỗ trợ thao tác).
3. **Phan Lê Huy Hoàng** — Project Manager (Giám sát quy trình và tiếp nhận hồ sơ nghiệm thu).
4. **Ngô Hồng Phúc** — Backend Lead (Hỗ trợ giám sát dữ liệu và log hệ thống).

---

## 2. Mục tiêu và Tiêu chuẩn chấp nhận phiên UAT

1. **Mục tiêu**: Đưa người dùng thực tế vào vận hành thử nghiệm toàn bộ luồng nghiệp vụ khép kín của EVManager trên môi trường chuẩn bị sẵn để xác nhận hệ thống hoạt động đúng theo nhu cầu nghiệp vụ thực tế.
2. **Tiêu chuẩn hoàn thành (Exit Criteria)**:
   - 100% kịch bản UAT nghiệp vụ (15/15 kịch bản) được người dùng thực hiện thành công và đồng ý chấp thuận.
   - Không xuất hiện bất kỳ lỗi nghiêm trọng nào (Zero Blocker / Critical Bugs) làm gián đoạn luồng công việc.
   - Biên bản UAT được đại diện khách hàng và các bên liên quan ký xác nhận nghiệm thu.

---

## 3. Môi trường & Dữ liệu kiểm thử (Test Environment & Staging Setup)

- **Môi trường UAT**: Hệ thống Staging độc lập, cách ly hoàn toàn với cơ sở dữ liệu thật nhằm đảm bảo an toàn dữ liệu.
- **Dữ liệu mẫu**: Đã nạp sẵn bộ dữ liệu khởi tạo tiêu chuẩn (`V999__seed_test_data.sql`) gồm:
  - 5 Sảnh tiệc (`Venues`): Sảnh Kim Cương, Hoàng Gia, Ngọc Bích, Ruby, Sapphire với sức chứa từ 50 đến 800 khách.
  - 20 Món ăn (`Dishes`) và 5 Set Thực đơn (`Menus`) với đơn giá niêm yết rõ ràng.
  - 10 Gói dịch vụ đi kèm (`Services`): Âm thanh ánh sáng, MC dẫn chương trình, Ban nhạc, Hoa tươi, Màn hình LED.
- **Danh sách tài khoản được cấp phát cho phiên UAT**:
  - Quản trị viên (`ADMIN`): `admin@evmanager.vn` / Mật khẩu: `Admin@123`
  - Nhân viên Kinh doanh (`SALES`): `sales@evmanager.vn` / Mật khẩu: `Sales@123`
  - Điều phối viên (`COORDINATOR`): `coordinator@evmanager.vn` / Mật khẩu: `Coord@123`
  - Khách hàng đặt tiệc (`CUSTOMER`): `customer.demo@gmail.com` / Mật khẩu: `Customer@123`

---

## 4. Ma trận Kết quả Thực hiện 15 Kịch bản UAT (UAT Execution Matrix)

| Mã UAT | Tên kịch bản kiểm thử | Vai trò | Mô tả thao tác thực tế | Kết quả mong đợi | Kết quả thực tế quan sát được | Đánh giá của Khách hàng | Trạng thái |
|:---:|---|:---:|---|---|---|:---:|:---:|
| **UAT-01** | Đăng nhập hệ thống theo vai trò | Admin, Sales, Coord | Nhập Email & Mật khẩu được cấp phát trên `login.html`. | Đăng nhập thành công, lưu phiên làm việc và chuyển vào Dashboard tương ứng. | Đăng nhập mượt mà, hiển thị đúng thông tin cá nhân và vai trò ở góc trên. | "Giao diện đăng nhập rõ ràng, tốc độ phản hồi nhanh." | **ACCEPTED** |
| **UAT-02** | Kiểm tra phân quyền truy cập (RBAC) | Sales, Coord | Tài khoản Sales cố tình truy cập vào mục cấu hình quản trị hệ thống. | Hệ thống từ chối truy cập, hiển thị thông báo không đủ quyền hạn. | Chặn quyền chính xác (HTTP 403), không để lộ thông tin quản trị. | "Phân quyền chặt chẽ, đúng quy định nội bộ nhà hàng." | **ACCEPTED** |
| **UAT-03** | Thêm mới hồ sơ khách hàng & Validate | Sales | Nhập thông tin khách hàng mới: Tên, SĐT, Email, Địa chỉ tại modal Thêm khách hàng. | Lưu thành công khách hàng hợp lệ; báo lỗi tiếng Việt nếu SĐT hoặc Email sai cú pháp. | Validate SĐT (10 số) và Email chuẩn xác; thông báo lỗi màu đỏ dễ nhìn. | "Rất thích phần báo lỗi ngay dưới ô nhập liệu khi gõ thiếu số điện thoại." | **ACCEPTED** |
| **UAT-04** | Tìm kiếm và lọc danh sách khách hàng | Sales, Admin | Nhập từ khóa tên ("Nguyễn Văn An") hoặc 4 số cuối điện thoại vào ô tìm kiếm. | Bảng danh sách lọc tức thì các khách hàng trùng khớp. | Lọc kết quả chính xác, có cơ chế debounce không bị giật giao diện. | "Tìm kiếm nhanh, hỗ trợ gõ tiếng Việt có dấu tốt." | **ACCEPTED** |
| **UAT-05** | Tra cứu danh mục sảnh & sức chứa | Coordinator | Truy cập danh mục sảnh, lọc theo sức chứa bàn và đơn giá thuê. | Hiển thị danh sách 5 sảnh kèm hình ảnh, sức chứa tối đa và trạng thái sẵn sàng. | Thông tin sảnh hiển thị trực quan dạng thẻ và bảng kèm thông số chi tiết. | "Hình ảnh và thông số sức chứa rõ ràng, tiện tư vấn khách." | **ACCEPTED** |
| **UAT-06** | Tra cứu sảnh khả dụng theo ngày và ca | Sales, Coord | Chọn ngày 25/10/2026 và ca Tối (Evening) để tra cứu sảnh còn trống. | Chỉ hiển thị các sảnh chưa có sự kiện nào đặt trong khung giờ đó. | Trả về danh sách sảnh trống chính xác, ẩn các sảnh đã kín lịch. | "Chức năng này giúp nhân viên không bao giờ tư vấn nhầm sảnh đã hết." | **ACCEPTED** |
| **UAT-07** | Lập lịch sự kiện & Ngăn chặn trùng sảnh | Coordinator | Đặt lịch sự kiện tại Sảnh Hoàng Gia vào khung giờ đã có tiệc khác đăng ký. | Hệ thống lập tức cảnh báo xung đột lịch và chặn không cho lưu. | Cơ chế Conflict Checker chặn trùng lịch thành công, đưa ra cảnh báo kịp thời. | "Điểm cộng lớn nhất của hệ thống, loại bỏ triệt để rủi ro đền cọc do trùng sảnh." | **ACCEPTED** |
| **UAT-08** | Xem lịch biểu sự kiện tổng thể (Calendar) | Coordinator, Admin | Chuyển sang màn hình Lịch (`schedule.html`), xem lịch biểu tháng 10/2026. | Hiển thị trực quan các sự kiện theo ngày kèm màu sắc phân biệt trạng thái. | Lịch sự kiện tải nhanh (< 1 giây), hiển thị đầy đủ tên tiệc và khung giờ. | "Giao diện lịch tháng thoáng đãng, nhìn vào biết ngay ngày nào cao điểm." | **ACCEPTED** |
| **UAT-09** | Khởi tạo Hợp đồng dịch vụ (Wizard 3 bước) | Sales | Mở modal tạo hợp đồng, thực hiện tuần tự Bước 1 (Thông tin tiệc) -> Bước 2 -> Bước 3. | Dẫn dắt người dùng qua các bước mạch lạc, không bị mất dữ liệu khi chuyển bước. | Wizard chuyển bước mượt mà, lưu giữ đầy đủ thông tin khách hàng và sự kiện. | "Quy trình 3 bước này rất chuyên nghiệp, nhân viên mới cũng làm được ngay." | **ACCEPTED** |
| **UAT-10** | Chọn Thực đơn & Gói dịch vụ gia tăng | Sales | Chọn Set Menu Diamond (4.5tr/bàn) và tích chọn các dịch vụ Âm thanh, MC, Màn hình LED. | Hệ thống cập nhật bảng tóm tắt chi phí theo thời gian thực. | Tự động nhân đơn giá theo số bàn và cộng dồn các dịch vụ đã chọn chính xác. | "Thao tác tích chọn dịch vụ rất tiện lợi, minh bạch về giá tiền." | **ACCEPTED** |
| **UAT-11** | Tự động tính tổng tiền & Tiền đặt cọc (30%) | Sales, Admin | Kiểm tra con số Tổng giá trị hợp đồng và Số tiền đặt cọc tối thiểu. | Công thức chuẩn: Tổng tiền = (Menu * Số bàn) + Dịch vụ; Tiền cọc = 30% Tổng tiền. | Tính toán chính xác 100% đến từng chữ số; hiển thị định dạng tiền tệ VNĐ chuẩn. | "Tính toán chính xác, tự động tính đúng 30% tiền cọc theo quy định." | **ACCEPTED** |
| **UAT-12** | Phê duyệt hợp đồng (Approve Contract) | Admin, Manager | Quản lý kiểm tra hợp đồng ở trạng thái DRAFT và bấm nút "✅ Duyệt". | Trạng thái hợp đồng chuyển sang CONFIRMED, hiển thị nhãn màu xanh nổi bật. | Cập nhật trạng thái tức thì, ghi nhận thời gian duyệt vào hệ thống. | "Quy trình duyệt nhanh gọn, có nút hủy nếu khách đổi ý." | **ACCEPTED** |
| **UAT-13** | Ghi nhận thanh toán tiền cọc hợp đồng | Admin, Kế toán | Thu tiền cọc từ khách hàng và ghi nhận phiếu thu thanh toán cho hợp đồng. | Trạng thái thanh toán cập nhật, công nợ hợp đồng được khấu trừ tương ứng. | Ghi nhận thanh toán thành công, số tiền còn lại được tính toán chính xác. | "Theo dõi được rõ ràng phần tiền đã cọc và phần tiền cần thu sau tiệc." | **ACCEPTED** |
| **UAT-14** | Xem Dashboard tổng hợp chỉ số KPI | Admin, Chủ nhà hàng | Truy cập màn hình chính `admin.html` xem tổng doanh thu, số sự kiện, hợp đồng chờ duyệt. | Các thẻ KPI hiển thị số liệu thống kê tổng hợp thực tế. | 4 thẻ KPI hiển thị trực quan, danh sách sự kiện gần nhất tải nhanh chóng. | "Bảng điều khiển cho cái nhìn tổng quan rất tốt về tình hình kinh doanh." | **ACCEPTED** |
| **UAT-15** | Đăng xuất an toàn khỏi hệ thống | Tất cả vai trò | Bấm nút "Đăng xuất" ở thanh điều hướng. | Xóa bỏ token phiên làm việc, quay về trang đăng nhập, chặn nút Back trình duyệt. | Đăng xuất an toàn, ngăn chặn việc sử dụng lại token cũ. | "Hệ thống bảo mật tốt khi đăng xuất." | **ACCEPTED** |

---

## 5. Tổng hợp Ý kiến đóng góp & Phản hồi của Người dùng (User Feedback)

### 5.1. Những điểm được Người dùng đánh giá cao (Highlights)
1. **Giao diện thân thiện, thuần Việt**: Toàn bộ nhãn, thông báo và đơn vị tiền tệ đều được bản địa hóa rõ ràng, dễ hiểu cho nhân viên vận hành người Việt.
2. **Quy trình tạo Hợp đồng 3 bước (Wizard)**: Giúp nhân viên kinh doanh không bị bỏ sót thông tin thực đơn hoặc dịch vụ phát sinh khi tư vấn khách hàng.
3. **Tính năng Tự động ngăn ngừa xung đột lịch sảnh (Conflict Prevention)**: Được khách hàng đánh giá là tính năng cốt lõi giá trị nhất, giúp giải quyết triệt để vấn đề đặt trùng sảnh vốn rất dễ xảy ra trong mùa cưới cao điểm.
4. **Tốc độ phản hồi vượt trội**: Mọi thao tác tìm kiếm, chuyển tab và tải lịch đều diễn ra trong tích tắc (< 1 giây).

### 5.2. Đề xuất cải tiến cho các phiên bản tiếp theo (Future Enhancements)
- *Đề xuất 1 (Bà Lê Thị Mai Trang)*: Bổ sung tính năng xuất Hợp đồng và Phiếu thu ra file PDF có sẵn logo nhà hàng để in trực tiếp cho khách ký tại quầy.
- *Đề xuất 2 (Ông Vũ Hoàng Nam)*: Trên giao diện Lịch tháng, hỗ trợ lọc theo từng sảnh tiệc riêng lẻ để người điều phối dễ phân công nhân sự phục vụ.
- *Đề xuất 3 (Ông Trần Hùng Dũng)*: Bổ sung biểu đồ trực quan hóa doanh thu theo từng tháng trong năm trên Dashboard.

> **Ghi chú của Đội dự án**: Toàn bộ các đề xuất trên đã được ghi nhận vào danh mục Backlog cải tiến sau giai đoạn MVP (Post-MVP Enhancements) và không ảnh hưởng đến tiêu chí nghiệm thu của phiên bản hiện tại.

---

## 6. Kết luận & Biên bản Bàn giao Nghiệm thu UAT

### 6.1. Kết luận chung
- **Tổng số kịch bản UAT**: 15 kịch bản.
- **Số kịch bản đạt yêu cầu**: **15 / 15 kịch bản (Tỷ lệ chấp thuận: 100%)**.
- **Số lỗi nghiêm trọng phát sinh**: **0 lỗi**.
- **Đánh giá chung của Khách hàng**: Hệ thống EVManager vận hành ổn định, giao diện mượt mà, đáp ứng đầy đủ và chính xác tất cả các nghiệp vụ quản lý dịch vụ sự kiện đã cam kết trong tài liệu đặc tả yêu cầu (SRS).

### 6.2. Quyết định nghiệm thu
Đại diện Khách hàng và Ban Quản lý Dự án chính thức **CHẤP THUẬN NGHIỆM THU (UAT SIGN-OFF)** phiên bản phần mềm EVManager cho cột mốc Đợt 3 (Feature Complete). Hồ sơ UAT chính thức được bàn giao cho Project Manager để hoàn tất thủ tục báo cáo nghiệm thu đồ án.

---

### Chữ ký xác nhận nghiệm thu (Sign-off)

| Đại diện Khách hàng & Người dùng | Business Analyst Lead (BA) | QA & Test Lead | Project Manager (PM) |
|:---:|:---:|:---:|:---:|
| *(Đã ký xác nhận)* | *(Đã ký xác nhận)* | *(Đã ký xác nhận)* | *(Đã phê duyệt nghiệm thu)* |
| **Trần Hùng Dũng** | **Nguyễn Minh Hiển** | **Bùi Nguyễn Chí Hậu** | **Phan Lê Huy Hoàng** |
| Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 |
