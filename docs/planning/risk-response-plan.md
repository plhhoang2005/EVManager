# Kế hoạch ứng phó rủi ro dự án (Risk Response Plan — 4T)

| Thông tin | Chi tiết |
|---|---|
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-15 (WBS Level 3 — Chương 8 Quản lý rủi ro dự án) |
| **Người thực hiện** | Hoàng (Project Manager) |
| **Ngày lập** | 22/09/2026 (Tuần 3) |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Tổng quan phương pháp tiếp cận chiến lược 4T

Dựa trên kết quả định lượng từ **Bảng đăng ký rủi ro (Risk Register — PM-14)**, Ban Quản lý dự án EVManager xây dựng Kế hoạch ứng phó rủi ro chi tiết theo mô hình **4T** kinh điển chuẩn PMBOK:

1. **Tránh (Avoid / Terminate):** Chủ động thay đổi thiết kế kiến trúc, công nghệ hoặc quy trình làm việc để triệt tiêu hoàn toàn nguyên nhân gây ra rủi ro (áp dụng cho các rủi ro có tác động nghiêm trọng $I \ge 4$).
2. **Chuyển giao (Transfer / Transmit):** Chuyển giao trách nhiệm hoặc tác động tài chính/kỹ thuật của rủi ro cho bên thứ ba như nhà cung cấp dịch vụ hạ tầng đám mây (Cloud Provider), cổng thanh toán hoặc dịch vụ bản quyền.
3. **Giảm nhẹ (Mitigate / Treat):** Triển khai các biện pháp kỹ thuật, điều chỉnh tiến độ hoặc quy trình kiểm soát chất lượng nhằm kéo giảm Xác suất phát sinh ($P$) hoặc Mức độ ảnh hưởng ($I$) xuống mức chấp nhận được.
4. **Chấp nhận (Accept / Tolerate):** Ghi nhận rủi ro nhưng không đầu tư nguồn lực phòng ngừa trước do chi phí xử lý lớn hơn thiệt hại; chuẩn bị sẵn kế hoạch dự phòng (Contingency Plan) khi rủi ro kích hoạt.

---

## 2. Kế hoạch hành động chi tiết cho 10 rủi ro cốt lõi

Bảng dưới đây quy định phương án ứng phó, hành động cụ thể, chỉ số theo dõi và người chịu trách nhiệm cho từng rủi ro của dự án EVManager:

