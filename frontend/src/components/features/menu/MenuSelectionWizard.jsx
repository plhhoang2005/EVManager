import React, { useState } from 'react';

// Danh mục món ăn mẫu phong phú chuẩn tiệc cưới Á - Âu (khớp CSDL V8/V11)
export const DEFAULT_DISHES = [
  // 1. KHAI VỊ & SÚP (STARTER)
  { id: 'KV-01', name: 'Gỏi ngó sen tôm thịt xứ Huế', category: 'STARTER', price: 180000, isVeg: false, desc: 'Tôm tươi, thịt ba chỉ, ngó sen giòn và bánh phồng tôm giòn rụm' },
  { id: 'KV-02', name: 'Gỏi củ hủ dừa tôm thịt Bến Tre', category: 'STARTER', price: 210000, isVeg: false, desc: 'Củ hủ dừa tươi non thanh mát, tôm đất xào thơm, mè rang' },
  { id: 'KV-03', name: 'Chả giò hải sản hoàng kim sốt Mayo', category: 'STARTER', price: 190000, isVeg: false, desc: 'Tôm mực tươi gói bánh tráng rế chiên vàng giòn sốt trứng muối' },
  { id: 'KV-04', name: 'Súp sò điệp măng tây thanh cua', category: 'STARTER', price: 240000, isVeg: false, desc: 'Sò điệp Nhật, măng tây xanh Đà Lạt hầm nước dùng gà ngọt thanh' },
  { id: 'KV-05', name: 'Súp bào ngư vi cá hải sản thượng hạng', category: 'STARTER', price: 380000, isVeg: false, desc: 'Bào ngư cao cấp nấu nấm đông cô, nước cốt gà tiềm thuốc bắc' },
  { id: 'KV-06', name: 'Súp nấm tuyết hạt sen dưỡng nhan (Chay)', category: 'STARTER', price: 160000, isVeg: true, desc: 'Món khai vị thanh đạm từ nấm quý và hạt sen tươi Huế' },

  // 2. MÓN CHÍNH (MAIN: Hải sản, Gà, Bò, Heo, Lẩu/Cơm)
  { id: 'MC-01', name: 'Gà ta hấp lá chanh kèm xôi chiên phồng', category: 'MAIN', price: 350000, isVeg: false, desc: 'Gà đồi thịt chắc da giòn hấp lá chanh, xôi chiên phồng nước dừa' },
  { id: 'MC-02', name: 'Gà quay sốt tiêu đen bánh bao chiên', category: 'MAIN', price: 340000, isVeg: false, desc: 'Thịt gà đậm vị thơm lừng hạt tiêu đen Phú Quốc' },
  { id: 'MC-03', name: 'Bò Úc áp chảo sốt vang đỏ nấm truffle', category: 'MAIN', price: 490000, isVeg: false, desc: 'Thăn bò ngoại nhập mềm mọng sốt vang nho Pháp đặc trưng' },
  { id: 'MC-04', name: 'Bò né sốt tiêu xanh kèm bánh mì Pháp', category: 'MAIN', price: 420000, isVeg: false, desc: 'Thịt thăn bò sốt bơ tỏi và tiêu xanh cay nồng' },
  { id: 'MC-05', name: 'Cá chẽm hấp Hồng Kông thượng hạng', category: 'MAIN', price: 420000, isVeg: false, desc: 'Cá chẽm tươi sống nguyên con hấp xì dầu gừng hành thơm nức' },
  { id: 'MC-06', name: 'Tôm càng xanh nướng phô mai đút lò', category: 'MAIN', price: 550000, isVeg: false, desc: 'Tôm càng lớn sốt phô mai Mozzarella béo ngậy nướng vàng' },
  { id: 'MC-07', name: 'Heo sữa quay giòn bì phong cách Quảng Đông', category: 'MAIN', price: 580000, isVeg: false, desc: 'Da giòn tan, thịt nạc ngọt mềm chấm nước tương ngọt đặc chế' },
  { id: 'MC-08', name: 'Lẩu thái hải sản Tom Yum kèm bún tươi', category: 'MAIN', price: 450000, isVeg: false, desc: 'Nước lẩu chua cay chuẩn vị Thái, tôm sú, mực ống, nấm linh chi' },
  { id: 'MC-09', name: 'Cơm chiên hải sản hoàng bào trứng muối', category: 'MAIN', price: 260000, isVeg: false, desc: 'Hạt cơm hạt ngọc giòn vàng tơi xốp, mực tôm xắt hạt lựu' },
  { id: 'MC-10', name: 'Rau củ xào nấm thập cẩm ngũ sắc (Chay)', category: 'MAIN', price: 210000, isVeg: true, desc: 'Món rau xanh bông cải, ớt chuông, nấm đùi gà xào chay' },

  // 3. TRÁNG MIỆNG (DESSERT)
  { id: 'TM-01', name: 'Chè hạt sen long nhãn tiến vua', category: 'DESSERT', price: 150000, isVeg: true, desc: 'Vị ngọt thanh dịu từ đường phèn Quảng Ngãi và hạt sen bùi béo' },
  { id: 'TM-02', name: 'Panna Cotta dâu tây tươi và chanh dây', category: 'DESSERT', price: 180000, isVeg: false, desc: 'Kem sữa Ý mịn mượt béo ngậy kèm sốt hoa quả tươi chua ngọt' },
  { id: 'TM-03', name: 'Bánh Tiramisu phô mai Mascarpone', category: 'DESSERT', price: 220000, isVeg: false, desc: 'Bánh tráng miệng phong cách Ý đậm vị cà phê Espresso thơm lừng' },
  { id: 'TM-04', name: 'Trái cây tứ quý theo mùa (Dưa lưới, nho Mỹ, dâu)', category: 'DESSERT', price: 170000, isVeg: true, desc: 'Đĩa trái cây tươi mát cao cấp xếp tầng nghệ thuật' },
  { id: 'TM-05', name: 'Chè tổ yến chưng đường phèn hạt chia', category: 'DESSERT', price: 320000, isVeg: true, desc: 'Món tráng miệng hoàng gia bồi bổ sức khỏe cho khách VIP' },
];

