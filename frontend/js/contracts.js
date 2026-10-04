document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const contractModal = document.getElementById('contractModal');
    const contractForm = document.getElementById('contractForm');
    
    // Steps
    const step1 = document.getElementById('contract-step-1');
    const step2 = document.getElementById('contract-step-2');
    const step3 = document.getElementById('contract-step-3');
    const ind1 = document.getElementById('step1-indicator');
    const ind2 = document.getElementById('step2-indicator');
    const ind3 = document.getElementById('step3-indicator');

    // Inputs
    const selectCustomer = document.getElementById('contractCustomer');
    const selectEvent = document.getElementById('contractEvent');
    const inputDate = document.getElementById('contractDate');
    const selectMenu = document.getElementById('contractMenu');
    const servicesChecklist = document.getElementById('contractServicesChecklist');

    // Previews
    const previewMenuPrice = document.getElementById('previewMenuPrice');
    const previewServicesPrice = document.getElementById('previewServicesPrice');
    const previewTotalAmount = document.getElementById('previewTotalAmount');
    const previewDepositAmount = document.getElementById('previewDepositAmount');

    // Data Cache
    let currentContracts = [];
    let customersList = [];
    let eventsList = [];
    let menusList = [];
    let servicesList = [];
    let selectedMenuPrice = 0;
    let selectedServicesPrice = 0;

    // Load data for dropdowns
    async function loadWizardData() {
        try {
            const [custRes, eventRes, menuRes, srvRes] = await Promise.all([
                fetchAPI('/api/v1/customers?size=100').then(r => r.json()),
                fetchAPI('/api/v1/events?size=100').then(r => r.json()),
                fetchAPI('/api/v1/menus?size=100').then(r => r.json()),
                fetchAPI('/api/v1/services?size=100').then(r => r.json())
            ]);
            
            customersList = custRes.content || [];
            eventsList = eventRes.content || [];
            menusList = menuRes.content || [];
            servicesList = srvRes.content || [];

            // Populate Customers
            selectCustomer.innerHTML = '<option value="">-- Chọn khách hàng --</option>' + 
                customersList.map(c => `<option value="${c.customerId}">${c.fullName} - ${c.phone}</option>`).join('');

            // Populate Events (Only events without a contract, but for now just all)
            selectEvent.innerHTML = '<option value="">-- Chọn sự kiện --</option>' + 
                eventsList.map(e => `<option value="${e.eventId}">${e.eventName} (${new Date(e.startAt).toLocaleDateString('vi-VN')})</option>`).join('');

            // Populate Menus
            selectMenu.innerHTML = '<option value="">-- Không kèm thực đơn --</option>' + 
                menusList.map(m => `<option value="${m.menuId}" data-price="${m.price}">${m.menuName} - ${new Intl.NumberFormat('vi-VN').format(m.price)}đ</option>`).join('');

            // Populate Services Checklist
            servicesChecklist.innerHTML = servicesList.map(s => `
                <div style="display:flex; align-items:center; margin-bottom:8px; gap: 8px;">
                    <input type="checkbox" id="chk_srv_${s.serviceId}" value="${s.serviceId}" data-price="${s.unitPrice}" class="service-checkbox" style="width:auto; margin:0;"/>
                    <label for="chk_srv_${s.serviceId}" style="margin:0; flex:1; cursor:pointer;">
                        ${s.serviceName} <span style="color:#d9534f; font-size:0.9em;">(+${new Intl.NumberFormat('vi-VN').format(s.unitPrice)}đ)</span>
                    </label>
                </div>
            `).join('');

            // Add listeners to recalculate when step 2 changes
            selectMenu.addEventListener('change', calculatePreview);
            document.querySelectorAll('.service-checkbox').forEach(chk => {
                chk.addEventListener('change', calculatePreview);
            });

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu wizard:', error);
            showError('Không thể tải dữ liệu Khách hàng/Sự kiện/Thực đơn.');
        }
    }

    // Wizard Navigation
    function showStep(stepNum) {
        step1.style.display = stepNum === 1 ? 'block' : 'none';
        step2.style.display = stepNum === 2 ? 'block' : 'none';
        step3.style.display = stepNum === 3 ? 'block' : 'none';

        ind1.style.color = stepNum >= 1 ? 'var(--primary-color)' : '#94a3b8';
        ind1.style.fontWeight = stepNum === 1 ? 'bold' : 'normal';
        
        ind2.style.color = stepNum >= 2 ? 'var(--primary-color)' : '#94a3b8';
        ind2.style.fontWeight = stepNum === 2 ? 'bold' : 'normal';
        
        ind3.style.color = stepNum >= 3 ? 'var(--primary-color)' : '#94a3b8';
        ind3.style.fontWeight = stepNum === 3 ? 'bold' : 'normal';
    }

    document.getElementById('btnNextToStep2')?.addEventListener('click', () => {
        if (!selectCustomer.value || !selectEvent.value || !inputDate.value) {
            showError('Vui lòng nhập đầy đủ thông tin Khách hàng, Sự kiện và Ngày ký!');
            return;
        }
        showStep(2);
    });

    document.getElementById('btnBackToStep1')?.addEventListener('click', () => showStep(1));
    
    document.getElementById('btnNextToStep3')?.addEventListener('click', () => {
        calculatePreview();
        showStep(3);
    });

    document.getElementById('btnBackToStep2')?.addEventListener('click', () => showStep(2));

    // Calculation
    function calculatePreview() {
        const selectedMenuOption = selectMenu.options[selectMenu.selectedIndex];
        selectedMenuPrice = selectedMenuOption && selectedMenuOption.value ? parseFloat(selectedMenuOption.getAttribute('data-price')) : 0;

        selectedServicesPrice = 0;
        document.querySelectorAll('.service-checkbox:checked').forEach(chk => {
            selectedServicesPrice += parseFloat(chk.getAttribute('data-price'));
        });

        const total = selectedMenuPrice + selectedServicesPrice;
        const deposit = total * 0.3;

        previewMenuPrice.textContent = new Intl.NumberFormat('vi-VN').format(selectedMenuPrice) + ' VNĐ';
        previewServicesPrice.textContent = new Intl.NumberFormat('vi-VN').format(selectedServicesPrice) + ' VNĐ';
        previewTotalAmount.textContent = new Intl.NumberFormat('vi-VN').format(total) + ' VNĐ';
        previewDepositAmount.textContent = new Intl.NumberFormat('vi-VN').format(deposit) + ' VNĐ';
    }

    // Modal Control
    document.getElementById('btnOpenAddContractModal')?.addEventListener('click', async () => {
        contractForm.reset();
        await loadWizardData();
        showStep(1);
        contractModal.classList.add('open');
    });

    function closeContractModal() {
        contractModal.classList.remove('open');
    }
    document.getElementById('btnCloseContractModal')?.addEventListener('click', closeContractModal);
    document.getElementById('contractModalBackdrop')?.addEventListener('click', closeContractModal);

    // Submit Contract
    contractForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const customerId = selectCustomer.value;
        const eventId = selectEvent.value;
        const contractDate = inputDate.value;
        const menuId = selectMenu.value;
        
        const serviceIds = [];
        document.querySelectorAll('.service-checkbox:checked').forEach(chk => {
            serviceIds.push(chk.value);
        });

        const payload = {
            customerId: parseInt(customerId),
            eventId: parseInt(eventId),
            contractDate: contractDate,
            menuId: menuId ? parseInt(menuId) : null,
            serviceIds: serviceIds.map(id => parseInt(id))
        };

        try {
            const response = await fetchAPI('/api/v1/contracts', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Lỗi server');
            }
            showSuccess('Tạo hợp đồng thành công!');
            closeContractModal();
            loadContracts();
        } catch (error) {
            console.error('Lỗi tạo HĐ:', error);
            showError(error.message || 'Không thể tạo hợp đồng. Có thể sự kiện này đã được gán hợp đồng!');
        }
    });

    // Load Contracts List
    async function loadContracts() {
        const tbody = document.getElementById('contractsTableBody');
        if (!tbody) return;

        try {
            const res = await fetchAPI('/api/v1/contracts?size=100').then(r => r.json());
            currentContracts = res.content || [];
            
            if (currentContracts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 20px;">Chưa có hợp đồng nào.</td></tr>';
                return;
            }

            tbody.innerHTML = currentContracts.map(c => {
                let statusBadge = 'default';
                if (c.status === 'CONFIRMED' || c.status === 'COMPLETED') statusBadge = 'active';
                if (c.status === 'CANCELLED') statusBadge = 'inactive';
                if (c.status === 'DRAFT') statusBadge = 'warning';

                return `
                    <tr>
                        <td><strong>${c.contractCode}</strong></td>
                        <td>${c.customerName}</td>
                        <td>${c.eventName}</td>
                        <td style="color:#d9534f; font-weight:bold;">${new Intl.NumberFormat('vi-VN').format(c.totalAmount)}đ</td>
                        <td><span class="summary-pill ${statusBadge}">${c.status}</span></td>
                        <td class="text-right">
                            <div class="btn-action-group">
                                ${c.status === 'DRAFT' ? `<button class="btn-action" onclick="window.approveContract(${c.contractId})" title="Duyệt">✅ Duyệt</button>` : ''}
                                ${c.status !== 'CANCELLED' && c.status !== 'COMPLETED' ? `<button class="btn-action btn-action--danger" onclick="window.cancelContract(${c.contractId})" title="Hủy">❌ Hủy</button>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            console.error('Lỗi load danh sách HĐ:', error);
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu.</td></tr>';
        }
    }

    // Global Actions for Contracts
    window.approveContract = async function(id) {
        if (!await showConfirm('Xác nhận duyệt hợp đồng này?', 'Hợp đồng sẽ chuyển sang trạng thái CONFIRMED.')) return;
        try {
            const response = await fetchAPI(`/api/v1/contracts/${id}/actions/approve`, { method: 'POST' });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Lỗi server');
            }
            showSuccess('Đã duyệt hợp đồng!');
            loadContracts();
        } catch (error) {
            showError(error.message || 'Lỗi khi duyệt hợp đồng.');
        }
    };

    window.cancelContract = async function(id) {
        if (!await showConfirm('Xác nhận Hủy hợp đồng này?', 'Không thể khôi phục sau khi hủy!', 'warning', 'Đồng ý Hủy')) return;
        try {
            const response = await fetchAPI(`/api/v1/contracts/${id}/actions/cancel`, { method: 'POST' });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Lỗi server');
            }
            showSuccess('Đã hủy hợp đồng!');
            loadContracts();
        } catch (error) {
            showError(error.message || 'Lỗi khi hủy hợp đồng.');
        }
    };

    // Auto load on tab switch
    const contractTabBtn = document.querySelector('[data-tab="tab-contracts"]');
    if (contractTabBtn) {
        contractTabBtn.addEventListener('click', loadContracts);
    }
});
