document.addEventListener('DOMContentLoaded', function() {
    const menusTableBody = document.getElementById('menusTableBody');
    const dishesTableBody = document.getElementById('dishesTableBody');
    const tabMenusBtn = document.querySelector('button[data-tab="tab-menus"]');
    
    // Menu Modal Elements
    const menuModal = document.getElementById('menuModal');
    const menuForm = document.getElementById('menuForm');
    const dishChecklist = document.getElementById('dishChecklist');
    
    // Dish Modal Elements
    const dishModal = document.getElementById('dishModal');
    const dishForm = document.getElementById('dishForm');

    // State
    let allDishes = [];
    let currentMenus = [];

    // --- FETCH DATA ---
    async function loadMenus() {
        if (!menusTableBody) return;
        menusTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu thực đơn...</td></tr>';
        
        try {
            const response = await fetchAPI('/api/v1/menus?size=50');
            if (response.ok) {
                const data = await response.json();
                currentMenus = data.content || data;
                renderMenus(currentMenus);
            } else {
                menusTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu thực đơn</td></tr>';
            }
        } catch (error) {
            console.error('Lỗi khi tải menus:', error);
            menusTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Không thể kết nối đến máy chủ</td></tr>';
        }
    }

    async function loadDishes() {
        if (!dishesTableBody) return;
        dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu món ăn...</td></tr>';

        try {
            const response = await fetchAPI('/api/v1/dishes?size=100');
            if (response.ok) {
                const data = await response.json();
                allDishes = data.content || data;
                renderDishes(allDishes);
            } else {
                dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu món ăn</td></tr>';
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách món ăn:', error);
            dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Không thể kết nối đến máy chủ</td></tr>';
        }
    }

    // --- RENDER MENUS ---
    function renderMenus(menus) {
        if (!menus || menus.length === 0) {
            menusTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có thực đơn nào.</td></tr>';
            return;
        }

        menusTableBody.innerHTML = menus.map(menu => {
            const statusBadgeClass = menu.status === 'ACTIVE' ? 'confirmed' : 'cancelled';
            const statusText = menu.status === 'ACTIVE' ? 'Đang phục vụ' : 'Ngừng phục vụ';
            const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(menu.price);
            
            const dishesHtml = (menu.dishes && menu.dishes.length > 0) 
                ? `<ul style="margin:0; padding-left:20px; font-size:13px; color:#555;">${menu.dishes.map(d => `<li>${d.dishName} (SL: ${d.quantity})</li>`).join('')}</ul>`
                : '<span style="color:#999; font-style:italic;">Chưa có món ăn</span>';

            return `
                <tr>
                    <td><strong>#${menu.menuId}</strong></td>
                    <td><strong style="color:var(--primary-color)">${menu.menuName}</strong></td>
                    <td>
                        <div style="font-size:13px; margin-bottom:5px;">${menu.description || ''}</div>
                        ${dishesHtml}
                    </td>
                    <td style="color:#d9534f; font-weight:bold;">${priceFormatted}</td>
                    <td><span class="summary-pill ${statusBadgeClass}">${statusText}</span></td>
                    <td class="text-right">
                        <div class="btn-action-group">
                            <button class="btn-action" onclick="window.openEditMenu(${menu.menuId})" title="Chỉnh sửa">✏️</button>
                            <button class="btn-action btn-action--danger" onclick="window.deleteMenu(${menu.menuId})" title="Xóa">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // --- RENDER DISHES ---
    function renderDishes(dishes) {
        if (!dishesTableBody) return;
        if (!dishes || dishes.length === 0) {
            dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có món ăn nào.</td></tr>';
            return;
        }

        const categoryMap = {
            'STARTER': 'Khai vị',
            'SOUP': 'Súp',
            'MAIN': 'Món chính',
            'DESSERT': 'Tráng miệng',
            'DRINK': 'Đồ uống'
        };

        dishesTableBody.innerHTML = dishes.map(dish => {
            const statusBadgeClass = dish.status === 'ACTIVE' ? 'confirmed' : 'cancelled';
            const statusText = dish.status === 'ACTIVE' ? 'Đang phục vụ' : 'Ngừng phục vụ';
            const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dish.price);
            const catName = categoryMap[dish.category] || dish.category;

            return `
                <tr>
                    <td><strong>#${dish.dishId}</strong></td>
                    <td>
                        <strong style="color:var(--primary-color)">${dish.dishName}</strong>
                        <div style="font-size:12px; color:#666;">${dish.description || ''}</div>
                    </td>
                    <td><span class="summary-pill default">${catName}</span></td>
                    <td style="color:#d9534f; font-weight:bold;">${priceFormatted}</td>
                    <td><span class="summary-pill ${statusBadgeClass}">${statusText}</span></td>
                    <td class="text-right">
                        <div class="btn-action-group">
                            <button class="btn-action" onclick="window.openEditDish(${dish.dishId})" title="Chỉnh sửa">✏️</button>
                            <button class="btn-action btn-action--danger" onclick="window.deleteDish(${dish.dishId})" title="Xóa">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ==========================================
    // MENU MODAL LOGIC
    // ==========================================
    function openMenuModal(menu = null) {
        if (!menuModal) return;
        document.getElementById('menuEditId').value = menu ? menu.menuId : '';
        document.getElementById('menuName').value = menu ? menu.menuName : '';
        document.getElementById('menuDescription').value = menu ? (menu.description || '') : '';
        document.getElementById('menuPrice').value = menu ? menu.price : '';
        document.getElementById('menuStatus').value = menu ? menu.status : 'ACTIVE';
        document.getElementById('menuModalTitle').innerText = menu ? 'Cập nhật thực đơn' : 'Thêm thực đơn mới';

        // Render checklist based on allDishes
        dishChecklist.innerHTML = allDishes.map(dish => {
            const isSelected = menu && menu.dishes && menu.dishes.some(d => d.dishId === dish.dishId);
            const quantity = isSelected ? menu.dishes.find(d => d.dishId === dish.dishId).quantity : 1;
            
            return `
                <div style="display:flex; align-items:center; margin-bottom:10px; gap: 12px; background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                    <input type="checkbox" id="chk_dish_${dish.dishId}" value="${dish.dishId}" ${isSelected ? 'checked' : ''} style="cursor:pointer; width:auto; height: 18px; margin: 0; flex-shrink: 0;" />
                    <label for="chk_dish_${dish.dishId}" style="flex:1; cursor:pointer; margin:0; display:block; line-height: 1.4;">
                        <strong>${dish.dishName}</strong>
                        <div style="font-size: 11px; color: #64748b;">Phân loại: ${dish.category} &nbsp;|&nbsp; Giá: ${new Intl.NumberFormat('vi-VN').format(dish.price)}đ</div>
                    </label>
                    <input type="number" id="qty_dish_${dish.dishId}" value="${quantity}" min="1" style="width: 70px; padding: 4px 8px; flex-shrink: 0;" ${isSelected ? '' : 'disabled'} />
                </div>
            `;
        }).join('');

        // Add event listeners to checkboxes to toggle quantity inputs and recalculate price
        allDishes.forEach(dish => {
            const chk = document.getElementById(`chk_dish_${dish.dishId}`);
            const qty = document.getElementById(`qty_dish_${dish.dishId}`);
            if(chk && qty) {
                chk.addEventListener('change', (e) => {
                    qty.disabled = !e.target.checked;
                    calculateMenuPrice();
                });
                qty.addEventListener('input', () => {
                    if (chk.checked) calculateMenuPrice();
                });
            }
        });

        menuModal.classList.add('open');
    }

    function calculateMenuPrice() {
        let total = 0;
        allDishes.forEach(dish => {
            const chk = document.getElementById(`chk_dish_${dish.dishId}`);
            if (chk && chk.checked) {
                const qty = parseInt(document.getElementById(`qty_dish_${dish.dishId}`).value) || 1;
                total += (dish.price * qty);
            }
        });
        document.getElementById('menuPrice').value = total;
    }

    function closeMenuModal() {
        if (menuModal) {
            menuModal.classList.remove('open');
            menuForm.reset();
        }
    }

    document.getElementById('btnOpenAddMenuModal')?.addEventListener('click', () => openMenuModal(null));
    document.getElementById('btnCloseMenuModal')?.addEventListener('click', closeMenuModal);
    document.getElementById('btnCancelMenuForm')?.addEventListener('click', closeMenuModal);

    window.openEditMenu = function(id) {
        const menu = currentMenus.find(m => m.menuId === id);
        if (menu) openMenuModal(menu);
    };

    window.deleteMenu = async function(id) {
        const confirmed = await window.showConfirm('Xóa thực đơn', 'Bạn có chắc chắn muốn xóa thực đơn này không?');
        if (!confirmed) return;
        try {
            const response = await fetchAPI(`/api/v1/menus/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showSuccess('Xóa thực đơn thành công');
                loadMenus();
            } else {
                const err = await response.json();
                showError('Lỗi khi xóa thực đơn!', err.message);
            }
        } catch (error) {
            console.error(error);
            showError('Lỗi kết nối!', 'Không thể kết nối đến máy chủ.');
        }
    };

    menuForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedDishes = [];
        allDishes.forEach(dish => {
            const chk = document.getElementById(`chk_dish_${dish.dishId}`);
            if (chk && chk.checked) {
                const qty = document.getElementById(`qty_dish_${dish.dishId}`).value || 1;
                selectedDishes.push({
                    dishId: dish.dishId,
                    quantity: parseInt(qty),
                    note: ""
                });
            }
        });

        if (selectedDishes.length === 0) {
            showError('Lỗi', 'Vui lòng chọn ít nhất 1 món ăn cho thực đơn!');
            return;
        }

        const id = document.getElementById('menuEditId').value;
        const payload = {
            menuName: document.getElementById('menuName').value,
            description: document.getElementById('menuDescription').value,
            price: parseFloat(document.getElementById('menuPrice').value),
            status: document.getElementById('menuStatus').value,
            dishes: selectedDishes
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/v1/menus/${id}` : '/api/v1/menus';

        try {
            const response = await fetchAPI(url, {
                method: method,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showSuccess(id ? 'Cập nhật thành công!' : 'Thêm thực đơn thành công!');
                closeMenuModal();
                loadMenus();
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
    // DISH MODAL LOGIC
    // ==========================================
    function openDishModal(dish = null) {
        if (!dishModal) return;
        document.getElementById('dishEditId').value = dish ? dish.dishId : '';
        document.getElementById('dishName').value = dish ? dish.dishName : '';
        document.getElementById('dishCategory').value = dish ? dish.category : 'MAIN';
        document.getElementById('dishPrice').value = dish ? dish.price : '';
        document.getElementById('dishStatus').value = dish ? dish.status : 'ACTIVE';
        document.getElementById('dishDescription').value = dish ? (dish.description || '') : '';
        document.getElementById('dishModalTitle').innerText = dish ? 'Cập nhật món ăn' : 'Thêm món ăn mới';
        dishModal.classList.add('open');
    }

    function closeDishModal() {
        if (dishModal) {
            dishModal.classList.remove('open');
            dishForm.reset();
        }
    }

    document.getElementById('btnOpenAddDishModal')?.addEventListener('click', () => openDishModal(null));
    document.getElementById('btnCloseDishModal')?.addEventListener('click', closeDishModal);
    document.getElementById('btnCancelDishForm')?.addEventListener('click', closeDishModal);

    window.openEditDish = function(id) {
        const dish = allDishes.find(d => d.dishId === id);
        if (dish) openDishModal(dish);
    };

    window.deleteDish = async function(id) {
        const confirmed = await window.showConfirm('Xóa món ăn', 'Bạn có chắc chắn muốn ngừng phục vụ món ăn này không?');
        if (!confirmed) return;
        try {
            const response = await fetchAPI(`/api/v1/dishes/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showSuccess('Xóa món ăn thành công');
                loadDishes();
            } else {
                const err = await response.json();
                showError('Lỗi khi xóa món ăn!', err.message);
            }
        } catch (error) {
            console.error(error);
            showError('Lỗi kết nối', 'Không thể kết nối đến máy chủ!');
        }
    };

    dishForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('dishEditId').value;
        const payload = {
            dishName: document.getElementById('dishName').value,
            category: document.getElementById('dishCategory').value,
            price: parseFloat(document.getElementById('dishPrice').value),
            status: document.getElementById('dishStatus').value,
            description: document.getElementById('dishDescription').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/v1/dishes/${id}` : '/api/v1/dishes';

        try {
            const response = await fetchAPI(url, {
                method: method,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showSuccess(id ? 'Cập nhật món ăn thành công!' : 'Thêm món ăn thành công!');
                closeDishModal();
                loadDishes();
            } else {
                const err = await response.json();
                showError('Có lỗi xảy ra!', err.message);
            }
        } catch (error) {
            console.error(error);
            showError('Lỗi kết nối', 'Không thể kết nối đến máy chủ!');
        }
    });

    // ==========================================
    // INIT
    // ==========================================
    if (tabMenusBtn) {
        tabMenusBtn.addEventListener('click', () => {
            loadDishes().then(() => loadMenus());
        });
    }

    if (document.getElementById('tab-menus')?.classList.contains('active')) {
        loadDishes().then(() => loadMenus());
    }
});
