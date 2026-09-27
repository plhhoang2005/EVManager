# EVManager Frontend — LV34 Event Operations Web Portal

![LV34 Events Frontend Banner](images/hero_banner.jpg)

> **EVManager Frontend** là giao diện người dùng và bảng điều khiển quản trị web dành cho hệ thống quản lý & tổ chức sự kiện **LV34 Events**. Giao diện được thiết kế hiện đại, tối ưu trải nghiệm (UX/UI) mượt mà trên mọi thiết bị (Responsive Mobile & Desktop), hỗ trợ cả hai vai trò **Khách hàng/Thành viên (User)** và **Quản trị viên (Admin)**.

---
### Cách chạy
cd backdend


## 📌 Danh Sách Các Trang & Chức Năng (Pages & Features)

### 1. Giao Diện Người Dùng & Khách Hàng (Client Portal)
- **`index.html` (Trang chủ)**:
  - Banner Hero giới thiệu năng lực tổ chức sự kiện 5 sao.
  - Các gói dịch vụ nổi bật (Tiệc cưới, Hội nghị doanh nghiệp, Liveshow đại nhạc hội).
  - Tích hợp công cụ tính báo giá nhanh, hình ảnh sự kiện tiêu biểu và lịch trình hoạt động cộng đồng.
  - Động hiển thị Nút Badge thành viên (`👤 <Username>`) và Nút Đăng xuất trên thanh Navbar khi đã đăng nhập.
- **`user.html` (Trang cá nhân Thành viên)**:
  - Giao diện tone sáng (Light Theme) sang trọng với nền màu trắng và chữ tối sắc nét.
  - Khung hiển thị thông tin tổng quan thành viên (Avatar, Vai trò, Username, Email, Số điện thoại, Ngày tham gia).
  - **Form Cập Nhật Hồ Sơ**: Cho phép thành viên chỉnh sửa Họ tên, Email, Số điện thoại (`PUT /api/v1/users/me`).
  - **Form Đổi Mật Khẩu**: Cho phép đổi mật khẩu cá nhân an toàn (`PUT /api/v1/users/me/password`).
  - Tích hợp đầy đủ tính năng tính chi phí sự kiện và đăng ký tư vấn trực tiếp.
- **`services.html` (Trang Dịch vụ)**: Trình bày chi tiết thông số kỹ thuật, bảng giá và hạng mục của từng gói dịch vụ.
- **`calculator.html` (Trang Tính Chi Phí)**: Công cụ dự trù ngân sách sự kiện tương tác tự động tính phí dựa trên loại hình sự kiện, số lượng khách mời và các hạng mục bổ sung (Sân khấu LED, Sound/Light, MC, Flycam 4K).
- **`gallery.html` (Thư viện Sự kiện)**: Thư viện hình ảnh dự án thực tế hỗ trợ lọc theo danh mục (Tiệc cưới, Hội nghị, Gala).
- **`schedule.html` (Lịch sắp tới)**: Theo dõi danh sách sự kiện mở rộng sắp diễn ra do LV34 tổ chức.
- **`contact.html` (Trang Liên hệ)**: Form gửi yêu cầu tư vấn báo giá trực tiếp tới chuyên viên sự kiện.

### 2. Giao Diện Xác Thực & Quản Trị (Auth & Admin Dashboard)
- **`login.html` (Đăng nhập)**:
  - Form đăng nhập tích hợp ẩn/hiện mật khẩu.
  - Tự động điều hướng: Tài khoản `admin` vào `admin.html`, tài khoản `user` vào `index.html`.
  - Tích hợp chế độ **Offline Demo Fallback** giúp kiểm thử giao diện ngay cả khi máy chủ Backend chưa bật.
- **`register.html` (Đăng ký)**: Form đăng ký tài khoản thành viên mới.
- **`admin.html` (Bảng điều khiển Quản trị)**:
  - Dashboard tổng quan chỉ số sự kiện, doanh thu và thống kê hoạt động.
  - Quản lý danh sách thành viên (Phân quyền, kích hoạt/khóa tài khoản).
  - Quản lý danh sách khách hàng, địa điểm tổ chức (Venues) và hợp đồng.
  - Xem nhật ký thao tác hệ thống (Audit Logs).

---