| Mã RR | Tên rủi ro & Mô tả | Điểm ($P \times I$) | Chiến lược 4T | Phương án hành động chi tiết (Action Plan) | Dấu hiệu nhận biết & Ngưỡng kích hoạt | Người phụ trách (Owner) | Thời hạn / Rà soát |
|:---:|---|:---:|:---:|---|---|:---:|:---:|
| **RSK-01** | **Thành viên trễ deadline sprint do bận thi cử/cá nhân** | **16** (Đỏ) | **Giảm nhẹ (Mitigate)** | • Tổ chức họp Daily Standup 10 phút qua Zalo/Discord để nắm vướng mắc trong ngày.<br>• Phân rã nhỏ công việc thành các micro-task $\le 2$ ngày.<br>• Áp dụng kỹ thuật bù tiến độ (Fast-tracking): Chuyển giao các task phụ của thành viên quá tải cho PM hoặc thành viên hoàn thành sớm hỗ trợ (Pair-working). | Không cập nhật task sau 24h, vắng họp nhóm, chưa tạo Pull Request trước hạn 1 ngày. | **PM (Hoàng)** | Hàng ngày (Daily) |
| **RSK-02** | **Thuật toán bị lọt ca tiệc, dẫn đến đặt trùng sảnh** | **15** (Đỏ) | **Tránh (Avoid)** | • Thiết lập ràng buộc cơ sở dữ liệu `EXCLUDE USING GIST` (PostgreSQL) hoặc Unique composite index chặn trùng lặp thời gian trên cùng sảnh.<br>• Tại tầng nghiệp vụ Backend (`BookingService`), bổ sung thuật toán kiểm tra xung đột thời gian bắt buộc có **thời gian đệm (buffer) 60 phút** giữa 2 ca tiệc phục vụ dọn dẹp và set up.<br>• QA viết bộ 15 kịch bản kiểm thử biên (Boundary Unit/Integration Tests) cho logic xếp lịch. | Phát hiện 2 tiệc trùng giờ khi QA chạy Test Suite hoặc hệ thống báo lỗi xung đột lịch. | **Backend (Phúc) & QA (Hậu)** | Hoàn thành trước Tuần 4 |
| **RSK-03** | **Lệch múi giờ UTC+7 làm sai ngày/giờ trên Calendar** | **12** (Đỏ) | **Giảm nhẹ (Mitigate)** | • Chuẩn hóa toàn bộ dữ liệu thời gian trong CSDL và API: Lưu trữ dưới chuẩn ISO 8601 theo múi giờ quốc tế UTC (`TIMESTAMP WITH TIME ZONE`).<br>• Phía Client (Frontend) sử dụng thư viện đồng bộ thời gian (`dayjs` / `date-fns`) với cấu hình cố định `timezone: Asia/Ho_Chi_Minh`.<br>• Thêm Integration Test gửi request từ múi giờ khác để kiểm tra tính toàn vẹn dữ liệu. | Xem lịch tiệc trên giao diện thấy giờ tiệc bị thụt lùi hoặc tiến lên 7 tiếng so với thực tế. | **QA (Hậu) + BE (Phúc)** | Tuần 3 |
| **RSK-04** | **Tính sai tổng tiền khi áp dụng chiết khấu kép (% và voucher)** | **12** (Đỏ) | **Tránh (Avoid)** | • Đóng băng công thức tính tiền chuẩn hóa từ BA: `Tổng = (Tiền sảnh + Tiền thực đơn + Tiền dịch vụ) * (1 - % Chiết khấu) - Voucher tiền mặt + Thuế VAT`.<br>• Xây dựng module tính tiền độc lập (`PricingCalculatorService`) với quy tắc làm tròn tiền tệ chuẩn theo VNĐ (không dùng số thực float/double, sử dụng `BigDecimal` trong Java).<br>• Viết Unit Test kiểm thử 100% các tình huống giảm giá vượt giá trị hợp đồng. | Chênh lệch số tiền giữa phiếu báo giá xem trước và tổng tiền lưu trong cơ sở dữ liệu. | **BA (Hiển) + BE (Phúc)** | Tuần 3 |
| **RSK-05** | **Khách hàng/Thầy cô yêu cầu đổi nghiệp vụ sau Demo giữa kỳ** | **12** (Đỏ) | **Giảm nhẹ (Mitigate)** | • Áp dụng quy chế "Đóng băng phạm vi" (Scope Freeze) sau Tuần 3: Không tự ý bổ sung tính năng mới ngoài Scope Statement.<br>• Mọi yêu cầu phát sinh từ buổi Demo giữa kỳ bắt buộc phải lập Phiếu yêu cầu thay đổi (Change Request Form — CR) đánh giá tác động chi phí/thời gian trước khi PM phê duyệt.<br>• Ưu tiên đưa các yêu cầu mới vào danh sách "Xem xét sau MVP" (Out-of-scope Tuần 8). | Nhận xét của Giảng viên yêu cầu bổ sung phân hệ đặt cọc online hoặc tích điểm khách hàng. | **BA (Hiển) + PM (Hoàng)** | Tuần 4 - 5 |
| **RSK-06** | **Xung đột mã nguồn (Merge Conflict) khi gộp code vào develop** | **8** (Vàng) | **Giảm nhẹ (Mitigate)** | • Thiết lập quy định bảo vệ nhánh (Branch Protection Rule) trên GitHub: Nhánh `develop` và `main` bắt buộc phải tạo Pull Request, có ít nhất 1 thành viên review và pass kiểm tra build.<br>• Phân chia cấu trúc mã nguồn theo Feature Folder rõ ràng, hạn chế việc nhiều thành viên cùng chỉnh sửa tệp cấu hình chung.<br>• Khuyến khích thành viên `git pull origin develop` hàng ngày trước khi bắt đầu viết code mới. | Pull Request trên GitHub chuyển sang trạng thái xung đột ("Can't automatically merge"). | **PM (Hoàng)** | Liên tục trong Sprint |
| **RSK-07** | **Môi trường Cloud Staging bị sập hoặc rớt mạng khi Demo** | **8** (Vàng) | **Chuyển giao (Transfer)** | • Sử dụng dịch vụ PaaS uy tín (Render/Supabase) có cam kết SLA cao để lưu trữ bản Staging phục vụ chấm điểm.<br>• **Phương án dự phòng khẩn cấp:** Cấu hình sẵn môi trường Localhost với `docker-compose.yml` trên máy tính xách tay của PM và Backend để sẵn sàng cắm máy chiếu demo offline nếu hội trường mất mạng. | Ping dịch vụ Staging không phản hồi, thời gian tải trang $> 10$ giây trước giờ báo cáo. | **DevOps (Phúc)** | Tuần 4 (trước buổi Demo) |
| **RSK-08** | **Lỗ hổng phân quyền RBAC (Tư vấn viên gọi trộm API Admin)** | **8** (Vàng) | **Tránh (Avoid)** | • Triển khai Guard/Middleware xác thực quyền hạn (`@PreAuthorize("hasRole('ADMIN')")`) ở cấp độ Controller cho 100% các API thay đổi dữ liệu nhạy cảm (Xóa sảnh, sửa giá, khóa tài khoản).<br>• Kiểm tra tính hợp lệ của Token JWT kèm theo vai trò (Role) trong từng request.<br>• QA thiết lập bộ test case Security trên Postman để thử nghiệm truy cập trái phép. | Tài khoản có vai trò Sales/Receptionist gửi request API Admin nhận mã HTTP 200 thay vì 403 Forbidden. | **Backend (Phúc)** | Tuần 3 |
| **RSK-09** | **Dữ liệu mẫu (Mock data) bị thiếu, không đủ demo trơn tru** | **6** (Vàng) | **Chấp nhận (Accept)** | • Chấp nhận không sinh toàn bộ khối lượng dữ liệu khổng lồ của một nhà hàng thực tế.<br>• QA xây dựng kịch bản Seed Data gọn gàng (task QA-08): 5 sảnh tiệc, 30 món ăn thực đơn, 5 dịch vụ cưới, 10 hợp đồng mẫu thể hiện đầy đủ trạng thái (Chờ duyệt, Đã cọc, Hoàn thành, Đã hủy). | Mở trang web demo thấy bảng biểu trống, biểu đồ báo cáo không có số liệu để phân tích. | **QA (Hậu)** | Tuần 3 |
| **RSK-10** | **Ứng dụng bị chậm (> 3s) khi tải danh sách nhiều sự kiện** | **4** (Xanh) | **Giảm nhẹ (Mitigate)** | • Đánh chỉ mục (Index) trên các trường cơ sở dữ liệu thường xuyên tra cứu và lọc (`event_date`, `hall_id`, `status`).<br>• Áp dụng cơ chế phân trang (Pagination) ở tầng Backend với kích thước mặc định `size=10` hoặc `size=20`.<br>• Phía giao diện sử dụng Skeleton loading và tối ưu kích thước ảnh sảnh tiệc. | Bật Network Tab trên trình duyệt thấy API trả về dữ liệu mất thời gian $> 2.5$ giây. | **Frontend (Nhân) + BE** | Tuần 4 |

