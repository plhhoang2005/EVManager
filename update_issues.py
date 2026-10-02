import os
import re

for filename in os.listdir('audits'):
    if not filename.endswith('.md'):
        continue
    filepath = os.path.join('audits', filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Tech stack fixes
    content = content.replace('JPA / Hibernate.$transaction()', '@Transactional (Spring)')
    content = content.replace('npx JPA / Hibernate migrate deploy', 'mvn flyway:migrate')
    content = content.replace('npx JPA / Hibernate db seed', 'Java/Spring Data seeding (hoặc Flyway callbacks)')
    content = content.replace('npx JPA / Hibernate generate', 'mvn clean install')
    content = content.replace('schema.JPA / Hibernate', 'Flyway migration scripts')
    content = content.replace('JPA / Hibernate ORM', 'Spring Data JPA / Hibernate')
    content = content.replace('JPA / Hibernate', 'Spring Data JPA')
    
    # 2. Specific Issues
    
    # BE-16
    if "BE-16:" in content:
        content = content.replace('đơn giá bàn trọn gói', 'đơn giá tính trên 1 bàn (Table Price)')
        
    # BE-18
    if "BE-18:" in content:
        content = re.sub(
            r'- \[ \] Viết DTO `CreateContractDto` nhận:.*', 
            '- [ ] Viết DTO `CreateContractDto` nhận: customerId, venueId, eventDate, shift, menus: [{menuId, tableCount}], serviceIds, discountPercent.', 
            content
        )
        content = re.sub(
            r'- \[ \] Tự động tính toán chi phí: \$Tổng = \(Số bàn \\times Giá bàn\) \+ Tổng tiền dịch vụ - Tiền giảm giá \+ VAT\$.', 
            '- [ ] Tự động tính toán chi phí (dùng BigDecimal): Menu Amount = Σ(Menu Price × Table Count); Service Amount = Σ(Service Price × Qty); SubTotal = Menu Amount + Service Amount; Discount = SubTotal × Discount%; Taxable = SubTotal - Discount; VAT = Taxable × VAT%; Total = Taxable + VAT; Deposit = Total × 30%.\n- [ ] Tính toán bàn sơ cua: Bàn sơ cua = FLOOR(Tổng số bàn đặt / 10). Bàn sơ cua tuyệt đối không tính tiền lúc lập báo giá/hợp đồng.\n- [ ] Phân luồng phê duyệt: Nếu discountPercent > 10%, trạng thái khởi tạo phải là PENDING_APPROVAL.', 
            content
        )
        
    # BE-19
    if "BE-19:" in content:
        content = content.replace(
            '`DRAFT` (Bản thảo) -> `PENDING_DEPOSIT` (Chờ cọc) -> `CONFIRMED`',
            '`DRAFT` (Bản thảo) -> `PENDING_APPROVAL` (Chờ duyệt chiết khấu >10%) -> `PENDING_DEPOSIT` (Chờ cọc) -> `CONFIRMED`'
        )
        content = content.replace('khi số tiền cọc $\ge 30\%$', 'khi số tiền cọc (depositAmount) đạt đúng 30% tổng giá trị (Total Amount)')
        
    # BE-20
    if "BE-20:" in content:
        if "tự động cập nhật số tiền đã trả và công nợ còn lại trong bảng contracts" in content:
            content = content.replace(
                "tự động cập nhật số tiền đã trả và công nợ còn lại trong bảng contracts.",
                "tự động cập nhật số tiền đã trả và công nợ còn lại trong bảng contracts. Lưu ý: Phải phân biệt rõ ràng contract.depositAmount (số tiền cọc cần đóng) với payment records (các giao dịch thực tế)."
            )

    # BE-28
    if "BE-28:" in content:
        content = content.replace('Flyway migration scripts cập nhật', 'Flyway migration cập nhật')
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
