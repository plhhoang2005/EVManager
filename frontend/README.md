# EVManager Frontend

Giao diện web EVManager được xây dựng bằng HTML, CSS và JavaScript thuần. Frontend hiện không có `package.json` và không cần cài dependency bằng npm.

## Yêu cầu

- Python 3 để chạy máy chủ web tĩnh, hoặc extension Live Server trong VS Code.
- Backend EVManager đang chạy tại `http://localhost:8080` nếu cần dùng các chức năng gọi API.

## Chạy giao diện

Mở PowerShell tại thư mục gốc repository, sau đó chạy:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
cd frontend
py -m http.server 5500
```

Mở <http://localhost:5500> trong trình duyệt. Dừng máy chủ bằng `Ctrl+C`.

Nếu lệnh `py` không có trên máy, thử `python -m http.server 5500`. Trong VS Code, cũng có thể mở `index.html` bằng extension Live Server.

## Chạy cùng Backend

Các trang hoặc thao tác cần dữ liệu từ API chỉ hoạt động khi backend và database đã được cấu hình, khởi động. Xem hướng dẫn tại [backend/README.md](../backend/README.md).

Frontend hiện gửi request API tới `http://localhost:8080`, được cấu hình trong `js/api.js`. Nếu backend chạy ở địa chỉ hoặc cổng khác, cần cập nhật `API_BASE_URL` trong file này.

## Các trang

| Tệp | Chức năng |
|---|---|
| `index.html` | Trang chủ |
| `services.html` | Dịch vụ |
| `calculator.html` | Tính chi phí |
| `gallery.html` | Sự kiện tiêu biểu |
| `schedule.html` | Lịch sự kiện |
| `contact.html` | Liên hệ |
| `login.html` | Đăng nhập |
| `register.html` | Đăng ký |
| `forgotPassword.html` | Quên mật khẩu |
| `admin.html` | Trang quản trị |

CSS dùng chung nằm trong `css/`, JavaScript trong `js/` và hình ảnh trong `images/`.