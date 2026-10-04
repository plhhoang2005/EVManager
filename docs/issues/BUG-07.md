# [BUG-07] Thiếu ràng buộc Validate dữ liệu đầu vào (SĐT, Email, Sức chứa) khi thêm mới khách hàng và đặt sảnh

**Labels:** `type: bug`, `priority: medium`, `frontend`  
**Assignee:** `nhanvo134679`  
**Jira Key:** `EV-159`

## 1. Mô tả lỗi
- Tại modal "Thêm khách hàng mới" (`#customerModal`), người dùng có thể nhập số điện thoại sai định dạng (ví dụ: chữ cái, hoặc chỉ có 3 chữ số) hoặc email sai cú pháp nhưng form vẫn cho phép submit.
- Tại modal "Thêm sự kiện mới" (`#eventModal`), người dùng có thể nhập số khách/số bàn vượt quá sức chứa tối đa của sảnh (ví dụ: Sảnh Ngọc Bích tối đa 150 khách nhưng nhập 500 khách) mà hệ thống không cảnh báo hay ngăn chặn.

## 2. Quy tắc nghiệp vụ (BA Requirements)
- **Use Case UC-03:** Số điện thoại khách hàng phải là số điện thoại hợp lệ tại Việt Nam (10 chữ số, bắt đầu bằng `03, 05, 07, 08, 09`).
- **Use Case UC-04:** Số lượng khách/bàn không được vượt quá `max_capacity` của sảnh được chọn.

## 3. Giải pháp khắc phục
1. Thêm biểu thức chính quy (Regex) kiểm tra số điện thoại: `^(0[3|5|7|8|9])[0-9]{8}$`.
2. Kiểm tra định dạng Email hợp lệ RFC.
3. Khi chọn Sảnh trong dropdown, hiển thị sức chứa tối đa và tự động giới hạn `input max` của trường số bàn / số khách.
4. Hiển thị thông báo lỗi tiếng Việt màu đỏ thân thiện ngay dưới trường nhập liệu bị sai.
