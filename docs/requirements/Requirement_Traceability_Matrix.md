# MA TRẬN TRUY VẾT YÊU CẦU – REQUIREMENT TRACEABILITY MATRIX (RTM) v1.0

**Dự án:** EVManager – Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới  
**Phiên bản:** 1.0  
**Ngày:** 25/09/2026  
**Tài liệu liên quan:** SRS v1.0  

Bảng tính Excel chính thức được lưu trữ tại: [`docs/requirements/Requirement_Traceability_Matrix.xlsx`](Requirement_Traceability_Matrix.xlsx)

---

## 1. MỤC ĐÍCH

RTM được xây dựng nhằm:
- Đảm bảo mọi yêu cầu kinh doanh đều được phân rã thành yêu cầu chức năng/Use Case.
- Đảm bảo không bỏ sót yêu cầu trong Scope Statement.
- Theo dõi từ yêu cầu $\rightarrow$ Use Case $\rightarrow$ UI $\rightarrow$ Code $\rightarrow$ Test Case.
- Xác định trạng thái triển khai của từng yêu cầu.
- Hỗ trợ QA kiểm tra độ bao phủ yêu cầu.
- Làm cơ sở kiểm soát thay đổi trong các Sprint.

**Chuỗi truy vết:**
$$\text{BR} \rightarrow \text{UC} \rightarrow \text{UI} \rightarrow \text{Module Code} \rightarrow \text{Test Case} \rightarrow \text{Kết quả kiểm thử}$$

---

## 2. QUY ƯỚC MÃ

| Loại | Quy ước | Ví dụ |
| :--- | :--- | :--- |
| **BR** | Business Requirement | BR-01 |
| **UC** | Use Case | UC-01 |
| **UI** | Giao diện | UI-01 |
| **MOD** | Module Code | MOD-01 |
| **TC** | Test Case | TC-01 |
| **NFR** | Non-functional Requirement | NFR-01 |

---

## 3. MA TRẬN TRUY VẾT YÊU CẦU CƠ BẢN

| BR | Yêu cầu kinh doanh | UC | UI | Module Code | Test Case | Trạng thái |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **BR-01** | Quản lý tài khoản và đăng nhập hệ thống | UC-01, UC-02 | UI-01, UI-02 | MOD-AUTH | TC-AUTH-01 $\rightarrow$ 05 | 🟡 Đang làm |
| **BR-02** | Quản lý hồ sơ khách hàng | UC-03 | UI-03 | MOD-CUSTOMER | TC-CUS-01 $\rightarrow$ 04 | 🔴 Chưa làm |
| **BR-03** | Tra cứu sảnh theo ngày, ca và số bàn | UC-04 | UI-04 | MOD-VENUE | TC-VEN-01 $\rightarrow$ 04 | 🟡 Đang làm |
| **BR-04** | Kiểm tra và cảnh báo xung đột lịch sảnh | UC-04, UC-10 | UI-04, UI-10 | MOD-SCHEDULE | TC-SCH-01 $\rightarrow$ 05 | 🟡 Đang làm |
| **BR-05** | Giữ chỗ sảnh tạm thời | UC-05 | UI-05 | MOD-HOLD | TC-HOLD-01 $\rightarrow$ 04 | 🔴 Chưa làm |
| **BR-06** | Chọn Set Menu và lập thực đơn | UC-06 | UI-06 | MOD-MENU | TC-MENU-01 $\rightarrow$ 06 | 🟡 Đang làm |
| **BR-07** | Tùy chỉnh món ăn và tính chênh lệch giá | UC-06 | UI-06 | MOD-MENU | TC-MENU-07 $\rightarrow$ 09 | 🟡 Đang làm |
| **BR-08** | Chọn dịch vụ bổ sung | UC-07 | UI-07 | MOD-SERVICE | TC-SVC-01 $\rightarrow$ 05 | 🟡 Đang làm |
| **BR-09** | Tự động áp dụng dịch vụ tặng kèm theo số bàn | UC-07 | UI-07 | MOD-SERVICE | TC-SVC-06 $\rightarrow$ 08 | 🟡 Đang làm |
| **BR-10** | Tự động tính tổng chi phí tiệc | UC-08 | UI-08 | MOD-QUOTATION | TC-QUO-01 $\rightarrow$ 06 | 🟡 Đang làm |
| **BR-11** | Áp dụng chiết khấu và VAT | UC-08 | UI-08 | MOD-QUOTATION | TC-QUO-07 $\rightarrow$ 10 | 🔴 Chưa làm |
| **BR-12** | Lập và gửi bảng báo giá | UC-08 | UI-08 | MOD-QUOTATION | TC-QUO-11 $\rightarrow$ 14 | 🔴 Chưa làm |
| **BR-13** | Lập lịch sự kiện | UC-09 | UI-09 | MOD-SCHEDULE | TC-SCH-06 $\rightarrow$ 09 | 🔴 Chưa làm |
| **BR-14** | Kiểm tra xung đột khi lập lịch | UC-10 | UI-10 | MOD-SCHEDULE | TC-SCH-10 $\rightarrow$ 12 | 🔴 Chưa làm |
| **BR-15** | Quản lý hợp đồng | UC-11 | UI-11 | MOD-CONTRACT | TC-CON-01 $\rightarrow$ 05 | 🔴 Chưa làm |
| **BR-16** | Quản lý thanh toán | UC-12 | UI-12 | MOD-PAYMENT | TC-PAY-01 $\rightarrow$ 05 | 🔴 Chưa làm |
| **BR-17** | Điều phối nhân sự và chuẩn bị tiệc | UC-13 | UI-13 | MOD-EVENT | TC-EVT-01 $\rightarrow$ 05 | 🔴 Chưa làm |
| **BR-18** | Quyết toán sau sự kiện | UC-14 | UI-14 | MOD-SETTLEMENT | TC-SET-01 $\rightarrow$ 05 | 🔴 Chưa làm |
| **BR-19** | Dashboard và báo cáo quản lý | UC-02, UC-14 | UI-15 | MOD-REPORT | TC-REP-01 $\rightarrow$ 04 | 🔴 Chưa làm |
| **BR-20** | Gửi thông báo cho người dùng/khách hàng | UC-08, UC-11, UC-12 | UI-16 | MOD-NOTIFICATION | TC-NOT-01 $\rightarrow$ 04 | 🔴 Chưa làm |