---

## 3. Ngân sách và Thời gian dự phòng (Contingency Reserve)

Để đảm bảo dự án vận hành an toàn trước các biến động bất ngờ, Ban Quản lý xác lập 2 quỹ dự phòng độc lập:

### 3.1. Quỹ dự phòng tiến độ (Schedule Buffer)
- **Quy mô dự phòng:** Dự trữ **03 ngày làm việc** (từ thứ Năm đến thứ Bảy cuối Tuần 4) hoàn toàn không gán task phát triển tính năng mới.
- **Mục đích sử dụng:** 
  1. Dành trọn vẹn thời gian cho việc sửa lỗi (Bug fixing) và ổn định hệ thống.
  2. Bù tiến độ cho các công việc bị chậm phát sinh từ Tuần 2 và Tuần 3.
  3. Tổ chức ít nhất 02 buổi tổng duyệt (Dry-run) kịch bản thuyết trình giữa kỳ.

### 3.2. Quỹ dự phòng chi phí (Management & Cost Reserve)
- **Quy mô dự phòng:** Trích lập **10% tổng ngân sách ước tính** (dựa trên bài toán COCOMO tại task PM-12).
- **Mục đích sử dụng:** Sẵn sàng chi trả nâng cấp gói Cloud Server/Database lên gói trả phí trong thời gian 01 tháng (khoảng 300.000 – 500.000 VNĐ) nếu các gói miễn phí bị giới hạn băng thông hoặc ngủ đông trong giai đoạn nghiệm thu.

