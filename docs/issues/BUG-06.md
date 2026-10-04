# [BUG-06] Thiếu API Dashboard tổng hợp khiến Frontend bị lỗi 404 và văng phiên đăng nhập

**Labels:** `type: bug`, `priority: high`, `backend`, `frontend`  
**Assignee:** `phucngo1707`, `nhanvo134679`  
**Jira Key:** `EV-158`

## 1. Mô tả lỗi
- Sau khi đăng nhập thành công bằng tài khoản Admin (`admin@evmanager.vn`), hệ thống điều hướng vào `admin.html`. Ngay lập tức người dùng bị đá văng trở lại màn hình `login.html`, hoặc màn hình hiển thị toàn bộ chỉ số KPI là 0đ / 0 sự kiện.

## 2. Nguyên nhân kỹ thuật
- **Backend:** Không có controller hoặc endpoint nào cho `/api/v1/dashboard` hay `/api/v1/dashboard/summary`.
- **Frontend (`api.js` dòng 44-50):** 
  ```javascript
  if (response.status === 401 || response.status === 403) {
      sessionStorage.removeItem('accessToken');
      window.location.href = 'login.html';
  }
  ```
  Khi gọi `/api/v1/dashboard` bị Spring Security trả về 403/404, `api.js` tự động xóa token và điều hướng về trang đăng nhập.

## 3. Giải pháp khắc phục
1. **Backend:** Tạo mới `DashboardController.java` với endpoint `GET /api/v1/dashboard/summary` trả về:
   - 4 chỉ số KPI: `totalRevenue`, `totalEvents`, `totalCustomers`, `pendingContracts`.
   - Dữ liệu biểu đồ doanh thu 6 tháng gần nhất (`monthlyRevenue`).
   - Danh sách sự kiện gần nhất (`recentEvents`).
2. **Security:** Cấu hình `SecurityConfig.java` cho phép người dùng có quyền `ADMIN`, `SALES`, `COORDINATOR`, `MANAGER`, `STAFF` truy cập endpoint này.
3. **Frontend (`api.js`):** Sửa lại logic điều hướng; chỉ logout khi gặp `401 Unauthorized` ở những endpoint bắt buộc, không xóa token khi gặp lỗi 404 của endpoint phụ.
