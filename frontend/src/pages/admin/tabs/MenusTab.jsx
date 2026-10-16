import React, { useState } from 'react';
import MenuSelectionWizard from '../../../components/features/menu/MenuSelectionWizard';

export const MenusTab = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [menus, setMenus] = useState([
    { id: 'MN-01', name: 'Thực đơn Kim Cương (Diamond Banquet)', price: '4.500.000 ₫', dishes: 'Gỏi ngó sen tôm thịt xứ Huế, Súp sò điệp măng tây, Gà ta hấp lá chanh, Bò Úc áp chảo, Cá chẽm hấp HK, Lẩu thái hải sản, Chè hạt sen long nhãn', status: 'Đang áp dụng' },
    { id: 'MN-02', name: 'Thực đơn Hoàng Gia (Imperial Banquet)', price: '3.800.000 ₫', dishes: 'Chả giò hải sản hoàng kim, Gà quay sốt tiêu đen, Bò né tiêu xanh, Cá chẽm hấp HK, Cơm chiên hải sản hoàng bào, Trái cây tứ quý', status: 'Đang áp dụng' },
    { id: 'MN-03', name: 'Thực đơn Tinh Hoa Á - Âu (Signature VIP)', price: '6.200.000 ₫', dishes: 'Súp bào ngư vi cá hải sản, Bò Úc áp chảo nấm truffle, Tôm càng xanh phô mai, Heo sữa quay Quảng Đông, Lẩu thái Tom Yum, Chè tổ yến đường phèn', status: 'Đang áp dụng' },
  ]);

  const handleConfirmWizardMenu = (wizardData) => {
    const newMenuId = `MN-0${menus.length + 1}`;
    const dishNames = wizardData.dishes.map((d) => d.name).join(', ');
    const newEntry = {
      id: newMenuId,
      name: `Thực đơn tiệc cưới (${wizardData.tableCount} bàn)`,
      price: new Intl.NumberFormat('vi-VN').format(wizardData.pricePerTable) + ' ₫',
      dishes: dishNames,
      status: 'Đang áp dụng',
    };
    setMenus([newEntry, ...menus]);
    setShowWizard(false);
  };

  return (
    <section id="tab-menus" className="admin-tab-pane active">
      {showWizard ? (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowWizard(false)}
              style={{ fontWeight: 600 }}
            >
              ← Quay lại danh sách thực đơn
            </button>
          </div>
          <MenuSelectionWizard
            onConfirmMenu={handleConfirmWizardMenu}
            onCancel={() => setShowWizard(false)}
          />
        </div>
      ) : (
        <>
          <div className="tab-header-row">
            <div>
              <h2>Quản lý thực đơn & Món ăn</h2>
              <p className="section-subtitle" style={{ margin: 0 }}>Gói ẩm thực chuẩn Á - Âu cho mọi quy mô sự kiện</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setShowWizard(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>🍽️</span> Chọn Thực Đơn Tiệc Cưới
              </button>
            </div>
          </div>

          <div className="panel table-panel" style={{ marginTop: '20px' }}>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã thực đơn</th>
                    <th>Tên Set Menu</th>
                    <th>Đơn giá / Bàn (10 khách)</th>
                    <th>Món ăn chi tiết</th>
                    <th>Trạng thái</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.id}</strong></td>
                      <td><strong style={{ color: '#087f82' }}>{m.name}</strong></td>
                      <td><strong>{m.price}</strong></td>
                      <td style={{ maxWidth: '420px', color: '#64748b', fontSize: '0.9rem' }}>{m.dishes}</td>
                      <td><span className="status-badge status-confirmed">{m.status}</span></td>
                      <td className="text-right">
                        <button
                          className="btn-action-small"
                          onClick={() => setShowWizard(true)}
                        >
                          Tùy biến món
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MenusTab;
