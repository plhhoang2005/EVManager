# [BUG-02] Sai lệch 7 giờ trong lịch đặt tiệc do chênh lệch múi giờ UTC+7

**Labels:** `type: bug`, `priority: high`, `backend`, `frontend`

## Mô tả
- **Hiện tượng:** Khách đặt tiệc lúc 18:00 trên giao diện Client, nhưng khi lưu vào CSDL và hiển thị trên Lịch lại thành 11:00 (múi giờ chuẩn UTC+0).
- **Mức độ:** High (Gây sai lệch ca tiệc của khách hàng và nhà hàng).
- **Nguyên nhân:** Backend (Spring Boot) đang lưu theo giờ UTC và Serialize JSON trả về không có bù trừ múi giờ phù hợp với frontend.
- **Deadline xử lý:** 11/10/2026.

## Giải pháp (Đã thực thi)
1. Cấu hình `spring.jackson.time-zone: Asia/Ho_Chi_Minh` trong `application.yml` của Backend để API trả về giờ GMT+7.
2. Thêm `timeZone: 'Asia/Ho_Chi_Minh'` vào thư viện FullCalendar ở file `calendar.js` để render đồng bộ ngày tháng bất chấp timezone hệ thống của user.
3. Đã chạy re-test và xác nhận đồng bộ hoàn toàn.
