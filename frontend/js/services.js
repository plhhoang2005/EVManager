/**
 * Module Dịch vụ (services.js)
 * Xử lý tương tác CRUD trên trang Quản lý Dịch vụ
 */

document.addEventListener('DOMContentLoaded', function() {
    const servicesTableBody = document.getElementById('servicesTableBody');
    const tabServicesBtn = document.querySelector('button[data-tab="tab-services"]');
    
    // Service Modal Elements
    const serviceModal = document.getElementById('serviceModal');
    const serviceForm = document.getElementById('serviceForm');

    // State
    let allServices = [];

    // --- FETCH DATA ---
    async function loadServices() {
        if (!servicesTableBody) return;
        servicesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu dịch vụ...</td></tr>';
        
        try {
            const response = await fetchAPI('/api/v1/services?size=100');
            if (response.ok) {
                const data = await response.json();
                allServices = data.content || data;
                renderServices(allServices);
            } else {
                servicesTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu dịch vụ</td></tr>';
            }
        } catch (error) {
            console.error('Lỗi khi tải services:', error);
            servicesTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Không thể kết nối đến máy chủ</td></tr>';
        }
    }

    // --- RENDER SERVICES ---
    function renderServices(services) {
        if (!servicesTableBody) return;
        if (!services || services.length === 0) {
            servicesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có dịch vụ nào.</td></tr>';
            return;
        }

        servicesTableBody.innerHTML = services.map(srv => {
            const statusBadgeClass = srv.status === 'ACTIVE' ? 'confirmed' : 'cancelled';
            const statusText = srv.status === 'ACTIVE' ? 'Đang phục vụ' : 'Ngừng phục vụ';
            const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(srv.unitPrice);
            
            return `
                <tr>
                    <td><strong>#${srv.serviceId}</strong></td>
                    <td>
                        <strong style="color:var(--primary-color)">${srv.serviceName}</strong>
                    </td>
                    <td>
                        <div style="font-size:13px; color:#555; max-width: 250px;">${srv.description || ''}</div>
                    </td>
                    <td style="color:#d9534f; font-weight:bold;">${priceFormatted}</td>
                    <td><span class="summary-pill ${statusBadgeClass}">${statusText}</span></td>
                    <td class="text-right">
                        <div class="btn-action-group">
                            <button class="btn-action" onclick="window.openEditService(${srv.serviceId})" title="Chỉnh sửa">✏️</button>
                            <button class="btn-action btn-action--danger" onclick="window.deleteService(${srv.serviceId})" title="Xóa">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ==========================================
    // SERVICE MODAL LOGIC
    // ==========================================
    function openServiceModal(srv = null) {
        if (!serviceModal) return;
        document.getElementById('serviceEditId').value = srv ? srv.serviceId : '';
        document.getElementById('serviceName').value = srv ? srv.serviceName : '';
        document.getElementById('serviceDescription').value = srv ? (srv.description || '') : '';
        document.getElementById('servicePrice').value = srv ? srv.unitPrice : '';
        document.getElementById('serviceStatus').value = srv ? srv.status : 'ACTIVE';
        document.getElementById('serviceModalTitle').innerText = srv ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới';

        serviceModal.classList.add('open');
    }

    function closeServiceModal() {
        if (serviceModal) {
            serviceModal.classList.remove('open');
            serviceForm.reset();
        }
    }

    document.getElementById('btnOpenAddServiceModal')?.addEventListener('click', () => openServiceModal(null));
    document.getElementById('btnCloseServiceModal')?.addEventListener('click', closeServiceModal);
    document.getElementById('btnCancelServiceForm')?.addEventListener('click', closeServiceModal);
    document.getElementById('serviceModalBackdrop')?.addEventListener('click', closeServiceModal);

    window.openEditService = function(id) {
        const srv = allServices.find(s => s.serviceId === id);
        if (srv) openServiceModal(srv);
    };

    window.deleteService = async function(id) {
        const confirmed = await window.showConfirm('Xóa dịch vụ', 'Bạn có chắc chắn muốn ngừng cung cấp dịch vụ này không?');
        if (!confirmed) return;
        try {
            const response = await fetchAPI(`/api/v1/services/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showSuccess('Đã chuyển dịch vụ sang ngừng cung cấp');
                loadServices();
            } else {
                const err = await response.json();
                showError('Lỗi khi xóa dịch vụ!', err.message);
            }
        } catch (error) {
            console.error(error);
            showError('Lỗi kết nối!', 'Không thể kết nối đến máy chủ.');
        }
    };

    serviceForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('serviceEditId').value;
        const payload = {
            serviceName: document.getElementById('serviceName').value,
            description: document.getElementById('serviceDescription').value,
            unitPrice: parseFloat(document.getElementById('servicePrice').value),
            status: document.getElementById('serviceStatus').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/v1/services/${id}` : '/api/v1/services';

        try {
            const response = await fetchAPI(url, {
                method: method,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showSuccess(id ? 'Cập nhật dịch vụ thành công!' : 'Thêm dịch vụ thành công!');
                closeServiceModal();
                loadServices();
            } else {
                const err = await response.json();
                showError('Có lỗi xảy ra!', err.message);
            }
        } catch (error) {
            console.error(error);
            showError('Lỗi', 'Không thể kết nối đến máy chủ!');
        }
    });

    // ==========================================
    // INIT
    // ==========================================
    if (tabServicesBtn) {
        tabServicesBtn.addEventListener('click', () => {
            loadServices();
        });
    }

    if (document.getElementById('tab-services')?.classList.contains('active')) {
        loadServices();
    }
});
