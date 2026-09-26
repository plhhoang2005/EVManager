# Báo cáo kết quả kiểm thử Đợt 1 & Đánh giá Sẵn sàng Demo Giữa kỳ (Midterm Test Report)

## 1. Thông tin tổng quan đợt kiểm thử Đợt 1

| Thuộc tính | Nội dung |
|---|---|
| Dự án | LV34-001 — EVManager |
| Đợt kiểm thử | **Đợt 1 — Demo Increment 1 / Chuẩn bị Demo Giữa kỳ** |
| Phụ trách QA | Hậu — Database + QA/Tester |
| Thời gian thực hiện | 26/09/2026 |
| Môi trường tích hợp | Local Staging (PostgreSQL 16 ↔ Backend API ↔ Frontend App) |
| Mục tiêu kiểm thử | Kiểm thử tích hợp 15 Test Cases (Auth, Khách hàng, Danh mục Sảnh tiệc), Kiểm thử Cross-browser & Đánh giá sẵn sàng Demo Giữa kỳ |

---

## 2. Kết quả kiểm thử 15 Kịch bản tích hợp (Integration Test Matrix)

| STT | Mã Test Case | Phân hệ | Tên Kịch Bản Kiểm Thử | Trình Duyệt / Env | Trạng Thái |
|:---:|---|---|---|:---:|:---:|
| 1 | `TC-AUTH-01` | Auth | Đăng nhập thành công với tài khoản Admin hợp lệ | Chrome / Firefox | **PASS** |
| 2 | `TC-AUTH-02` | Auth | Đăng nhập thất bại khi nhập sai mật khẩu (HTTP 401) | Chrome / Safari | **PASS** |
| 3 | `TC-AUTH-03` | Auth | Đăng nhập bằng tài khoản bị khóa (HTTP 403) | Chrome / Firefox | **PASS** |
| 4 | `TC-AUTH-04` | Auth | Khôi phục mật khẩu qua Email thành công | Chrome / Safari | **PASS** |
| 5 | `TC-AUTH-05` | Auth | Chặn quyền truy cập Admin khi dùng tài khoản Sales (HTTP 403) | Chrome / Edge | **PASS** |
| 6 | `TC-CUST-01` | Khách hàng | Thêm khách hàng mới với thông tin hợp lệ (HTTP 201) | Chrome / Firefox | **PASS** |
| 7 | `TC-CUST-02` | Khách hàng | Thêm khách hàng với SĐT đã tồn tại (HTTP 409 Conflict) | Chrome / Safari | **PASS** |
| 8 | `TC-CUST-03` | Khách hàng | Validate SĐT sai định dạng (< 10 số / có chữ) (HTTP 400) | Chrome / Edge | **PASS** |
| 9 | `TC-CUST-04` | Khách hàng | Tìm kiếm khách hàng theo 4 số cuối SĐT | Chrome / Firefox | **PASS** |
| 10 | `TC-CUST-05` | Khách hàng | Cập nhật thông tin địa chỉ & email khách hàng | Chrome / Safari | **PASS** |
| 11 | `TC-VEN-01` | Sảnh tiệc | Xem danh sách 5 sảnh tiệc kèm bộ lọc sức chứa | Chrome / Firefox | **PASS** |
| 12 | `TC-VEN-02` | Sảnh tiệc | Thêm mới sảnh tiệc thành công với giá thuê & sức chứa hợp lệ | Chrome / Safari | **PASS** |
| 13 | `TC-VEN-03` | Sảnh tiệc | Validate sức chứa tối đa nhỏ hơn sức chứa tối thiểu (HTTP 400) | Chrome / Edge | **PASS** |
| 14 | `TC-VEN-04` | Sảnh tiệc | Cập nhật trạng thái sảnh sang `MAINTENANCE` (Bảo trì) | Chrome / Firefox | **PASS** |
| 15 | `TC-VEN-05` | Sảnh tiệc | Chặn xóa sảnh tiệc đã gắn với lịch sự kiện (`RESTRICT`) | Chrome / Safari | **PASS** |

- **Tổng kết 15 Test Cases**: **15 / 15 PASS (Tỷ lệ Đạt: 100%)**.

---

## 3. Kiểm thử Tương thích Đa trình duyệt (Cross-browser Compatibility)

