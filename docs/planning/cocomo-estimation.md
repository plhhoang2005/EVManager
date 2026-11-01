# Ước tính chi phí theo mô hình COCOMO cơ bản

| Thông tin | Chi tiết |
|---|---|
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-12 (WBS Level 3 — Chương 4.2 Quản lý chi phí) |
| **Người thực hiện** | Hoàng (Project Manager) |
| **Ngày lập** | 22/09/2026 |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Cơ sở lý thuyết Mô hình COCOMO cơ bản (Basic COCOMO)

Mô hình **COCOMO (Constructive Cost Model)** do Barry Boehm đề xuất là một trong những phương pháp kinh điển và phổ biến nhất trong kỹ nghệ phần mềm và quản trị dự án CNTT để ước lượng nỗ lực (Effort), thời gian phát triển (Development Time) và quy mô nhân sự dựa trên số lượng dòng lệnh (KLOC — Kilo Lines of Code).

Theo chuẩn COCOMO cơ bản, dự án phần mềm được phân loại vào một trong ba chế độ (Mode):

| Chế độ (Mode) | Quy mô dự án | Môi trường phát triển | Độ phức tạp |
|---|---|---|---|
| **Organic (Hữu cơ)** | Nhỏ (< 50 KLOC) | Nhóm nhỏ, môi trường quen thuộc, yêu cầu linh hoạt | Thấp |
| **Semidetached (Bán rời)** | Trung bình (50–300 KLOC) | Nhóm đa dạng kinh nghiệm, công nghệ bán quen thuộc | Trung bình |
| **Embedded (Nhúng)** | Lớn (> 300 KLOC) | Ràng buộc phần cứng và môi trường vận hành khắt khe | Rất cao |

### Lựa chọn chế độ cho dự án EVManager:
Dự án EVManager được phát triển bởi nhóm **5 sinh viên**, sử dụng các công nghệ web hiện đại, phổ biến (NestJS, Next.js, PostgreSQL) với các yêu cầu nghiệp vụ quản lý tiệc cưới quen thuộc, phạm vi rõ ràng. Do đó, dự án được xếp vào **Chế độ Organic (Hữu cơ)**.

Hệ số chuẩn cho chế độ Organic:
- $a = 2.4$
- $b = 1.05$
- $c = 2.5$
- $d = 0.38$

---

## 2. Ước lượng quy mô dòng lệnh (Size Estimation — KLOC)

Dựa trên cấu trúc phân rã công việc WBS và danh mục 14 Use Cases trong tài liệu SRS, quy mô mã nguồn chức năng (Source Code không bao gồm thư viện bên thứ ba và chú thích) được ước tính như sau:

| Phân hệ (Subsystem) | Mô tả thành phần mã nguồn | Ước tính KLOC | Tỷ lệ (%) |
|---|---|:---:|:---:|
| **Xác thực & Quản trị** | Auth Module, JWT, RBAC Guards, Users CRUD | 0.8 KLOC | 11.6% |
| **Khách hàng & Sảnh tiệc** | Customer CRUD, Venue Management, Conflict Checker Engine | 1.6 KLOC | 23.2% |
| **Thực đơn & Dịch vụ** | Dishes Catalog, Menu Builder, Service Packages | 1.2 KLOC | 17.4% |
| **Hợp đồng & Thanh toán** | Contract State Machine, Pricing Calculator, Payments Transaction | 1.8 KLOC | 26.1% |
| **Báo cáo & Dashboard** | Dashboard Stats Query, ExcelJS Export, PDFKit Contract | 1.0 KLOC | 14.5% |
| **Hạ tầng & DTOs** | Global Filters, Validation Pipes, Prisma Middleware | 0.5 KLOC | 7.2% |
| **TỔNG CỘNG** | **Toàn bộ hệ thống EVManager (MVP)** | **6.9 KLOC** | **100.0%** |

$$\Rightarrow \mathbf{KLOC = 6.9}$$

---

## 3. Các phép tính toán COCOMO cơ bản

### 3.1. Ước tính Nỗ lực phát triển (Effort — Person-Months)
Công thức xác định tổng khối lượng lao động cần thiết để hoàn thành phần mềm:
$$E = a \times (KLOC)^b$$

Thay số:
$$E = 2.4 \times (6.9)^{1.05} = 2.4 \times 7.502 \approx \mathbf{18.0 \text{ người-tháng (person-months)}}$$

### 3.2. Ước tính Thời gian phát triển danh nghĩa (Development Time — TDEV)
Công thức tính thời gian phát triển tối ưu theo lịch dương lịch:
$$TDEV = c \times (E)^d$$

