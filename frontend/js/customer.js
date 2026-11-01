/**
 * customer.js - Cổng Khách Hàng VIP LV34 Events
 * Tra cứu Hợp đồng, Lịch sử Thanh toán VietQR, Thực đơn & Dịch vụ tiệc
 */

document.addEventListener('DOMContentLoaded', async () => {
    setupCustomerTabs();
    await loadCustomerContracts();
    await loadCustomerPaymentHistory();
    await loadCustomerMenu();
    await loadCustomerServices();
});

// 1. Chuyển đổi Tabs trên Cổng Khách hàng
function setupCustomerTabs() {
    const tabLinks = document.querySelectorAll('[data-cust-tab]');
    const tabPanes = document.querySelectorAll('.cust-tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-cust-tab');

            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            tabPanes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.style.display = 'block';
                    pane.classList.add('active');
                } else {
                    pane.style.display = 'none';
                    pane.classList.remove('active');
                }
            });
        });
    });
}

// 2. Tải thông tin Hợp đồng & Cập nhật Stepper Động
async function loadCustomerContracts() {
    const container = document.getElementById('customerContractContainer');
    if (!container) return;

    try {
        const response = await fetchAPI('/api/v1/contracts?page=0&size=5');
        if (!response.ok) {
            container.innerHTML = `<p style="color:#ef4444;text-align:center;">Không thể tải thông tin hợp đồng của bạn.</p>`;
            return;
        }

        const data = await response.json();
        const contracts = data.content || data || [];

        if (contracts.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:3rem 1rem;background:#fff;border-radius:12px;border:1px dashed #cbd5e1;">
                    <span style="font-size:3rem;">📝</span>
                    <h3 style="margin:1rem 0 0.5rem 0;color:#0f172a;">Quý khách chưa có hợp đồng nào</h3>
                    <p style="color:#64748b;margin:0 0 1.5rem 0;">Hãy trải nghiệm tính năng tính dự toán tiệc cưới tự động để nhận báo giá ưu đãi!</p>
                    <a href="calculator.html" style="background:#0284c7;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;">✨ Tính dự toán ngay</a>
                </div>
            `;
            return;
        }

        // Chọn hợp đồng mẫu đã seed hoặc hợp đồng đầu tiên
        const primaryContract = contracts.find(c => c.contractCode === 'HD-2026-VIP01') || contracts[0];
        const contractCode = primaryContract.contractCode || 'HD-2026-VIP01';
        const totalAmount = Number(primaryContract.totalAmount || 150000000);
        const depositAmount = Number(primaryContract.depositAmount || 45000000);
        const remainingAmount = Math.max(0, totalAmount - depositAmount);
        const status = (primaryContract.status || 'CONFIRMED').toUpperCase();

        // Cập nhật các thẻ Metric trên đầu trang
        const depositPercent = totalAmount > 0 ? Math.round((depositAmount / totalAmount) * 100) : 0;
        const depositPaidEl = document.getElementById('custDepositPaid');
        if (depositPaidEl) depositPaidEl.textContent = `Đã cọc ${formatVND(depositAmount)} (${depositPercent}%)`;

        const remainingAmountEl = document.getElementById('custRemainingAmount');
        if (remainingAmountEl) remainingAmountEl.textContent = formatVND(remainingAmount);

        // Cập nhật Stepper động theo status hợp đồng
        updateCustomerStepper(status);

        // Tạo link VietQR động chuẩn NAPAS 24/7 (Vietcombank)
        const bankName = 'Vietcombank';
        const bankAcc = '9988776655';
        const accHolder = 'LV34 CONVENTION CENTER';
        const qrAmount = depositAmount > 0 ? depositAmount : Math.round(totalAmount * 0.3);
        const qrMemo = `${contractCode} COC`;
        const vietQrUrl = `https://img.vietqr.io/image/vietcombank-${bankAcc}-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(qrMemo)}&accountName=${encodeURIComponent(accHolder)}`;

        container.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:2rem;border:1px solid #e2e8f0;">
                <div>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;flex-wrap:wrap;">
                        <span style="background:#087f82;color:#fff;padding:4px 12px;border-radius:6px;font-size:0.85rem;font-weight:700;">HỢP ĐỒNG #${contractCode}</span>
                        <span style="background:#ecfdf5;color:#059669;padding:4px 12px;border-radius:9999px;font-size:0.8rem;font-weight:700;border:1px solid #a7f3d0;">
                            ✓ ĐÃ XÁC NHẬN ĐẶT CỌC (${depositPercent}%)
                        </span>
                    </div>

                    <h2 style="font-size:1.45rem;color:#0f172a;margin:0 0 1rem 0;">🎉 Lễ Thành Hôn - Tuấn Kiệt & Thu Thảo</h2>
                    
                    <div style="background:#f8fafc;border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;line-height:1.9;font-size:0.95rem;color:#334155;border:1px solid #e2e8f0;">
                        <div>🏛️ <strong>Sảnh tiệc:</strong> Sảnh Diamond Luxury (Tầng 3 - View Thành phố)</div>
                        <div>📅 <strong>Thời gian tổ chức:</strong> 15/11/2026 (Ca tối: 17:30 - 21:30)</div>
                        <div>👥 <strong>Quy mô tiệc:</strong> 25 bàn chính thức (Kèm 3 bàn dự phòng linh hoạt)</div>
                        <div>🍽️ <strong>Thực đơn ẩm thực:</strong> Set Hoàng Gia 8 món Hải sản thượng hạng</div>
                        <div>🍷 <strong>Gói dịch vụ chọn lọc:</strong> Màn hình LED P3, MC nghi thức, 3 ca sĩ acoustic & tháp sâm panh</div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
                        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:1rem;">
                            <span style="font-size:0.85rem;color:#0369a1;display:block;">Tổng giá trị hợp đồng:</span>
                            <strong style="font-size:1.3rem;color:#0c4a6e;">${formatVND(totalAmount)}</strong>
                        </div>
                        <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:8px;padding:1rem;">
                            <span style="font-size:0.85rem;color:#059669;display:block;">Đã thanh toán (Tiền cọc):</span>
                            <strong style="font-size:1.3rem;color:#047857;">${formatVND(depositAmount)}</strong>
                        </div>
                    </div>

                    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                        <button onclick="window.print()" style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:8px 16px;border-radius:8px;font-weight:600;font-size:0.85rem;cursor:pointer;">
                            🖨️ In Hợp Đồng
                        </button>
                        <a href="calculator.html" style="background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;padding:8px 16px;border-radius:8px;font-weight:600;font-size:0.85rem;text-decoration:none;">
                            ✨ Xem lại Bảng dự toán AI
                        </a>
                    </div>
                </div>

                <!-- Cột VietQR Thanh toán nhanh -->
                <div style="border-left:1px solid #f1f5f9;padding-left:1rem;text-align:center;">
                    <h3 style="margin:0 0 0.25rem 0;font-size:1.15rem;color:#0f172a;">📱 Quét Mã VietQR 24/7</h3>
                    <p style="font-size:0.8rem;color:#64748b;margin:0 0 1rem 0;">Tích hợp chuyển nhanh Napas 247 mọi ngân hàng</p>
                    
                    <div style="background:#f8fafc;padding:10px;border-radius:10px;border:1px solid #e2e8f0;display:inline-block;margin-bottom:1rem;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                        <img id="customerVietQrImg" src="${vietQrUrl}" alt="Mã VietQR Thanh Toán" style="width:230px;height:auto;border-radius:6px;display:block;margin:0 auto;" />
                    </div>

                    <div style="font-size:0.85rem;color:#334155;text-align:left;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;line-height:1.7;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                            <span>🏦 Ngân hàng: <strong>${bankName}</strong></span>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                            <span>🔢 STK: <strong>${bankAcc}</strong></span>
                            <button class="btn-copy-quick" onclick="copyToClipboard('${bankAcc}', 'Số tài khoản')">Sao chép</button>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <span>💬 Nội dung: <strong>${qrMemo}</strong></span>
                            <button class="btn-copy-quick" onclick="copyToClipboard('${qrMemo}', 'Cú pháp chuyển khoản')">Sao chép</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    } catch (err) {
        console.error('Error loading contracts for customer:', err);
        container.innerHTML = `<p style="color:#ef4444;text-align:center;">Lỗi kết nối khi tải dữ liệu hợp đồng.</p>`;
    }
}

// 3. Cập nhật thanh tiến trình tiệc (Stepper)
function updateCustomerStepper(status) {
    const fill = document.getElementById('stepperFill');
    const badge = document.getElementById('custContractStatusBadge');
    const s1 = document.getElementById('step1');
    const s2 = document.getElementById('step2');
    const s3 = document.getElementById('step3');
    const s4 = document.getElementById('step4');

    if (!fill || !s1 || !s2 || !s3 || !s4) return;

    // Reset classes
    [s1, s2, s3, s4].forEach(s => {
        s.className = 'stepper-step';
    });

    if (status === 'DRAFT') {
        fill.style.width = '20%';
        s1.classList.add('active');
        if (badge) {
            badge.textContent = 'CHỜ KÝ HỢP ĐỒNG & CỌC';
            badge.style.background = '#fffbeb';
            badge.style.color = '#d97706';
            badge.style.borderColor = '#fde68a';
        }
    } else if (status === 'CONFIRMED') {
        fill.style.width = '50%';
        s1.classList.add('completed');
        s1.querySelector('.stepper-circle').textContent = '✓';
        s2.classList.add('active');
        if (badge) {
            badge.textContent = 'ĐÃ ĐẶT CỌC & DUYỆT MENU';
            badge.style.background = '#ecfdf5';
            badge.style.color = '#059669';
            badge.style.borderColor = '#a7f3d0';
        }
    } else if (status === 'IN_PROGRESS' || status === 'PREPARING') {
        fill.style.width = '75%';
        s1.classList.add('completed');
        s1.querySelector('.stepper-circle').textContent = '✓';
        s2.classList.add('completed');
        s2.querySelector('.stepper-circle').textContent = '✓';
        s3.classList.add('active');
        if (badge) {
            badge.textContent = 'SỰ KIỆN ĐANG DIỄN RA';
            badge.style.background = '#eff6ff';
            badge.style.color = '#2563eb';
            badge.style.borderColor = '#bfdbfe';
        }
    } else if (status === 'COMPLETED') {
        fill.style.width = '100%';
        s1.classList.add('completed');
        s1.querySelector('.stepper-circle').textContent = '✓';
        s2.classList.add('completed');
        s2.querySelector('.stepper-circle').textContent = '✓';
        s3.classList.add('completed');
        s3.querySelector('.stepper-circle').textContent = '✓';
        s4.classList.add('completed');
        s4.querySelector('.stepper-circle').textContent = '✓';
        if (badge) {
            badge.textContent = 'ĐÃ QUYẾT TOÁN HOÀN TẤT';
            badge.style.background = '#ecfdf5';
            badge.style.color = '#059669';
            badge.style.borderColor = '#a7f3d0';
        }
    }
}

// 4. Lịch sử giao dịch thanh toán
async function loadCustomerPaymentHistory() {
    const container = document.getElementById('customerPaymentHistoryContainer');
    if (!container) return;

    try {
        const response = await fetchAPI('/api/v1/payments?page=0&size=10');
        if (!response.ok) {
            container.innerHTML = `<p style="color:#64748b;text-align:center;">Chưa có giao dịch thanh toán nào được ghi nhận.</p>`;
            return;
        }

        const data = await response.json();
        const payments = data.content || data || [];

        if (payments.length === 0) {
            container.innerHTML = `<p style="color:#64748b;text-align:center;padding:1.5rem;">Quý khách chưa phát sinh giao dịch thanh toán nào.</p>`;
            return;
        }

        let rowsHtml = payments.map(p => {
            const typeLabel = p.paymentType === 'DEPOSIT' ? 'Đặt cọc tiệc (30%)' :
                p.paymentType === 'FINAL' ? 'Quyết toán cuối cùng' : 'Thanh toán đợt 2';
            const methodLabel = p.paymentMethod === 'VIETQR' ? '📱 VietQR (Napas 247)' :
                p.paymentMethod === 'BANK_TRANSFER' ? '🏦 Chuyển khoản ngân hàng' : '💵 Tiền mặt';
            const dateStr = p.paymentDate ? p.paymentDate.substring(0, 10) : '2026-11-01';

            return `
                <tr>
                    <td style="font-weight:700;color:#087f82;">${p.transactionRef || ('TXN-' + p.id)}</td>
                    <td>${typeLabel}</td>
                    <td style="font-weight:700;color:#047857;">${formatVND(p.amount)}</td>
                    <td>${methodLabel}</td>
                    <td>${dateStr}</td>
                    <td>
                        <span style="background:#ecfdf5;color:#059669;padding:3px 10px;border-radius:9999px;font-size:0.75rem;font-weight:700;">
                            ✓ Thành công
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <table class="admin-table" style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:1px solid #e2e8f0;text-align:left;font-size:0.85rem;color:#64748b;">
                        <th style="padding:10px 12px;">Mã Giao Dịch</th>
                        <th style="padding:10px 12px;">Loại Thanh Toán</th>
                        <th style="padding:10px 12px;">Số Tiền</th>
                        <th style="padding:10px 12px;">Phương Thức</th>
                        <th style="padding:10px 12px;">Ngày Ghi Nhận</th>
                        <th style="padding:10px 12px;">Trạng Thái</th>
                    </tr>
                </thead>
                <tbody style="font-size:0.9rem;color:#334155;">
                    ${rowsHtml}
                </tbody>
            </table>
        `;

    } catch (e) {
        console.error('Error loading payment history for customer:', e);
        container.innerHTML = `<p style="color:#64748b;text-align:center;">Không thể tải lịch sử thanh toán.</p>`;
    }
}

// 5. Tải danh sách món ăn trong Menu tiệc
async function loadCustomerMenu() {
    const grid = document.getElementById('customerMenuDishesGrid');
    if (!grid) return;

    try {
        const res = await fetchAPI('/api/v1/dishes?size=20');
        let dishes = [];
        if (res.ok) {
            const data = await res.json();
            dishes = data.content || data || [];
        }

        // Món mẫu chuẩn phong cách yến tiệc
        const defaultDishes = [
            { dishName: 'Khai vị 3 món thượng hạng (Chả giò cua, Gỏi ngó sen tôm thịt, Nem nướng)', category: 'APPETIZER', price: 450000, icon: '🥗' },
            { dishName: 'Súp Bào Ngư Hải Sâm Thượng Hạng', category: 'APPETIZER', price: 650000, icon: '🍲' },
            { dishName: 'Tôm Càng Xanh Hấp Nước Dừa Xiêm', category: 'MAIN', price: 950000, icon: '🦐' },
            { dishName: 'Cá Chẽm Hấp Hồng Kông Sốt Xì Dầu', category: 'MAIN', price: 800000, icon: '🐟' },
            { dishName: 'Bò Úc Hầm Tiêu Xanh Kèm Bánh Mì', category: 'MAIN', price: 850000, icon: '🥩' },
            { dishName: 'Cơm Chiên Hải Sản Hạt Sen Cung Đình', category: 'MAIN', price: 500000, icon: '🍚' },
            { dishName: 'Lẩu Nấm Hải Sản Thượng Canh', category: 'MAIN', price: 750000, icon: '🍲' },
            { dishName: 'Tráng miệng: Chè Yến Hạt Sen & Bánh Su Kem Pháp', category: 'DESSERT', price: 350000, icon: '🍮' }
        ];

        const listToDisplay = dishes.length > 0 ? dishes.slice(0, 8) : defaultDishes;

        grid.innerHTML = listToDisplay.map((d, index) => {
            const catName = d.category === 'APPETIZER' ? 'Khai vị' :
                d.category === 'DESSERT' ? 'Tráng miệng' : 'Món chính';
            const catColor = d.category === 'APPETIZER' ? '#0284c7' :
                d.category === 'DESSERT' ? '#ec4899' : '#059669';
            const icon = d.icon || (d.category === 'APPETIZER' ? '🥗' : d.category === 'DESSERT' ? '🍮' : '🍲');

            return `
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:1rem;display:flex;gap:12px;align-items:flex-start;">
                    <div style="background:#fff;border-radius:8px;padding:8px;font-size:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
                        ${icon}
                    </div>
                    <div style="flex:1;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-size:0.75rem;font-weight:700;color:${catColor};text-transform:uppercase;">
                                Món ${index + 1} • ${catName}
                            </span>
                        </div>
                        <h4 style="margin:0 0 4px 0;font-size:0.95rem;color:#0f172a;font-weight:700;">${d.dishName}</h4>
                        <span style="font-size:0.85rem;color:#64748b;font-weight:600;">${formatVND(d.price)} / bàn</span>
                    </div>
                </div>
            `;
        }).join('');

    } catch (e) {
        console.error('Error loading customer menu:', e);
        grid.innerHTML = `<p style="color:#64748b;">Không thể tải thực đơn.</p>`;
    }
}

// 6. Tải gói dịch vụ sự kiện
async function loadCustomerServices() {
    const grid = document.getElementById('customerServicesGrid');
    if (!grid) return;

    try {
        const res = await fetchAPI('/api/v1/services?size=20');
        let services = [];
        if (res.ok) {
            const data = await res.json();
            services = data.content || data || [];
        }

        const defaultServices = [
            { serviceName: 'Màn Hình LED Sân Khấu P3 Siêu Nét', description: 'Trình chiếu clip phóng sự cưới, hình ảnh kỷ niệm sắc nét rực rỡ.', icon: '📺' },
            { serviceName: 'MC Nghi Thức & Hoạt Náo Sự Kiện Chuyên Nghiệp', description: 'Dẫn chương trình trang trọng, tạo không khí ấm cúng cho hôn lễ.', icon: '🎤' },
            { serviceName: 'Ban Nhạc Hòa Tấu Acoustic Đón Khách', description: 'Piano & Violin hòa tấu lãng mạn đón khách quý trước giờ làm lễ.', icon: '🎻' },
            { serviceName: 'Tháp Rượu Sâm Panh & Pháo Sáng Kim Tuyến', description: 'Khoảnh khắc cắt bánh, rót rượu mở đầu tiệc mừng ngập tràn ánh sáng.', icon: '🍾' }
        ];

        const listToDisplay = services.length > 0 ? services.slice(0, 4) : defaultServices;

        grid.innerHTML = listToDisplay.map(s => {
            const icon = s.icon || '✨';
            return `
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:1.25rem;display:flex;gap:12px;align-items:flex-start;">
                    <div style="background:#fff;border-radius:8px;padding:10px;font-size:1.6rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
                        ${icon}
                    </div>
                    <div style="flex:1;">
                        <h4 style="margin:0 0 6px 0;font-size:1rem;color:#0f172a;font-weight:700;">${s.serviceName}</h4>
                        <p style="margin:0;color:#64748b;font-size:0.85rem;line-height:1.5;">${s.description || 'Gói dịch vụ cao cấp phục vụ tiệc cưới.'}</p>
                        <div style="margin-top:8px;">
                            <span style="background:#ecfdf5;color:#059669;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">
                                ✓ Đã bao gồm
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (e) {
        console.error('Error loading customer services:', e);
        grid.innerHTML = `<p style="color:#64748b;">Không thể tải gói dịch vụ.</p>`;
    }
}

function formatVND(amount) {
    if (!amount) return '0 đ';
    return Number(amount).toLocaleString('vi-VN') + ' đ';
}