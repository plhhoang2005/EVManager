# 🎪 EVManager — Frontend Web Application

Hệ thống Quản lý và Điều hành Dịch vụ Sự kiện & Tiệc cưới **LV34 Events**, được xây dựng trên nền tảng **React 18** và **Vite**.

---

## 🌟 Tính Năng Chính

### 👤 Khách hàng (Client Portal)
- **Khám phá dịch vụ:** Xem chi tiết các gói tiệc cưới, hội nghị, gala, sinh nhật; hỗ trợ đăng ký tư vấn nhanh.
- **Chọn thực đơn tiệc cưới:** Giao diện trực quan chọn món theo từng nhóm (Khai vị, Món chính, Tráng miệng) và tự động tính tổng hóa đơn.
- **Dự toán chi phí trực tuyến:** Công cụ tính toán ngân sách sự kiện realtime theo số lượng khách, cấp độ sảnh và dịch vụ đi kèm.
- **Tra cứu lịch & Hồ sơ cá nhân:** Theo dõi lịch sự kiện, quản lý thông tin tài khoản và đổi mật khẩu an toàn.

### ⚙️ Quản trị & Điều phối (Admin / Staff Portal)
- **Dashboard & Báo cáo:** Thẻ chỉ số KPI, biểu đồ phân tích doanh thu (Chart.js) và nút xuất dữ liệu báo cáo ra file Excel (.xlsx) / PDF.
- **Quản lý khách hàng:** Danh sách khách hàng kèm tìm kiếm, bộ lọc phân hạng và form thêm/sửa có kiểm tra dữ liệu nghiêm ngặt (Zod).
- **Quản lý sự kiện & Lịch tiệc:** Lịch tương tác (FullCalendar) và công cụ kiểm tra xung đột trùng lịch sảnh.
- **Hợp đồng & Phiếu thu:** Quản lý hợp đồng, đợt thanh toán và hỗ trợ in ấn Hợp đồng A4 / Phiếu thu tiền trực tiếp.
- **Trang mã lỗi & Bảo mật:** Bộ trang 403, 404, 500 cùng ErrorBoundary bắt lỗi runtime; phân quyền 4 vai trò rõ ràng.

---

## 🛠️ Công Nghệ Sử Dụng

- **Core:** React 18, Vite 5, React Router v6
- **Form & Validation:** React Hook Form, Zod
- **Biểu đồ & Xuất file:** Chart.js, react-chartjs-2, SheetJS (`xlsx`)
- **Lịch & Tiện ích:** FullCalendar, SweetAlert2
- **Styling:** Vanilla CSS (Design Tokens), Bootstrap Icons, Print CSS (chuẩn A4)

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường
- **Node.js:** v18 trở lên
- **Trình quản lý gói:** npm

### 2. Cài đặt dependencies
```bash
cd frontend
npm.cmd install    # Trên Windows PowerShell
# hoặc: npm install
```

### 3. Khởi chạy môi trường phát triển (Dev)
```bash
npm.cmd run dev
# Mở trình duyệt tại: http://localhost:5173
```

### 4. Đóng gói sản phẩm (Build)
```bash
npm.cmd run build
```

---

## 🔑 Tài Khoản Dùng Thử (Demo)

| Vai trò | Tên đăng nhập / Email | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin_demo@evmanager.vn` (hoặc `admin`) | `admin123` (hoặc `123`) |
| **Nhân viên Sales** | `sales@evmanager.vn` (hoặc `sales01`) | `sales123` (hoặc `123`) |
| **Điều phối viên** | `coordinator@evmanager.vn` (hoặc `coord01`) | `coordinator123` (hoặc `123`) |
| **Khách hàng** | `khachhang1@gmail.com` (hoặc `user`) | `123456` (hoặc `123`) |

---

## 📂 Cấu Trúc Thư Mục

```text
frontend/
├── public/                 # Tài nguyên tĩnh (ảnh sự kiện, banner)
├── src/
│   ├── assets/             # Global styles
│   ├── components/         # Các component dùng chung và component chức năng
│   ├── context/            # AuthContext (quản lý đăng nhập, phiên làm việc)
│   ├── layouts/            # Layout Admin và Client
│   ├── pages/              # Trang Client, Admin, Auth, Error, User
│   ├── routes/             # Cấu hình định tuyến và phân quyền
│   ├── services/           # Kết nối API Backend (Axios)
│   ├── styles/             # File in ấn print.css (chuẩn hợp đồng A4)
│   └── validations/        # Schema xác thực dữ liệu Zod
├── .env                    # Biến môi trường (VITE_API_BASE_URL)
└── package.json            # Danh sách thư viện & scripts
```
