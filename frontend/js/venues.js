/**
 * venues.js - Quản lý Địa điểm & Sảnh Tiệc (LV34 Event Operations)
 * Tích hợp toàn diện với Backend API /api/v1/venues
 */

document.addEventListener('DOMContentLoaded', () => {
    const tabVenuesBtn = document.querySelector('button[data-tab="tab-venues"]');
    if (tabVenuesBtn) {
        tabVenuesBtn.addEventListener('click', loadVenues);
    }

    const btnOpenAddVenueModal = document.getElementById('btnOpenAddVenueModal');
    if (btnOpenAddVenueModal) {
        btnOpenAddVenueModal.addEventListener('click', openAddVenueModal);
    }

    const venueForm = document.getElementById('venueForm');
    if (venueForm) {
        venueForm.addEventListener('submit', handleSaveVenue);
    }
});

let cachedVenues = [];

async function loadVenues() {
    const tbody = document.getElementById('venuesTableBody');
    const badgeCount = document.getElementById('badgeVenuesCount');
    if (!tbody) return;

    try {
        const response = await fetchAPI('/api/v1/venues?page=0&size=50');
        if (!response.ok) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Không thể tải danh sách sảnh tiệc.</td></tr>';
            return;
        }

        const data = await response.json();
        cachedVenues = Array.isArray(data) ? data : (data.content || []);

        if (badgeCount) {
            badgeCount.textContent = cachedVenues.length;
        }

        if (cachedVenues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:24px;color:#64748b;">Chưa có sảnh tiệc nào được thiết lập.</td></tr>';
            return;
        }

        tbody.innerHTML = cachedVenues.map((v, index) => {
            const venueId = v.venueId || (index + 1);
            const rentalPriceFormatted = v.rentalPrice ? Number(v.rentalPrice).toLocaleString('vi-VN') + ' đ' : 'Liên hệ';
            const capacityStr = `${v.minCapacity || 0} - ${v.maxCapacity || 500} khách`;
            
            let statusBadge = '<span class="summary-pill active">Sẵn sàng</span>';
            if (v.status === 'MAINTENANCE') {
                statusBadge = '<span class="summary-pill warning">Bảo trì</span>';
            } else if (v.status === 'INACTIVE') {
                statusBadge = '<span class="summary-pill inactive">Tạm ngưng</span>';
            }

            return `
                <tr style="border-bottom:1px solid #f1f5f9;">
                    <td><strong>#VH-${venueId}</strong></td>
                    <td>
                        <strong style="color:#0f172a;font-size:0.95rem;">🏛️ ${escapeHtml(v.venueName)}</strong>
                    </td>
                    <td>👥 ${capacityStr}</td>
                    <td style="color:#087f82;font-weight:700;">${rentalPriceFormatted}</td>
                    <td style="color:#64748b;max-width:260px;">📍 ${escapeHtml(v.address || 'Trung tâm Hội nghị LV34')}</td>
                    <td>${statusBadge}</td>
                    <td class="text-right">
                        <div class="btn-action-group">
                            <button class="btn-action" onclick="openEditVenueModal(${venueId})" title="Chỉnh sửa">✏️ Sửa</button>
                            <button class="btn-action btn-action--danger" onclick="deleteVenue(${venueId})" title="Xóa">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        console.error('Lỗi khi tải danh sách địa điểm:', err);
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi kết nối khi tải dữ liệu sảnh tiệc.</td></tr>';
    }
}

function openAddVenueModal() {
    const modal = document.getElementById('venueModal');
    const form = document.getElementById('venueForm');
    const title = document.getElementById('venueModalTitle');
    
    if (form) form.reset();
    document.getElementById('venueEditId').value = '';
    if (title) title.textContent = 'Thêm sảnh tiệc mới';
    if (modal) modal.classList.add('open');
}

window.openEditVenueModal = function(id) {
    const venue = cachedVenues.find(v => v.venueId === id);
    if (!venue) return;

    const modal = document.getElementById('venueModal');
    const title = document.getElementById('venueModalTitle');
    
    document.getElementById('venueEditId').value = venue.venueId;
    document.getElementById('venueName').value = venue.venueName || '';
    document.getElementById('venueMinCapacity').value = venue.minCapacity || 50;
    document.getElementById('venueMaxCapacity').value = venue.maxCapacity || 300;
    document.getElementById('venueRentalPrice').value = venue.rentalPrice || 25000000;
    document.getElementById('venueAddress').value = venue.address || '';
    document.getElementById('venueStatus').value = venue.status || 'AVAILABLE';

    if (title) title.textContent = `Chỉnh sửa sảnh tiệc #${venue.venueId}`;
    if (modal) modal.classList.add('open');
};

window.closeVenueModal = function() {
    const modal = document.getElementById('venueModal');
    if (modal) modal.classList.remove('open');
};

async function handleSaveVenue(e) {
    e.preventDefault();

    const editId = document.getElementById('venueEditId').value;
    const venueData = {
        venueName: document.getElementById('venueName').value.trim(),
        minCapacity: parseInt(document.getElementById('venueMinCapacity').value, 10) || 0,
        maxCapacity: parseInt(document.getElementById('venueMaxCapacity').value, 10) || 100,
        rentalPrice: parseFloat(document.getElementById('venueRentalPrice').value) || 0,
        address: document.getElementById('venueAddress').value.trim() || 'Tầng 2 - LV34 Event Operations',
        status: document.getElementById('venueStatus').value || 'AVAILABLE'
    };

    if (!venueData.venueName) {
        Swal.fire('Lỗi', 'Vui lòng nhập tên sảnh tiệc!', 'warning');
        return;
    }

    try {
        let response;
        if (editId) {
            response = await fetchAPI(`/api/v1/venues/${editId}`, {
                method: 'PUT',
                body: JSON.stringify(venueData)
            });
        } else {
            response = await fetchAPI('/api/v1/venues', {
                method: 'POST',
                body: JSON.stringify(venueData)
            });
        }

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lưu thông tin sảnh tiệc');
        }

        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: editId ? 'Đã cập nhật sảnh tiệc!' : 'Đã thêm sảnh tiệc mới!',
            timer: 1800,
            showConfirmButton: false
        });

        closeVenueModal();
        loadVenues();
    } catch (err) {
        Swal.fire('Thất bại', err.message, 'error');
    }
}

window.deleteVenue = async function(id) {
    const confirm = await Swal.fire({
        title: 'Xác nhận xóa sảnh tiệc?',
        text: 'Hành động này sẽ gỡ sảnh tiệc khỏi danh sách điều phối!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy'
    });

    if (!confirm.isConfirmed) return;

    try {
        const response = await fetchAPI(`/api/v1/venues/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Không thể xóa sảnh tiệc đang có hợp đồng hoặc lịch đặt!');
        }

        Swal.fire('Đã xóa!', 'Sảnh tiệc đã được gỡ bỏ.', 'success');
        loadVenues();
    } catch (err) {
        Swal.fire('Lỗi', err.message, 'error');
    }
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
