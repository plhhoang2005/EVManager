ĐỊNH NGHĨA NHÓM NGƯỜI DÙNG VÀ USER PERSONAS
1. Tổng quan các nhóm người dùng
Hệ thống EVManager – Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới được thiết kế cho 4 nhóm người dùng chính. Mỗi nhóm có vai trò, mục tiêu, quyền hạn và nhu cầu sử dụng hệ thống khác nhau.
STT	Actor	Vai trò chính	Mức độ sử dụng
1	Quản trị viên (Admin)	Quản lý tài khoản, cấu hình và toàn bộ dữ liệu hệ thống	Cao
2	Nhân viên Tư vấn / Sales	Tiếp nhận khách, tư vấn, báo giá và hợp đồng	Rất cao
3	Nhân viên Điều phối / Vận hành	Quản lý lịch, sảnh, phân công và giám sát sự kiện	Rất cao
4	Khách hàng / Khách đặt tiệc	Tra cứu hợp đồng, theo dõi sự kiện và thanh toán	Trung bình
Các nhóm này phù hợp với phạm vi người dùng của EVManager đã xác định gồm Quản trị, Sales/Tư vấn, Điều phối/Bếp và Khách hàng.
________________________________________
2. Actor 1 – Quản trị viên (Admin)
2.1. Định nghĩa Actor
Quản trị viên (Admin) là người chịu trách nhiệm quản lý tài khoản người dùng, phân quyền, cấu hình và kiểm soát hoạt động tổng thể của hệ thống EVManager.
Admin không trực tiếp thực hiện toàn bộ nghiệp vụ đặt tiệc nhưng có quyền truy cập ở mức quản trị để đảm bảo hệ thống hoạt động đúng với cơ cấu tổ chức.
2.2. Mục tiêu
•	Quản lý người dùng trong hệ thống.
•	Quản lý vai trò và quyền truy cập.
•	Đảm bảo dữ liệu được tổ chức thống nhất.
•	Theo dõi hoạt động của hệ thống.
•	Xem các báo cáo tổng hợp.
•	Hỗ trợ xử lý các vấn đề liên quan đến tài khoản và phân quyền.
2.3. Chức năng chính
Nhóm chức năng	Chức năng
Tài khoản	Thêm, sửa, khóa/mở tài khoản
Vai trò	Tạo và quản lý Role
Phân quyền	Cấp quyền cho người dùng
Cấu hình	Quản lý cấu hình hệ thống
Dữ liệu	Quản lý dữ liệu danh mục
Báo cáo	Xem Dashboard và báo cáo tổng thể
Giám sát	Theo dõi hoạt động hệ thống
2.4. Nhu cầu của Admin
Admin cần một giao diện quản trị tập trung, dễ kiểm soát và hạn chế thao tác sai.
Các thông tin Admin quan tâm:
•	Người dùng đang hoạt động.
•	Vai trò và quyền hạn.
•	Tình trạng hệ thống.
•	Số lượng hợp đồng.
•	Doanh thu.
•	Tình trạng các sự kiện.
•	Các dữ liệu nghiệp vụ quan trọng.
________________________________________
3. User Persona – Quản trị viên
👤 Persona: Nguyễn Văn An
Thuộc tính	Mô tả
Tên	Nguyễn Văn An
Tuổi	35
Vị trí	Quản trị viên hệ thống
Kinh nghiệm	5+ năm quản lý hệ thống
Mục tiêu	Hệ thống hoạt động ổn định, dữ liệu chính xác
Thiết bị	Máy tính/Desktop
Tần suất sử dụng	Hàng ngày
Kỹ năng CNTT	Khá – tốt
Pain Points – Điểm khó khăn
•	Khó kiểm soát nhiều tài khoản bằng phương pháp thủ công.
•	Dữ liệu phân tán.
•	Khó kiểm soát quyền truy cập.
•	Mất thời gian tổng hợp báo cáo.
•	Khó phát hiện vấn đề từ dữ liệu.
Needs – Nhu cầu
•	Dashboard tổng quan.
•	Quản lý tài khoản tập trung.
•	Phân quyền rõ ràng.
•	Báo cáo tự động.
•	Tra cứu dữ liệu nhanh.
User Story
Là một Admin, tôi muốn quản lý tài khoản và quyền truy cập của người dùng để đảm bảo mỗi nhân viên chỉ được sử dụng những chức năng phù hợp với vai trò của mình.
________________________________________
4. Actor 2 – Nhân viên Tư vấn / Sales
4.1. Định nghĩa Actor
Nhân viên Tư vấn / Sales là người trực tiếp tiếp nhận nhu cầu của khách hàng và thực hiện phần lớn quy trình trước khi sự kiện được bàn giao cho bộ phận Điều phối.
Sales là một trong những nhóm người dùng sử dụng hệ thống thường xuyên nhất.
4.2. Mục tiêu
•	Tiếp nhận khách hàng nhanh chóng.
•	Tra cứu sảnh còn trống.
•	Tư vấn menu và dịch vụ.
•	Lập báo giá.
•	Chỉnh sửa báo giá theo yêu cầu.
•	Lập hợp đồng.
•	Ghi nhận đặt cọc.
•	Theo dõi trạng thái hợp đồng.
4.3. Chức năng chính
Nhóm chức năng	Chức năng
Khách hàng	Thêm, sửa, tra cứu khách hàng
Sảnh	Tra cứu sảnh và lịch
Menu	Chọn và tư vấn thực đơn
Dịch vụ	Chọn dịch vụ đi kèm
Báo giá	Tạo và cập nhật báo giá
Hợp đồng	Lập và quản lý hợp đồng
Đặt cọc	Ghi nhận thông tin đặt cọc
Sự kiện	Theo dõi lịch và trạng thái
4.4. Nhu cầu
Sales cần giao diện có tốc độ thao tác nhanh vì phải làm việc trực tiếp với khách hàng.
Hệ thống cần hỗ trợ:
•	Tra cứu sảnh theo ngày/giờ.
•	Hiển thị sảnh còn trống.
•	Tra cứu giá dịch vụ.
•	Tạo báo giá nhanh.
•	Tự động tính tổng tiền.
•	Chuyển thông tin báo giá sang hợp đồng.
•	Hạn chế nhập lại dữ liệu.
________________________________________
5. User Persona – Nhân viên Tư vấn / Sales
👤 Persona: Trần Thị Lan
Thuộc tính	Mô tả
Tên	Trần Thị Lan
Tuổi	27
Vị trí	Nhân viên tư vấn/Sales
Kinh nghiệm	2–4 năm
Mục tiêu	Tư vấn nhanh, chính xác và chốt hợp đồng
Thiết bị	Laptop/Desktop
Tần suất sử dụng	Hàng ngày
Kỹ năng CNTT	Trung bình – khá
Pain Points
•	Phải hỏi nhiều bộ phận để biết sảnh còn trống.
•	Khó nhớ giá của nhiều menu/dịch vụ.
•	Lập báo giá thủ công mất thời gian.
•	Dễ nhầm thông tin khách hàng.
•	Dễ xảy ra sai lệch giữa báo giá và hợp đồng.
Needs
•	Lịch sảnh trực quan.
•	Tra cứu nhanh.
•	Báo giá tự động.
•	Quản lý khách hàng tập trung.
•	Theo dõi hợp đồng.
•	Cảnh báo khi sảnh bị trùng lịch.
User Story
Là một nhân viên Sales, tôi muốn tra cứu sảnh, menu và dịch vụ theo thời gian thực để có thể tư vấn và lập báo giá chính xác cho khách hàng.
________________________________________
6. Actor 3 – Nhân viên Điều phối / Vận hành
6.1. Định nghĩa Actor
Nhân viên Điều phối / Vận hành chịu trách nhiệm tiếp nhận các hợp đồng đã được xác nhận và tổ chức thực hiện sự kiện theo đúng lịch, sảnh, menu và dịch vụ đã cam kết.
Đây là Actor trực tiếp sử dụng hệ thống trong giai đoạn chuẩn bị và tổ chức sự kiện.
6.2. Mục tiêu
•	Theo dõi lịch tổ chức tiệc.
•	Quản lý trạng thái sảnh.
•	Phân công nhân sự/phục vụ.
•	Theo dõi menu và dịch vụ.
•	Chuẩn bị sự kiện.
•	Giám sát quá trình tổ chức.
•	Cập nhật trạng thái sự kiện.
•	Xác nhận hoàn tất sự kiện.
6.3. Chức năng chính
Nhóm chức năng	Chức năng
Lịch sự kiện	Xem và quản lý lịch
Sảnh	Kiểm tra tình trạng sảnh
Điều phối	Phân công phục vụ
Dịch vụ	Kiểm tra dịch vụ cần chuẩn bị
Menu	Theo dõi thực đơn
Sự kiện	Cập nhật trạng thái
Giám sát	Theo dõi tiến độ
Hoàn tất	Xác nhận sự kiện hoàn thành
6.4. Nhu cầu
Điều phối viên cần thông tin chính xác và cập nhật nhanh về:
•	Ngày/giờ tổ chức.
•	Sảnh.
•	Số lượng khách.
•	Menu.
•	Dịch vụ.
•	Nhân sự được phân công.
•	Trạng thái chuẩn bị.
•	Trạng thái tổ chức.
________________________________________
7. User Persona – Nhân viên Điều phối / Vận hành
👤 Persona: Lê Văn Hùng
Thuộc tính	Mô tả
Tên	Lê Văn Hùng
Tuổi	32
Vị trí	Nhân viên điều phối
Kinh nghiệm	4–6 năm
Mục tiêu	Tổ chức sự kiện đúng kế hoạch
Thiết bị	Desktop/Tablet
Tần suất sử dụng	Hàng ngày, đặc biệt trước và trong sự kiện
Kỹ năng CNTT	Trung bình
Pain Points
•	Khó theo dõi nhiều sự kiện cùng lúc.
•	Dễ bỏ sót yêu cầu dịch vụ.
•	Thông tin từ Sales có thể không đồng nhất.
•	Khó biết chính xác trạng thái chuẩn bị.
•	Phân công thủ công mất thời gian.
Needs
•	Lịch sự kiện trực quan.
•	Checklist chuẩn bị.
•	Thông tin hợp đồng đầy đủ.
•	Phân công nhân sự.
•	Cập nhật trạng thái theo thời gian thực.
•	Cảnh báo xung đột lịch.
User Story
Là một nhân viên Điều phối, tôi muốn xem toàn bộ thông tin sự kiện và cập nhật trạng thái chuẩn bị để đảm bảo buổi tiệc được tổ chức đúng kế hoạch.
________________________________________
8. Actor 4 – Khách hàng / Khách đặt tiệc
8.1. Định nghĩa Actor
Khách hàng / Khách đặt tiệc là người sử dụng hệ thống ở phía ngoài để theo dõi thông tin liên quan đến việc đặt tiệc và hợp đồng của mình.
Khách hàng không có quyền truy cập vào dữ liệu của khách hàng khác hoặc các chức năng quản trị nội bộ.
8.2. Mục tiêu
•	Xem thông tin đặt tiệc.
•	Tra cứu hợp đồng.
•	Kiểm tra sảnh và dịch vụ đã đặt.
•	Theo dõi tiến độ chuẩn bị.
•	Theo dõi số tiền đã đặt cọc.
•	Theo dõi số tiền còn phải thanh toán.
•	Nhận thông báo liên quan đến sự kiện.
8.3. Chức năng chính
Nhóm chức năng	Chức năng
Tài khoản	Đăng nhập/Đăng xuất
Hợp đồng	Xem thông tin hợp đồng
Đặt tiệc	Xem thông tin đặt tiệc
Sảnh	Xem sảnh đã đặt
Dịch vụ	Xem dịch vụ đã đăng ký
Thanh toán	Theo dõi tiền cọc/thanh toán
Sự kiện	Theo dõi tiến độ
Thông báo	Nhận thông báo
8.4. Nhu cầu
Khách hàng cần giao diện đơn giản, dễ hiểu và có thể nhanh chóng biết:
•	Tiệc được tổ chức khi nào?
•	Tổ chức ở sảnh nào?
•	Đã chọn những dịch vụ gì?
•	Hợp đồng có giá trị bao nhiêu?
•	Đã đặt cọc bao nhiêu?
•	Còn phải thanh toán bao nhiêu?
•	Sự kiện đang ở trạng thái nào?
________________________________________
9. User Persona – Khách hàng
👤 Persona: Nguyễn Minh Anh
Thuộc tính	Mô tả
Tên	Nguyễn Minh Anh
Tuổi	29
Vai trò	Khách đặt tiệc
Mục tiêu	Theo dõi và đảm bảo tiệc được tổ chức đúng thỏa thuận
Thiết bị	Smartphone/Laptop
Tần suất sử dụng	Theo nhu cầu
Kỹ năng CNTT	Trung bình – khá
Pain Points
•	Phải gọi điện cho nhân viên để hỏi thông tin.
•	Không biết chính xác trạng thái chuẩn bị.
•	Khó nhớ các khoản đã thanh toán.
•	Khó kiểm tra lại hợp đồng.
•	Thông tin có thể bị thất lạc khi trao đổi qua nhiều kênh.
Needs
•	Trang thông tin cá nhân.
•	Hợp đồng điện tử.
•	Thông tin đặt tiệc rõ ràng.
•	Theo dõi tiền cọc.
•	Theo dõi tiến độ.
•	Nhận thông báo.
•	Tra cứu thông tin mọi lúc.
User Story
Là một khách hàng, tôi muốn xem hợp đồng, thông tin đặt tiệc và khoản tiền đã thanh toán để chủ động theo dõi kế hoạch tổ chức sự kiện của mình.
________________________________________
10. Bảng tổng hợp User Personas
Persona	Actor	Mục tiêu chính	Nhu cầu quan trọng nhất
Nguyễn Văn An	Admin	Quản trị hệ thống	Tài khoản, phân quyền, báo cáo
Trần Thị Lan	Sales	Tư vấn và chốt hợp đồng	Tra cứu sảnh, báo giá, hợp đồng
Lê Văn Hùng	Điều phối	Tổ chức sự kiện	Lịch, phân công, trạng thái
Nguyễn Minh Anh	Khách hàng	Theo dõi tiệc	Hợp đồng, tiến độ, thanh toán
________________________________________
11. Mối quan hệ giữa Actor và quy trình nghiệp vụ
Actor	Tiếp nhận & Tư vấn	Chốt dịch vụ & Hợp đồng	Điều phối sự kiện	Báo cáo/Quản trị
Admin	○	○	○	●
Sales	●	●	○	○
Điều phối	○	○	●	○
Khách hàng	●	●	●	○
Chú thích:
•	●: Tham gia trực tiếp.
•	○: Có thể xem/nhận thông tin hoặc hỗ trợ gián tiếp.
________________________________________
12. Tổng kết
Bốn Actor được phân tách theo đúng trách nhiệm trong quy trình nghiệp vụ:
Khách hàng
↓
Sales/Tư vấn
↓
Hợp đồng & Đặt cọc
↓
Điều phối/Vận hành
↓
Hoàn tất sự kiện
Trong khi đó, Admin đóng vai trò quản trị xuyên suốt hệ thống, chịu trách nhiệm về tài khoản, phân quyền, cấu hình và khả năng giám sát thông qua Dashboard/Báo cáo.
Việc xây dựng User Persona giúp nhóm phát triển hiểu rõ ai sử dụng hệ thống, họ cần gì, gặp khó khăn gì và mục tiêu khi sử dụng phần mềm là gì. Đây là cơ sở để tiếp tục xây dựng Use Case, User Story, Acceptance Criteria và thiết kế UI/UX cho EVManager.