Thay số:
$$TDEV = 2.5 \times (18.0)^{0.38} = 2.5 \times 2.998 \approx \mathbf{7.5 \text{ tháng}}$$

### 3.3. Số lượng nhân sự lý thuyết cần thiết (Staff Size — SS)
Số lượng nhân sự trung bình làm việc toàn thời gian (Full-time) đồng thời:
$$SS = \frac{E}{TDEV} = \frac{18.0}{7.5} = \mathbf{2.4 \text{ người (full-time)}}$$

### 3.4. Năng suất lao động dự kiến (Productivity — P)
Số dòng lệnh hoàn thiện trên mỗi người-tháng:
$$P = \frac{KLOC}{E} = \frac{6.9}{18.0} \approx \mathbf{0.383 \text{ KLOC/người-tháng}} = \mathbf{383 \text{ LOC/người-tháng}}$$

---

## 4. Phân tích đối chiếu thực tế Đồ án môn học MAN104

Bảng đối chiếu giữa mô hình COCOMO lý thuyết doanh nghiệp và bối cảnh đồ án học phần:

| Chỉ số | COCOMO Lý thuyết (Doanh nghiệp) | Thực tế Đồ án MAN104 (Nhóm 5 SV) | Đánh giá & Biện luận của PM |
|---|:---:|:---:|---|
| **Thời gian** | 7.5 tháng | 8 tuần (~2 tháng) | Thời gian đồ án bị nén ngắn đòi hỏi nhóm phải tăng cường độ làm việc. |
| **Quy mô nhân sự** | 2.4 người (Full-time 40h/tuần) | 5 người (Part-time ~20h/tuần) | Nhóm 5 thành viên chia đều các mảng PM, BA, UI, BE, QA. |
| **Tổng giờ công** | $2.4 \times 7.5 \times 160\text{h} \approx 2.880\text{h}$ | $5 \times 20\text{h/tuần} \times 8\text{w} = 800\text{h}$ | Áp dụng công nghệ cao (NestJS, Prisma, Tailwind) giúp tăng năng suất $\times 3$. |

> [!NOTE]
> **Nhận xét của PM:** 
> Trong môi trường công nghiệp truyền thống, 6.9 KLOC cần 18 người-tháng. Tuy nhiên, trong đồ án đại học hiện đại:
> 1. Nhóm tận dụng tối đa mã nguồn khung (Boilerplates), bộ thư viện mã nguồn mở chất lượng cao (Shadcn/UI, Prisma ORM).
> 2. Quy trình làm việc áp dụng triệt để GitFlow và GitHub Projects giúp loại bỏ thời gian chết trong trao đổi thông tin.
> 3. Vì vậy, nỗ lực 800 giờ công của 5 sinh viên trong 8 tuần hoàn toàn khả thi để bàn giao sản phẩm MVP đạt chất lượng loại Khá.

---

## 5. Dự toán ngân sách nhân lực giả định (Budgeting)

Theo quy định hướng dẫn của môn học và mẫu báo cáo [Baocao.pdf](file:///d:/EVManager/Baocao.pdf), mức đơn giá ngày công kỹ sư giả định là **500.000 VNĐ / ngày công (man-day)**:

| Vai trò | Số lượng | Thời gian (ngày công) | Đơn giá / ngày (VNĐ) | Thành tiền dự kiến (VNĐ) |
|---|:---:|:---:|:---:|:---:|
| **Project Manager (Hoàng)** | 1 | 120 | 500.000 | 60.000.000 |
| **Business Analyst (Hiển)** | 1 | 20 | 500.000 | 10.000.000 |
| **Frontend Developer (Nhân)** | 1 | 30 | 500.000 | 15.000.000 |
| **Backend Developer (Phúc)** | 1 | 30 | 500.000 | 15.000.000 |
| **QA / Tester (Hậu)** | 1 | 20 | 500.000 | 10.000.000 |
| **Đào tạo người dùng** | 2 | 20 | 500.000 | 20.000.000 |
| **TỔNG CHI PHÍ NHÂN LỰC** | **5 SV** | — | — | **130.000.000 VNĐ** |

---

## 6. Kết luận & Hành động tiếp theo

1. Kết quả tính toán COCOMO cơ bản đã hoàn tất và đạt chuẩn yêu cầu Chương 4.2 của môn học MAN104.
2. Số liệu $E = 18.0 \text{ người-tháng}$ và $TDEV = 7.5 \text{ tháng}$ sẽ được trích dẫn chính thức vào Báo cáo giữa kỳ và Báo cáo tổng kết đồ án.
3. Task **PM-12 (Issue #18)** được nghiệm thu hoàn thành, gỡ bỏ nhãn `status: delayed` và chuyển sang trạng thái **Closed**.
