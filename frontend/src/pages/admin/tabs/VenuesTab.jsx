import React from 'react';

export const VenuesTab = () => {
  const venues = [
    { id: 'S-01', name: 'Sảnh Kim Cương (Diamond Hall)', capacity: '500 khách', price: '15.000.000 ₫', desc: 'Sảnh lớn phong cách hoàng gia, âm thanh Line Array cao cấp (Tầng 1)' },
    { id: 'S-02', name: 'Sảnh Hoàng Gia (Imperial Hall)', capacity: '300 khách', price: '10.000.000 ₫', desc: 'Tone màu sang trọng quý phái, phù hợp hội nghị & dạ tiệc lớn (Tầng 2)' },
    { id: 'S-03', name: 'Sảnh Ngọc Bích (Emerald Hall)', capacity: '150 khách', price: '6.000.000 ₫', desc: 'Thiết kế vườn ngọc bích hiện đại, không gian mở thoáng đãng (Tầng 3)' },
    { id: 'S-04', name: 'Sảnh Ruby (Ruby Hall)', capacity: '200 khách', price: '8.000.000 ₫', desc: 'Không gian ấm cúng, phù hợp thôi nôi, sinh nhật, tiệc thân mật (Tầng 4)' },
    { id: 'S-05', name: 'Sảnh Bạch Kim (Platinum Hall)', capacity: '400 khách', price: '12.000.000 ₫', desc: 'Không gian mở thoáng đãng, view ngắm toàn cảnh thành phố (Tầng 5)' },
  ];

  return (
    <section id="tab-venues" className="admin-tab-pane active">
      <div className="tab-header-row">
        <div>
          <h2>Quản lý sảnh tiệc & Địa điểm</h2>
          <p className="section-subtitle" style={{ margin: 0 }}>Hệ thống 5 sảnh tiệc tiêu chuẩn 5 sao</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => alert('Thêm sảnh mới')}>
          ➕ Thêm sảnh mới
        </button>
      </div>

      <div className="panel table-panel" style={{ marginTop: '20px' }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã sảnh</th>
                <th>Tên sảnh</th>
                <th>Sức chứa</th>
                <th>Đơn giá tối thiểu / bàn</th>
                <th>Đặc điểm nổi bật</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.id}>
                  <td><strong>{v.id}</strong></td>
                  <td><strong>{v.name}</strong></td>
                  <td><span className="status-badge status-confirmed">{v.capacity}</span></td>
                  <td><strong>{v.price}</strong></td>
                  <td>{v.desc}</td>
                  <td className="text-right">
                    <button className="btn-action-small">Chỉnh sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default VenuesTab;