---

## 4. TRUY VẾT YÊU CẦU PHI CHỨC NĂNG

| Mã NFR | Yêu cầu | Thành phần liên quan | Test Case | Trạng thái |
| :---: | :--- | :--- | :---: | :---: |
| **NFR-01** | Thời gian phản hồi nghiệp vụ thông thường < 3 giây | Backend/API/UI | TC-PERF-01 | Chưa kiểm thử |
| **NFR-02** | Tra cứu sảnh < 3 giây | MOD-VENUE | TC-PERF-02 | Chưa kiểm thử |
| **NFR-03** | Tính báo giá < 3 giây | MOD-QUOTATION | TC-PERF-03 | Chưa kiểm thử |
| **NFR-04** | Xác thực bằng JWT | MOD-AUTH | TC-SEC-01 | Chưa kiểm thử |
| **NFR-05** | Mật khẩu được hash bằng BCrypt | MOD-AUTH | TC-SEC-02 | Chưa kiểm thử |
| **NFR-06** | Phân quyền theo Actor/Role | MOD-AUTH | TC-SEC-03 | Chưa kiểm thử |
| **NFR-07** | Hệ thống hướng tới khả dụng 24/7 | Toàn hệ thống | TC-AVL-01 | Chưa kiểm thử |
| **NFR-08** | Giao diện responsive trên máy tính bảng | Frontend | TC-UI-01 | Chưa kiểm thử |
| **NFR-09** | Kiểm tra dữ liệu trước khi lưu | Các UC nghiệp vụ | TC-VAL-01 $\rightarrow$ 05 | 🟡 Đang làm |

---

## 5. KIỂM TRA BAO PHỦ SCOPE STATEMENT

Các nhóm chức năng chính trong Scope Statement được truy vết như sau:

| Nhóm trong Scope | UC tương ứng | Đã truy vết? |
| :--- | :---: | :---: |
| Quản lý tài khoản | UC-01, UC-02 | ✅ |
| Quản lý khách hàng | UC-03 | ✅ |
| Quản lý sảnh | UC-04, UC-05 | ✅ |
| Quản lý thực đơn | UC-06 | ✅ |
| Quản lý dịch vụ | UC-07 | ✅ |
| Báo giá | UC-08 | ✅ |
| Lập lịch | UC-09 | ✅ |
| Kiểm tra xung đột | UC-10 | ✅ |
| Hợp đồng | UC-11 | ✅ |
| Thanh toán | UC-12 | ✅ |
| Điều phối sự kiện | UC-13 | ✅ |
| Quyết toán | UC-14 | ✅ |
| Dashboard/Báo cáo | UC-02, UC-14 | ⚠️ Cần đối chiếu UC chính thức |
| Thông báo | UC-08, UC-11, UC-12 | ⚠️ Cần đối chiếu UC chính thức |

**Kết luận kiểm tra:**
Các nhóm chức năng chính trong Scope Statement đã được ánh xạ vào Use Case. Tuy nhiên, trước khi xác nhận 100% coverage, BA phải đối chiếu RTM này với Scope Statement bản chính thức và danh sách 14 UC đã được PM phê duyệt.

---

## 6. TRẠNG THÁI TRIỂN KHAI

Sử dụng 3 trạng thái chính:
- 🔴 **Chưa làm:** Yêu cầu đã xác định nhưng chưa bắt đầu triển khai.
- 🟡 **Đang làm:** Đang phân tích, thiết kế hoặc phát triển.
- 🟢 **Đã kiểm thử:** Đã triển khai và có Test Case thực hiện thành công.

*Không sử dụng trạng thái “Đã kiểm thử” chỉ vì code đã hoàn thành. Yêu cầu chỉ chuyển sang trạng thái này khi QA đã thực hiện kiểm thử và có kết quả đạt.*

---

## 7. QUẢN LÝ RTM THEO SPRINT

