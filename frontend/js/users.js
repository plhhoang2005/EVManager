document.addEventListener('DOMContentLoaded', function() {
    const usersTableBody = document.getElementById('usersTableBody');
    const tabUsersBtn = document.querySelector('button[data-tab="tab-users"]');

    async function loadUsers() {
        if (!usersTableBody) return;
        usersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu...</td></tr>';
        
        try {
            const response = await fetchAPI('/api/v1/users?size=50');
            if (response.ok) {
                const data = await response.json();
                const users = data.content || data;
                renderUsers(users);
            } else {
                usersTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu người dùng</td></tr>';
            }
        } catch (error) {
            console.error('Lỗi khi tải users:', error);
            usersTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Không thể kết nối đến máy chủ</td></tr>';
        }
    }

    function renderUsers(users) {
        if (!users || users.length === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có người dùng nào.</td></tr>';
            return;
        }

        usersTableBody.innerHTML = users.map(user => {
            const roleBadgeClass = user.roleName === 'ADMIN' ? 'vip' : 'normal';
            const statusBadgeClass = user.status === 'ACTIVE' ? 'confirmed' : 'pending';
            
            return `
                <tr>
                    <td><strong>#${user.userId}</strong></td>
                    <td>${user.fullName || 'Chưa cập nhật'}</td>
                    <td>${user.email || user.username}</td>
                    <td><span class="summary-pill ${roleBadgeClass}">${user.roleName || 'UNKNOWN'}</span></td>
                    <td><span class="summary-pill ${statusBadgeClass}">${user.status || 'ACTIVE'}</span></td>
                    <td class="text-right">
                        <div class="btn-action-group">
                            <button class="btn-action" onclick="showError(\'Thông báo\', \'Tính năng sửa đang phát triển\')" title="Chỉnh sửa">✏️ Sửa</button>
                            <button class="btn-action btn-action--danger" onclick="showError(\'Thông báo\', \'Tính năng khóa đang phát triển\')" title="Khóa">🔒 Khóa</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (tabUsersBtn) {
        tabUsersBtn.addEventListener('click', () => {
            loadUsers();
        });
    }

    if (document.getElementById('tab-users')?.classList.contains('active')) {
        loadUsers();
    }
});