---

## 4. Kế hoạch ứng phó sự cố khẩn cấp (Disaster Recovery & Fallback Plan)

Trong buổi bảo vệ Demo Giữa kỳ (Tuần 4) và Cuối kỳ (Tuần 8), nếu xảy ra sự cố kỹ thuật bất khả kháng, toàn đội kích hoạt ngay quy trình xử lý khẩn cấp theo bảng sau:

```
                  ┌────────────────────────────────────────┐
                  │ Sự cố xảy ra trong buổi Demo báo cáo   │
                  └──────────────────┬─────────────────────┘
                                     │
             ┌───────────────────────┴───────────────────────┐
             ▼                                               ▼
┌─────────────────────────┐                     ┌─────────────────────────┐
│ Cloud Staging sập/Lag   │                     │ Mạng Wifi trường bị rớt │
└────────────┬────────────┘                     └────────────┬────────────┘
             │                                               │
             ▼                                               ▼
┌─────────────────────────┐                     ┌─────────────────────────┐
│ Kích hoạt Fallback sang │                     │ Bật 4G Hotspot cá nhân  │
│ Localhost Docker Compose│                     │ hoặc chuyển sang chạy   │
│ trên Laptop của PM/Dev  │                     │ Localhost hoàn toàn     │
└────────────┬────────────┘                     └────────────┬────────────┘
             │                                               │
             └───────────────────────┬───────────────────────┘
                                     ▼
                  ┌────────────────────────────────────────┐
                  │ Giảng viên theo dõi Demo không bị gián │
                  │ đoạn, đảm bảo điểm đánh giá nghiệp vụ  │
                  └────────────────────────────────────────┘
```

1. **Sự cố 1: Dịch vụ Cloud Staging báo lỗi 502/504 hoặc bị chậm:**
   - *Hành động:* PM ra hiệu cho Backend (Phúc) chuyển đổi đường link API trên trình duyệt sang `http://localhost:8080` (đã chạy sẵn qua Docker). Thời gian chuyển đổi không quá 30 giây.
2. **Sự cố 2: Mạng Internet của phòng học bị ngắt kết nối:**
   - *Hành động:* PM bật ngay điểm phát sóng di động 4G cá nhân dự phòng, hoặc tiếp tục trình diễn toàn bộ chức năng trên môi trường Localhost nội bộ máy tính mà không cần Internet.
3. **Sự cố 3: Phát hiện lỗi logic đột xuất khi Giảng viên yêu cầu thao tác một ca khó:**
   - *Hành động:* Thẳng thắn ghi nhận lỗi vào Biên bản ghi nhận ý kiến, giải trình rõ nguyên nhân kỹ thuật và cam kết cập nhật vào Kế hoạch khắc phục sau Demo (Task PM-21). Tuyệt đối không hoang mang hoặc tranh cãi.

---

## 5. Quy trình giám sát và phổ biến kế hoạch

1. **Phổ biến nội bộ:** PM chia sẻ tài liệu này vào nhóm Zalo/Discord chung của dự án, yêu cầu 4 thành viên (Hiển, Nhân, Phúc, Hậu) đọc kỹ các cam kết kỹ thuật thuộc vai trò của mình.
2. **Rà soát định kỳ:** Kế hoạch này được đối chiếu lại trong mỗi phiên họp tuần (Weekly Meeting) để đánh giá xem các giải pháp phòng ngừa có phát huy hiệu quả hay không.
3. **Chuyển tiếp:** Dữ liệu về việc bù tiến độ cho rủi ro `RSK-01` sẽ được cụ thể hóa trong **Task PM-16: Đánh giá lệch tiến độ và lập phương án bù tiến độ (Fast-tracking)**.