export const SET_MENUS_PRESET = [
  {
    id: 'SET-DIAMOND',
    name: 'Thực đơn Kim Cương (Diamond Banquet)',
    basePrice: 4500000,
    dishes: ['KV-01', 'KV-04', 'MC-01', 'MC-03', 'MC-05', 'MC-08', 'TM-01'],
    tag: 'Bán chạy nhất',
  },
  {
    id: 'SET-IMPERIAL',
    name: 'Thực đơn Hoàng Gia (Imperial Banquet)',
    basePrice: 3800000,
    dishes: ['KV-03', 'MC-02', 'MC-04', 'MC-05', 'MC-09', 'TM-04'],
    tag: 'Tiết kiệm',
  },
  {
    id: 'SET-SIGNATURE',
    name: 'Thực đơn Tinh Hoa Á - Âu (Signature VIP)',
    basePrice: 6200000,
    dishes: ['KV-05', 'MC-03', 'MC-06', 'MC-07', 'MC-08', 'TM-05'],
    tag: 'Cao cấp VIP',
  },
];

export const MenuSelectionWizard = ({ onConfirmMenu, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSet, setSelectedSet] = useState('SET-DIAMOND');
  const [selectedDishes, setSelectedDishes] = useState([
    'KV-01', 'KV-04', 'MC-01', 'MC-03', 'MC-05', 'MC-08', 'TM-01'
  ]);
  const [tableCount, setTableCount] = useState(30);
  const [spareTables, setSpareTables] = useState(3); // Bàn sơ cua 10%
  const [vegetarianCount, setVegetarianCount] = useState(2);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  // Tính tiền
  const starterDishes = selectedDishes.map((id) => DEFAULT_DISHES.find((d) => d.id === id)).filter((d) => d && d.category === 'STARTER');
  const mainDishes = selectedDishes.map((id) => DEFAULT_DISHES.find((d) => d.id === id)).filter((d) => d && d.category === 'MAIN');
  const dessertDishes = selectedDishes.map((id) => DEFAULT_DISHES.find((d) => d.id === id)).filter((d) => d && d.category === 'DESSERT');

  const pricePerTable = selectedDishes.reduce((sum, id) => {
    const dish = DEFAULT_DISHES.find((d) => d.id === id);
    return sum + (dish ? dish.price : 0);
  }, 0);

  const totalMenuCost = pricePerTable * tableCount;
  const fmt = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫';

  const handleSelectPreset = (presetId) => {
    setSelectedSet(presetId);
    if (presetId === 'CUSTOM') {
      setSelectedDishes([]);
    } else {
      const preset = SET_MENUS_PRESET.find((p) => p.id === presetId);
      if (preset) {
        setSelectedDishes([...preset.dishes]);
      }
    }
  };

  const toggleDish = (dishId) => {
    if (selectedDishes.includes(dishId)) {
      setSelectedDishes(selectedDishes.filter((id) => id !== dishId));
    } else {
      setSelectedDishes([...selectedDishes, dishId]);
    }
  };

  const filteredCatalog = DEFAULT_DISHES.filter((d) => {
    if (currentStep === 1) return d.category === 'STARTER';
    if (currentStep === 2) return d.category === 'MAIN';
    if (currentStep === 3) return d.category === 'DESSERT';
    if (activeCategoryFilter === 'ALL') return true;
    return d.category === activeCategoryFilter;
  });

  const handleFinish = () => {
    const payload = {
      presetId: selectedSet,
      dishes: selectedDishes.map((id) => DEFAULT_DISHES.find((d) => d.id === id)),
      pricePerTable,
      tableCount,
      spareTables,
      totalCost: totalMenuCost,
      vegetarianCount,
      allergyNotes,
    };
    if (onConfirmMenu) {
      onConfirmMenu(payload);
    } else {
      alert(`Đã hoàn tất chọn thực đơn tiệc cưới!\n- Giá 1 bàn: ${fmt(pricePerTable)}\n- Quy mô: ${tableCount} bàn chính (+${spareTables} sơ cua)\n- Tổng chi phí thực đơn: ${fmt(totalMenuCost)}`);
    }
  };

  return (
    <div className="menu-wizard-container" style={{
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      {/* 1. WIZARD HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #087f82 0%, #0e7490 100%)',
        color: '#ffffff',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: 700,
          }}>
            MENU Tiệc Cưới
          </span>
          <h2 style={{ margin: '8px 0 4px 0', fontSize: '1.6rem', color: '#ffffff' }}>
            Chọn Thực Đơn Tiệc Cưới
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
            Cá nhân hóa mâm cỗ cưới: Khai vị, Món chính, Tráng miệng và tự động tính toán ngân sách
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          padding: '12px 20px',
          borderRadius: '12px',
          textAlign: 'right',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Đơn giá tạm tính / Bàn</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fef08a' }}>
            {fmt(pricePerTable)}
          </div>
          <small style={{ opacity: 0.9 }}>Đã chọn: {selectedDishes.length} món</small>
        </div>
      </div>

      {/* 2. STEP INDICATOR BAR */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc',
        overflowX: 'auto',
      }}>
        {[
          { step: 1, label: 'Khai vị & Súp', icon: '🥗', count: starterDishes.length },
          { step: 2, label: 'Món chính', icon: '🍖', count: mainDishes.length },
          { step: 3, label: 'Món tráng miệng', icon: '🍮', count: dessertDishes.length },
          { step: 4, label: 'Tổng hóa đơn', icon: '🧾', count: selectedDishes.length },
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => setCurrentStep(item.step)}
            style={{
              flex: 1,
              minWidth: '180px',
              padding: '16px 12px',
              background: currentStep === item.step ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: currentStep === item.step ? '3px solid #087f82' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: currentStep === item.step ? 700 : 500,
              color: currentStep === item.step ? '#087f82' : '#64748b',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.label}</span>
            <span style={{
              background: currentStep === item.step ? '#087f82' : '#cbd5e1',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.75rem',
            }}>
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. STEP CONTENT */}
      <div style={{ padding: '24px 32px' }}>
        {/* THANH CHỌN GÓI MENU CÓ SẴN (PRESET) */}
        <div style={{
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
            ⚡ Chọn mẫu thực đơn nhanh:
          </span>
          {SET_MENUS_PRESET.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: selectedSet === p.id ? '2px solid #087f82' : '1px solid #cbd5e1',
                background: selectedSet === p.id ? '#e6fffa' : '#ffffff',
                color: selectedSet === p.id ? '#087f82' : '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {p.name.split('(')[0]} ({fmt(p.basePrice)})
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSelectPreset('CUSTOM')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: selectedSet === 'CUSTOM' ? '2px solid #087f82' : '1px solid #cbd5e1',
              background: selectedSet === 'CUSTOM' ? '#e6fffa' : '#ffffff',
              color: selectedSet === 'CUSTOM' ? '#087f82' : '#475569',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            ✏️ Tự phối món riêng
          </button>
        </div>

        {/* STEP 1, 2, 3: CHỌN MÓN ĂN THEO NHÓM */}
        {currentStep <= 3 && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>
                  {currentStep === 1 && 'Chọn món Khai Vị & Súp đầu tiệc'}
                  {currentStep === 2 && 'Chọn các món Chính (Hải sản, Thịt bò/gà, Lẩu, Cơm)'}
                  {currentStep === 3 && 'Chọn món Tráng Miệng kết tiệc'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  {currentStep === 1 && 'Khuyến nghị: Chọn từ 1 - 2 món khai vị để đánh thức vị giác thực khách.'}
                  {currentStep === 2 && 'Khuyến nghị: Chọn từ 3 - 4 món chính gồm cả thịt, cá/hải sản và món no (lẩu/cơm).'}
                  {currentStep === 3 && 'Khuyến nghị: Chọn 1 món ngọt hoặc hoa quả thanh mát để khép lại bữa tiệc.'}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {filteredCatalog.map((dish) => {
                const isSelected = selectedDishes.includes(dish.id);
                return (
                  <div
                    key={dish.id}
                    onClick={() => toggleDish(dish.id)}
                    style={{
                      border: isSelected ? '2px solid #087f82' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdfa' : '#ffffff',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(8, 127, 130, 0.15)' : 'none',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isSelected ? '#087f82' : '#94a3b8',
                      }}>
                        #{dish.id}
                      </span>
                      {dish.isVeg && (
                        <span style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                        }}>
                          🌱 Món Chay
                        </span>
                      )}
                    </div>

                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: isSelected ? '#087f82' : '#0f172a' }}>
                      {dish.name}
                    </h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, minHeight: '34px' }}>
                      {dish.desc}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                      <strong style={{ color: '#d97706', fontSize: '0.95rem' }}>
                        {fmt(dish.price)}
                      </strong>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isSelected ? '#087f82' : '#64748b',
                      }}>
                        {isSelected ? '✓ Đã chọn' : '+ Thêm món'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: TỔNG KẾT VÀ TÍNH TIỀN TOÀN BỘ SỰ KIỆN */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              {/* BẢNG TỔNG HỢP MÓN ĂN ĐÃ CHỌN THEO NHÓM */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 14px 0', color: '#0f172a', fontSize: '1.15rem' }}>
                  📋 Danh Sách {selectedDishes.length} Món Đã Chọn Vào Thực Đơn
                </h3>

                {/* Nhóm Khai vị */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, color: '#087f82', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                    🥗 Món Khai Vị & Súp ({starterDishes.length} món)
                  </div>
                  {starterDishes.length === 0 ? (
                    <small style={{ color: '#dc2626' }}>Chưa chọn món khai vị!</small>
                  ) : (
                    starterDishes.map((d) => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', borderBottom: '1px dashed #e2e8f0' }}>
                        <span>• {d.name} {d.isVeg && '🌱'}</span>
                        <strong>{fmt(d.price)}</strong>
                      </div>
                    ))
                  )}
                </div>

                {/* Nhóm Món chính */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, color: '#087f82', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                    🍖 Món Chính ({mainDishes.length} món)
                  </div>
                  {mainDishes.length === 0 ? (
                    <small style={{ color: '#dc2626' }}>Chưa chọn món chính!</small>
                  ) : (
                    mainDishes.map((d) => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', borderBottom: '1px dashed #e2e8f0' }}>
                        <span>• {d.name} {d.isVeg && '🌱'}</span>
                        <strong>{fmt(d.price)}</strong>
                      </div>
                    ))
                  )}
                </div>

                {/* Nhóm Tráng miệng */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, color: '#087f82', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                    🍮 Món Tráng Miệng ({dessertDishes.length} món)
                  </div>
                  {dessertDishes.length === 0 ? (
                    <small style={{ color: '#dc2626' }}>Chưa chọn món tráng miệng!</small>
                  ) : (
                    dessertDishes.map((d) => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', borderBottom: '1px dashed #e2e8f0' }}>
                        <span>• {d.name} {d.isVeg && '🌱'}</span>
                        <strong>{fmt(d.price)}</strong>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '2px solid #087f82', marginTop: '12px' }}>
                  <strong>Tổng đơn giá 1 bàn (10 khách):</strong>
                  <strong style={{ color: '#087f82', fontSize: '1.2rem' }}>{fmt(pricePerTable)}</strong>
                </div>
              </div>

              {/* TÍNH TOÁN QUY MÔ BÀN VÀ YÊU CẦU ĐẶC BIỆT */}
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 14px 0', color: '#0f172a', fontSize: '1.15rem' }}>
                  ⚙️ Quy Mô & Yêu Cầu Chế Biến
                </h3>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    Số lượng bàn tiệc chính thức:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={tableCount}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      setTableCount(val);
                      setSpareTables(Math.ceil(val * 0.1)); // Tự động tính 10% sơ cua
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <small style={{ color: '#64748b' }}>
                    Bàn sơ cua dự phòng đề xuất (10%): <strong>{spareTables} bàn</strong>
                  </small>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    Số khách ăn chay (Menu riêng):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={vegetarianCount}
                    onChange={(e) => setVegetarianCount(Math.max(0, Number(e.target.value)))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    Ghi chú dị ứng / Khẩu vị riêng:
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Ví dụ: Bàn số 5 kiêng đậu phộng, giảm bột ngọt theo khẩu vị miền Trung..."
                    value={allergyNotes}
                    onChange={(e) => setAllergyNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  ></textarea>
                </div>

                {/* THẺ TỔNG CHI PHÍ THỰC ĐƠN */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                  borderRadius: '10px',
                  padding: '16px',
                  border: '1px solid #99f6e4',
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#0f766e', fontWeight: 600 }}>TỔNG DỰ TOÁN THỰC ĐƠN</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#087f82', margin: '4px 0' }}>
                    {fmt(totalMenuCost)}
                  </div>
                  <small style={{ color: '#475569' }}>
                    = {fmt(pricePerTable)}/bàn × {tableCount} bàn
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. WIZARD FOOTER NAVIGATION */}
      <div style={{
        background: '#f8fafc',
        padding: '16px 32px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{ fontWeight: 600 }}
            >
              ← Quay lại bước trước
            </button>
          ) : (
            onCancel && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={onCancel}
              >
                Hủy bỏ
              </button>
            )
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {currentStep < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{ fontWeight: 600 }}
            >
              Tiếp theo →
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleFinish}
              style={{ fontWeight: 700, padding: '10px 24px' }}
            >
              ✓ Xác nhận lưu thực đơn tiệc cưới
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuSelectionWizard;