Đội QA đã tiến hành kiểm thử giao diện & luồng Đăng nhập trên 3 trình duyệt phổ biến nhất:

| Trình duyệt | Phiên bản | Luồng Đăng nhập & Lưu JWT | Hiển thị Form & Modal | Phản hồi Lỗi Validation | Đánh giá |
|---|:---:|:---:|:---:|:---:|:---:|
| **Google Chrome** | v128.0 (Desktop) | Smooth (Cookie / LocalStorage) | Chuẩn Responsive | Hiển thị Toast & Inline đỏ | **PASS (100%)** |
| **Mozilla Firefox** | v130.0 (Desktop) | Smooth | Chuẩn CSS Grid/Flexbox | Hiển thị Toast & Inline đỏ | **PASS (100%)** |
| **Apple Safari** | v17.5 (macOS/iOS) | Smooth (Handling SameSite cookie) | Chuẩn Layout | Hiển thị Toast & Inline đỏ | **PASS (100%)** |

---

## 4. Kiểm thử Đồng bộ Dữ liệu giữa Frontend & Backend (API Contract Verification)

- **Xác thực API DTO**: Toàn bộ dữ liệu trả về từ Backend (Mã lỗi, chuỗi thông báo tiếng Việt, cấu trúc JSON) khớp 100% với định dạng mong đợi của Frontend.
- **Xử lý trạng thái tải (Loading State)**: Frontend hiển thị hiệu ứng Skeleton/Spinner trong khi chờ API phản hồi.
- **Xử lý Token Hết hạn**: Khi JWT Token hết hạn, Frontend tự động điều hướng người dùng về trang `/login` và hiển thị thông báo *"Phiên làm việc đã hết hạn"*.

---

## 5. Tổng hợp Danh sách Lỗi phát sinh & Đề xuất Fix khẩn cấp trước Demo (Defect Log)

Dù đợt kiểm thử đạt 100% Pass kịch bản chính, QA ghi nhận 3 điểm lỗi giao diện/trải nghiệm ở mức **Minor** cần Dev (Phúc & Nhân) tinh chỉnh trước ngày Demo giữa kỳ:

| Defect ID | Phân hệ | Mô Tả Lỗi (Issue Description) | Mức Độ | Người Phụ Trách | Trạng Thái |
|:---:|---|---|:---:|:---:|:---:|
| `DEF-01` | Frontend UI | Nút "Thêm khách hàng" bị che một phần khi co màn hình xuống độ phân giải 1024x768. | Minor | Nhân (Frontend) | Open (Đang fix) |
| `DEF-02` | Frontend UI | Chưa có hiệu ứng Debounce 300ms khi gõ ô Tìm kiếm Sảnh tiệc làm trigger API liên tục. | Minor | Nhân (Frontend) | Open (Đang fix) |
| `DEF-03` | Backend Logs | Log máy chủ ghi thiếu tham số `ip_address` khi ghi nhận bảng `audit_logs` đăng nhập. | Minor | Phúc (Backend) | Open (Đang fix) |

- **Đánh giá mức độ ảnh hưởng**: Cả 3 lỗi trên đều là lỗi nhỏ về UI/Log, **không có lỗi Critical hay Blocker nào**.

---

## 6. XÁC NHẬN SẴN SÀNG DEMO GIỮA KỲ (DEMO MILESTONE SIGN-OFF)

```
================================================================================
          BÁO CÁO NGHIỆM THU ĐỢT 1 — KẾT QUẢ ĐÁNH GIÁ SẴN SÀNG DEMO GIỮA KỲ
================================================================================
  [✓] 100% Chức năng Must-have Đợt 1 PASS (15/15 Test Cases).
  [✓] Đăng nhập & Phân quyền RBAC chạy mượt mà trên Chrome, Firefox, Safari.
  [✓] Đồng bộ dữ liệu Frontend - Backend chuẩn xác.
  [✓] 0 Lỗi nghiêm trọng (Zero Blocker / Critical Bugs).

  ==> KẾT LUẬN: HỆ THỐNG ĐẠT TIÊU CHUẨN SẴN SÀNG CHẠY DEMO GIỮA KỲ 50%! 🎉
================================================================================
```

- **Xác nhận bởi QA Lead**: Hậu (Database + QA/Tester) — *Đã ký duyệt 26/09/2026*.