## 🛠️ Kiến Trúc & Cấu Trúc Mã Nguồn (Architecture)

Frontend được xây dựng theo kiến trúc **Vanilla Web Modules** (không phụ thuộc vào thư viện npm cồng kềnh, tải trang siêu nhanh):

```text
frontend/
├── index.html              # Trang chủ chính
├── user.html               # Trang quản lý thông tin thành viên
├── admin.html              # Trang bảng điều khiển admin
├── login.html              # Trang đăng nhập
├── register.html           # Trang đăng ký
├── services.html           # Trang dịch vụ
├── calculator.html         # Trang tính chi phí
├── gallery.html            # Trang thư viện dự án
├── schedule.html           # Trang lịch trình cộng đồng
├── contact.html            # Trang liên hệ
├── css/
│   └── styles.css          # Design system, CSS Variables & Layout rules
├── js/
│   ├── api.js              # Module trung tâm giao tiếp API (JWT & Bearer token)
│   ├── user.js             # Logic tải/sửa hồ sơ thành viên & đổi mật khẩu
│   ├── home.js             # Logic trang chủ & điều hướng Navbar
│   ├── login.js            # Logic đăng nhập & điều hướng phân quyền
│   ├── dashboard.js        # Logic quản trị Admin Dashboard
│   └── ...                 # Các module JS theo trang
└── images/                 # Tài nguyên hình ảnh dự án & hero banner
```

### 🔑 Module API Trung Tâm (`js/api.js`):
Cung cấp hàm `fetchAPI(endpoint, options)` dùng chung:
- **Tự động gắn Token**: Lấy `accessToken` từ `sessionStorage` và đính kèm vào Header `Authorization: Bearer <token>`.
- **Xử lý Token Hết Hạn**: Nếu Backend trả về HTTP `401 Unauthorized` hoặc `403 Forbidden`, hệ thống tự động xóa token và chuyển hướng về `login.html`.
- **Xử lý Offline**: Tự động thông báo và kích hoạt chế độ Demo để test giao diện khi không kết nối được `http://localhost:8080`.

---

## 🚀 Hướng Dẫn Chạy Frontend

### Cách 1: Chạy bằng VS Code Live Server (Khuyên dùng)
1. Mở thư mục `frontend/` trong VS Code.
2. Cài đặt Extension **Live Server** (nếu chưa có).
3. Click chuột phải vào `index.html` chọn **Open with Live Server**.
4. Truy cập địa chỉ: `http://127.0.0.1:5500/index.html`

### Cách 2: Chạy bằng HTTP Server qua dòng lệnh (CLI)
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Sử dụng Python HTTP Server
python -m http.server 3000

# Hoặc sử dụng Node.js npx
npx http-server . -p 3000
```
Sau đó truy cập: `http://localhost:3000`

### Cách 3: Mở trực tiếp bằng Trình duyệt
- Nhấp đôi trực tiếp vào file `index.html` hoặc `login.html` để mở trong trình duyệt Chrome / Edge / Firefox.

---

## 🔑 Tài Khoản Thử Nghiệm (Demo Accounts)

Bạn có thể nhập thông tin dưới đây tại trang `login.html` để thử nghiệm (hoạt động tốt trên cả máy chủ Backend thực tế và Chế độ Demo offline):

| Vai trò | Tên đăng nhập | Mật khẩu | Trang chuyển hướng |
|---|---|---|---|
| **Quản trị viên (Admin)** | `admin` | `123` | `admin.html` |
| **Thành viên (User)** | `user` | `123` | `index.html` (Hiển thị nút `👤 user` chuyển sang `user.html`) |

---

## 🎨 Quy Ước Thiết Kế (Design Guidelines)

- **Bảng màu chủ đạo**:
  - Teal (Ngọc bảo): `--teal: #087f82`
  - Orange (Cam ấm): `--orange: #d9763d`
  - Dark Ink (Chữ tối): `--ink: #172333`
  - Page Background (Nền sáng): `--page: #f8fafc` / `#ffffff`
- **Typography**: Google Font `Plus Jakarta Sans` với các font-weight 400, 500, 600, 700, 800.
- **Responsive**: Hỗ trợ đầy đủ màn hình Mobile (≤640px), Tablet (≤992px) và Desktop (≥1024px).
