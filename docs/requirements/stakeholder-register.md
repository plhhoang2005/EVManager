SỔ ĐĂNG KÝ CÁC BÊN LIÊN QUAN
Dự án EVManager – Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới
1. Mục đích
Sổ đăng ký các bên liên quan được xây dựng nhằm xác định các cá nhân/nhóm có ảnh hưởng đến dự án EVManager hoặc chịu tác động từ hệ thống sau khi triển khai.
Việc xác định stakeholder giúp nhóm dự án hiểu được mối quan tâm, kỳ vọng, quyền lực và mức độ ảnh hưởng của từng đối tượng, từ đó lựa chọn phương thức quản lý và trao đổi phù hợp.
________________________________________
2. Danh sách Stakeholder
ID	Stakeholder	Vai trò	Mối quan tâm chính	Kỳ vọng đối với EVManager
S01	Ban Giám đốc trung tâm	Quyết định và kiểm soát hoạt động trung tâm	Doanh thu, hợp đồng, hiệu quả vận hành, kiểm soát rủi ro	Có Dashboard, báo cáo doanh thu, quản lý hợp đồng và dữ liệu tập trung
S02	Trưởng phòng Kinh doanh	Quản lý hoạt động Sales/Tư vấn	Khách hàng, báo giá, tỷ lệ chốt dịch vụ, lịch sảnh	Tra cứu nhanh sảnh/dịch vụ, quản lý khách hàng và theo dõi báo giá
S03	Nhân viên tư vấn	Trực tiếp tiếp nhận và tư vấn khách	Tốc độ xử lý, thông tin khách hàng, sảnh, thực đơn, báo giá	Giao diện dễ sử dụng, tra cứu nhanh, lập báo giá thuận tiện và hạn chế sai sót
S04	Kế toán	Theo dõi hợp đồng, đặt cọc và thanh toán	Công nợ, số tiền đã thu, số tiền còn phải thu	Theo dõi thanh toán chính xác, tra cứu lịch sử giao dịch và tổng hợp công nợ
S05	Khách đặt tiệc	Người sử dụng dịch vụ	Giá cả, dịch vụ, lịch tổ chức, hợp đồng, thanh toán	Được tư vấn rõ ràng, thông tin chính xác, dễ xác nhận dịch vụ và theo dõi trạng thái
________________________________________
3. Đánh giá quyền lực và mức độ ảnh hưởng
Thang điểm đánh giá:
•	1: Rất thấp
•	2: Thấp
•	3: Trung bình
•	4: Cao
•	5: Rất cao
ID	Stakeholder	Quyền lực	Ảnh hưởng	Nhận xét
S01	Ban Giám đốc trung tâm	5	5	Có quyền quyết định và phê duyệt các yêu cầu quan trọng của dự án
S02	Trưởng phòng Kinh doanh	4	5	Ảnh hưởng trực tiếp đến nghiệp vụ Sales, khách hàng và báo giá
S03	Nhân viên tư vấn	3	4	Là người sử dụng hệ thống thường xuyên và trực tiếp thực hiện nghiệp vụ
S04	Kế toán	4	4	Liên quan trực tiếp đến hợp đồng, đặt cọc, thanh toán và công nợ
S05	Khách đặt tiệc	3	4	Trực tiếp sử dụng dịch vụ và chịu tác động từ chất lượng quy trình
________________________________________
4. Ma trận Quyền lực – Ảnh hưởng
                 MỨC ĐỘ ẢNH HƯỞNG
              Thấp ←────────────→ Cao

QUYỀN     5 │                         │ S01
LỰC       4 │              S04        │ S02
          3 │                         │ S03, S05
          2 │                         │
          1 │                         │
            └─────────────────────────┘
              1    2    3    4    5
                    QUYỀN LỰC
