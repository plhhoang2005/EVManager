# 🛡️ Hướng dẫn Sao lưu & Phục hồi Dữ liệu CSDL (Backup & Restore Guide)
> **Dự án**: EVManager — Hệ thống Quản lý Dịch vụ Sự kiện  
> **Tác giả**: Phúc (Backend / DevOps)  
> **Người tiếp nhận**: Hoàng (PM / Scrum Master)  
> **Mã công việc**: BE-33 (Issue #130)  
> **Hệ quản trị CSDL**: PostgreSQL 15+  

---

## 1. Tổng quan & Mục tiêu

Quy trình sao lưu (Backup) và phục hồi (Restore) dữ liệu được thiết lập nhằm:
- Phòng ngừa rủi ro mất mát dữ liệu do sự cố phần cứng, lỗi thao tác người dùng hoặc tấn công mạng.
- Đảm bảo tính liên tục của hoạt động kinh doanh (Business Continuity) với chỉ số RPO (Recovery Point Objective) dưới 24 giờ và RTO (Recovery Time Objective) dưới 30 phút.
- Tuân thủ tiêu chuẩn bàn giao kỹ thuật của dự án EVManager.

---

## 2. Cấu trúc Thư mục & Scripts

Bộ công cụ sao lưu được đặt tại thư mục `backend/scripts/`:

```
backend/
├── scripts/
│   ├── backup.sh      # Script sao lưu tự động (Linux / macOS / Docker)
│   ├── restore.sh     # Script phục hồi dữ liệu (Linux / macOS / Docker)
│   ├── backup.bat     # Script sao lưu cho Windows CMD
│   └── restore.bat    # Script phục hồi cho Windows CMD
└── backups/           # Thư mục lưu trữ các bản backup (đã cấu hình .gitignore)
```

---

## 3. Quy trình Sao lưu Dữ liệu (Backup)

### 3.1. Cơ chế hoạt động
- Tự động nạp thông tin kết nối từ file `.env` của backend (hoặc sử dụng giá trị mặc định).
- Sử dụng tiện ích `pg_dump` với các tham số:
  - `--clean`: Tạo lệnh DROP bảng trước khi CREATE để tránh xung đột khi restore.
  - `--if-exists`: Tránh lỗi nếu bảng chưa tồn tại.
  - `--no-owner --no-privileges`: Đảm bảo có thể restore vào bất kỳ user nào trên server mới.
- Nén file đầu ra dạng `evmanager_backup_YYYYMMDD_HHMMSS.sql.gz` để tiết kiệm dung lượng đĩa.
- Tự động xoay vòng (rotation): Xóa các bản sao lưu cũ hơn **7 ngày** để tránh tràn đĩa.

### 3.2. Thực thi trên Linux / macOS / Docker
```bash
cd backend/scripts
chmod +x backup.sh restore.sh
./backup.sh
```

### 3.3. Thực thi trên Windows
```cmd
cd backend\scripts
backup.bat
```

---

## 4. Quy trình Phục hồi Dữ liệu (Restore)

> [!CAUTION]
> **CẢNH BÁO NGUY HIỂM**: Quá trình restore sẽ ghi đè toàn bộ dữ liệu hiện tại trong cơ sở dữ liệu đích. Luôn thực hiện sao lưu CSDL hiện tại trước khi tiến hành restore bản cũ!

### 4.1. Thực thi trên Linux / macOS / Docker
```bash
cd backend/scripts
./restore.sh ../backups/evmanager_backup_20261020_110000.sql.gz
```
*Script sẽ yêu cầu nhập `yes` để xác nhận trước khi thực hiện.*

### 4.2. Thực thi trên Windows
```cmd
cd backend\scripts
restore.bat ..\backups\evmanager_backup_20261020_110000.sql
```
*Nhập `Y` khi màn hình hiển thị lời nhắc xác nhận.*

---

## 5. Thiết lập Lập lịch Tự động (Automated Scheduling)

### 5.1. Trên Linux Server (Crontab)
Chạy sao lưu tự động vào lúc **02:00 sáng mỗi ngày**:

```bash
crontab -e
```
Thêm dòng sau:
```cron
0 2 * * * /bin/bash /opt/evmanager/backend/scripts/backup.sh >> /var/log/evmanager_backup.log 2>&1
```

### 5.2. Trên Windows Server (Task Scheduler)
1. Mở **Task Scheduler** (`taskschd.msc`).
2. Chọn **Create Basic Task** -> Đặt tên: `EVManager_Daily_Backup`.
3. Trigger: Chọn **Daily** vào lúc **02:00:00 AM**.
4. Action: Chọn **Start a program** -> Trỏ đến file `backend\scripts\backup.bat`.
5. Đặt Start in: Đường dẫn thư mục `backend\scripts`.
6. Nhấn **Finish**.

---

## 6. Kịch bản Kiểm tra Phục hồi Thực tế (Verification Test)

Đã tiến hành nghiệm thu quy trình theo các bước:
1. **Bước 1**: Tạo dữ liệu mẫu trong bảng `customers` và `contracts`.
2. **Bước 2**: Chạy `backup.sh` / `backup.bat` -> Sinh file backup thành công.
3. **Bước 3**: Giả lập sự cố bằng cách xóa 1 khách hàng mẫu.
4. **Bước 4**: Chạy `restore.sh` / `restore.bat` với file backup vừa tạo.
5. **Bước 5**: Kiểm tra CSDL -> Khách hàng đã được phục hồi đầy đủ với toàn bộ quan hệ khóa ngoại (Foreign Keys).