RTM phải được cập nhật sau mỗi Sprint.

- **Sprint 1:** Tập trung Authentication, User/Role, Customer, Venue, Các yêu cầu nền tảng. Cập nhật: UC, UI, Module Code và Test Case đã hoàn thành.
- **Sprint 2:** Tập trung Đặt sảnh, Kiểm tra lịch, Set Menu, Dịch vụ, Báo giá. RTM phải cập nhật: $\text{BR} \rightarrow \text{UC} \rightarrow \text{UI} \rightarrow \text{Code} \rightarrow \text{Test Case}$ sau khi từng chức năng được phát triển.
- **Sprint 3:** Tập trung Hợp đồng, Thanh toán, Điều phối, Phát sinh, Quyết toán.
- **Sprint 4:** Tập trung Dashboard, Báo cáo, Tích hợp, Kiểm thử hệ thống, UAT, Hoàn thiện RTM.

---

## 8. MẪU CẬP NHẬT RTM SAU MỖI SPRINT

| BR | UC | UI | Code | Test Case | Sprint | Trạng thái | Ghi chú |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **BR-01** | UC-01 | UI-01 | MOD-AUTH | TC-AUTH-01 | Sprint 1 | 🟢 Đã kiểm thử | Pass |
| **BR-03** | UC-04 | UI-04 | MOD-VENUE | TC-VEN-01 | Sprint 2 | 🟡 Đang làm | API hoàn thiện |
| **BR-06** | UC-06 | UI-06 | MOD-MENU | TC-MENU-01 | Sprint 2 | 🟡 Đang làm | Đang test |
| **BR-15** | UC-11 | UI-11 | MOD-CONTRACT | TC-CON-01 | Sprint 3 | 🔴 Chưa làm | — |

---

## 9. QUY TRÌNH CẬP NHẬT RTM

- **Bước 1 – BA cập nhật yêu cầu:** Khi có yêu cầu mới/thay đổi: $\text{BR} \rightarrow \text{UC}$
- **Bước 2 – UI/UX cập nhật:** Designer/Frontend xác định: $\text{UC} \rightarrow \text{UI}$
- **Bước 3 – Developer cập nhật:** Dev Lead xác định: $\text{UC} \rightarrow \text{Module Code}$
- **Bước 4 – QA tạo Test Case:** QA xác định: $\text{BR/UC} \rightarrow \text{Test Case}$
- **Bước 5 – QA cập nhật kết quả:** Sau khi test: Chưa làm $\rightarrow$ Đang làm $\rightarrow$ Đã kiểm thử
- **Bước 6 – PM Review:** PM kiểm tra không có BR nào không có UC, không có UC quan trọng không có Test Case, không có chức năng ngoài Scope, phản ánh đúng tiến độ.

---

## 10. TIÊU CHÍ HOÀN THÀNH RTM

RTM v1.0 được xem là đạt khi:
- [x] 100% BR trong Scope Statement có UC.
- [x] 100% UC có UI tương ứng.
- [x] 100% UC có Module Code tương ứng khi đã triển khai.
- [x] 100% yêu cầu chức năng có Test Case.
- [x] 100% yêu cầu phi chức năng có Test Case phù hợp.
- [x] Mọi yêu cầu đều có trạng thái.
- [x] Không có yêu cầu ngoài Scope chưa được phê duyệt.
- [x] Không có UC quan trọng bị bỏ sót.
- [x] RTM được cập nhật sau mỗi Sprint.
- [x] QA xác nhận Test Case.
- [x] PM review và xác nhận.

---

## 11. CÔNG THỨC KIỂM TRA COVERAGE

### Requirement Coverage
$$\text{Requirement Coverage (\%)} = \frac{\text{Số yêu cầu có UC}}{\text{Tổng số yêu cầu}} \times 100$$
Mục tiêu: **Requirement Coverage = 100%**

### Test Coverage
$$\text{Test Coverage (\%)} = \frac{\text{Số yêu cầu có Test Case}}{\text{Tổng số yêu cầu}} \times 100$$
Mục tiêu: **Test Coverage = 100%**

### Implementation Coverage
$$\text{Implementation Coverage (\%)} = \frac{\text{Số yêu cầu đã triển khai}}{\text{Tổng số yêu cầu}} \times 100$$
Chỉ số này được cập nhật theo tiến độ Sprint và không nhất thiết phải đạt 100% trước khi kết thúc các Sprint phát triển.

---

## 12. KẾT LUẬN

RTM là tài liệu kiểm soát xuyên suốt vòng đời yêu cầu của EVManager.
**Chuỗi truy vết chính:**
$$\text{Scope Statement} \rightarrow \text{BR} \rightarrow \text{UC} \rightarrow \text{UI} \rightarrow \text{Module Code} \rightarrow \text{Test Case} \rightarrow \text{Test Result}$$
RTM phải được cập nhật sau mỗi Sprint và được PM, BA, Dev Lead và QA kiểm tra định kỳ.
Mục tiêu cuối cùng là đảm bảo: Không có yêu cầu nào trong Scope Statement bị bỏ sót và mọi yêu cầu đều có bằng chứng triển khai và kiểm thử tương ứng.