Có thể phân thành các nhóm quản lý như sau:
Nhóm	Stakeholder	Chiến lược
Quyền lực cao – Ảnh hưởng cao	Ban Giám đốc, Trưởng phòng Kinh doanh, Kế toán	Manage Closely
Quyền lực trung bình – Ảnh hưởng cao	Nhân viên tư vấn, Khách đặt tiệc	Keep Informed
________________________________________
5. Chiến lược quản lý Stakeholder
5.1. Manage Closely – Quản lý chặt chẽ
Ban Giám đốc trung tâm
Lý do: Có quyền quyết định cao và ảnh hưởng lớn đến phạm vi, yêu cầu và kết quả dự án.
Chiến lược:
•	Thường xuyên cập nhật tiến độ.
•	Xin phê duyệt các yêu cầu quan trọng.
•	Demo các chức năng chính.
•	Thu thập phản hồi về báo cáo và Dashboard.
•	Báo cáo các vấn đề/rủi ro ảnh hưởng đến dự án.
Trưởng phòng Kinh doanh
Lý do: Có ảnh hưởng lớn đến quy trình tiếp nhận khách, tư vấn, báo giá và chốt dịch vụ.
Chiến lược:
•	Phỏng vấn nghiệp vụ.
•	Xác nhận quy trình Sales.
•	Demo chức năng quản lý khách hàng, sảnh và báo giá.
•	Thu thập phản hồi trong từng Sprint.
Kế toán
Lý do: Có vai trò quan trọng đối với nghiệp vụ hợp đồng, đặt cọc, thanh toán và công nợ.
Chiến lược:
•	Xác nhận quy trình thanh toán.
•	Kiểm tra các biểu mẫu liên quan.
•	Review chức năng công nợ.
•	Tham gia kiểm thử/UAT các nghiệp vụ tài chính.
________________________________________
5.2. Keep Informed – Duy trì được thông tin
Nhân viên tư vấn
Lý do: Là người sử dụng hệ thống thường xuyên và trực tiếp thực hiện quy trình tư vấn.
Chiến lược:
•	Hướng dẫn sử dụng hệ thống.
•	Thu thập phản hồi về giao diện.
•	Cập nhật thay đổi chức năng.
•	Cho phép tham gia UAT.
•	Ghi nhận các vấn đề phát sinh khi sử dụng.
Khách đặt tiệc
Lý do: Là người trực tiếp sử dụng dịch vụ và chịu tác động từ quy trình đặt tiệc.
Chiến lược:
•	Cung cấp thông tin rõ ràng về dịch vụ.
•	Cho phép xác nhận thông tin đặt tiệc.
•	Cập nhật trạng thái hợp đồng/thanh toán.
•	Thu thập phản hồi về trải nghiệm sử dụng.
________________________________________
6. Ma trận Stakeholder tổng hợp
Stakeholder	Quyền lực	Ảnh hưởng	Mối quan tâm	Kỳ vọng chính	Chiến lược
Ban Giám đốc	5	5	Quản trị, doanh thu, hợp đồng	Dashboard, báo cáo, kiểm soát dữ liệu	Manage Closely
Trưởng phòng Kinh doanh	4	5	Sales, khách hàng, báo giá	Quản lý khách hàng, sảnh, báo giá	Manage Closely
Nhân viên tư vấn	3	4	Tư vấn, báo giá, khách hàng	Tra cứu nhanh, thao tác thuận tiện	Keep Informed
Kế toán	4	4	Công nợ, thanh toán	Theo dõi chính xác các khoản thu	Manage Closely
Khách đặt tiệc	3	4	Dịch vụ, lịch, hợp đồng	Thông tin rõ ràng, dễ theo dõi	Keep Informed
________________________________________
7. Kết luận
Stakeholder Register cho EVManager xác định 5 nhóm bên liên quan chính gồm Ban Giám đốc trung tâm, Trưởng phòng Kinh doanh, Nhân viên tư vấn, Kế toán và Khách đặt tiệc.
Trong đó, Ban Giám đốc, Trưởng phòng Kinh doanh và Kế toán cần được quản lý và trao đổi chặt chẽ vì có quyền lực hoặc ảnh hưởng cao đối với các nghiệp vụ và kết quả dự án. Nhân viên tư vấn và Khách đặt tiệc cần được cung cấp thông tin đầy đủ và tham gia phản hồi, đặc biệt trong quá trình kiểm thử và nghiệm thu hệ thống.
Kết quả phân loại này là cơ sở để nhóm xác định kế hoạch giao tiếp, phỏng vấn nghiệp vụ, thu thập yêu cầu và tổ chức UAT cho dự án EVManager.
