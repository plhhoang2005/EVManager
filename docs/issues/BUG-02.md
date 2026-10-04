# [BUG-02] Sai lệch 1 giờ trong lịch đặt tiệc do chênh lệch múi giờ UTC+7

**Labels:** `type: bug`, `priority: high`, `frontend`, `backend`  
**Assignee:** `nhanvo134679`, `phucngo1707`

## 1. Mô tả lỗi
- Khi người dùng tạo sự kiện vào lúc `17:30`, lịch FullCalendar trên giao diện hiển thị thành `16:30` hoặc `18:30` do chênh lệch múi giờ giữa máy chủ (UTC) và múi giờ cục bộ Việt Nam (`Asia/Ho_Chi_Minh` - UTC+7).
- Dẫn đến việc nhân viên điều phối tiệc bị nhầm giờ phục vụ tiệc cưới.

## 2. Nguyên nhân kỹ thuật
- Frontend FullCalendar chưa cấu hình tham số `timeZone: 'Asia/Ho_Chi_Minh'`.
- Backend Jackson Serializer chưa định hình múi giờ chuẩn trong `application.yml` (`spring.jackson.time-zone: Asia/Ho_Chi_Minh`).

## 3. Giải pháp khắc phục
- Thêm `timeZone: 'Asia/Ho_Chi_Minh'` vào cấu hình khởi tạo `FullCalendar.Calendar` trong `calendar.js`.
- Bổ sung cấu hình Jackson trong `application.yml` đồng bộ múi giờ Việt Nam.