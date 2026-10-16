import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const CalculatorPage = () => {
  const [eventType, setEventType] = useState('wedding');
  const [basePrice, setBasePrice] = useState(40000000);
  const [guestCount, setGuestCount] = useState(150);
  const [addons, setAddons] = useState({
    optStage: true,
    optSound: true,
    optMC: false,
    optMedia: true,
  });
  const [discountPercent, setDiscountPercent] = useState(true);
  const [voucher, setVoucher] = useState(true);

  // Tính toán theo đúng business rule của calculator.js
  const guestSurcharge = guestCount > 50 ? (guestCount - 50) * 150000 : 0;
  const addonTotal =
    (addons.optStage ? 15000000 : 0) +
    (addons.optSound ? 12000000 : 0) +
    (addons.optMC ? 8000000 : 0) +
    (addons.optMedia ? 10000000 : 0);

  const subTotalBeforeDiscount = basePrice + guestSurcharge + addonTotal;
  const discountVal = discountPercent ? Math.round(subTotalBeforeDiscount * 0.05) : 0;
  const voucherVal = voucher ? 2000000 : 0;
  const afterDiscount = Math.max(0, subTotalBeforeDiscount - discountVal - voucherVal);

  const serviceCharge = Math.round(afterDiscount * 0.05); // 5%
  const vat = Math.round((afterDiscount + serviceCharge) * 0.08); // 8% VAT
  const total = afterDiscount + serviceCharge + vat;
  const deposit = Math.round(total * 0.3); // 30%

  const fmt = (val) => new Intl.NumberFormat('vi-VN').format(val);

  return (
    <div>
      {/* PAGE BANNER */}
      <section className="hero-section" style={{ padding: '50px 0 30px' }}>
        <div className="section-container" style={{ padding: 0, textAlign: 'center' }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>DỰ TRÙ NGÂN SÁCH TỰ ĐỘNG</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            Công Cụ Tính <span>Chi Phí Sự Kiện Nhanh</span>
          </h1>
          <p className="section-subtitle">
            Tùy chỉnh thông số quy mô, loại hình và các dịch vụ đi kèm để nhận báo giá dự kiến tức thì.
          </p>
        </div>
      </section>

      {/* INTERACTIVE COST CALCULATOR SECTION */}
      <section className="calculator-section" style={{ padding: '40px 0 80px' }}>
        <div className="section-container">
          <div className="calc-card">
            <div className="calc-grid">
              <div className="calc-inputs">
                {/* Step 1: Loại sự kiện */}
                <div className="calc-group">
                  <label className="calc-label">1. Loại hình sự kiện</label>
                  <div className="calc-options" id="eventTypeGroup">
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'wedding' ? 'active' : ''}`}
                      onClick={() => { setEventType('wedding'); setBasePrice(40000000); }}
                    >
                      💒 Tiệc cưới
                    </button>
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'corporate' ? 'active' : ''}`}
                      onClick={() => { setEventType('corporate'); setBasePrice(30000000); }}
                    >
                      👔 Hội nghị / Gala
                    </button>
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'birthday' ? 'active' : ''}`}
                      onClick={() => { setEventType('birthday'); setBasePrice(15000000); }}
                    >
                      🎂 Sinh nhật / Kỷ niệm
                    </button>
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'concert' ? 'active' : ''}`}
                      onClick={() => { setEventType('concert'); setBasePrice(90000000); }}
                    >
                      🎵 Concert / Festival
                    </button>
                  </div>
                </div>

                {/* Step 2: Số lượng khách */}
                <div className="calc-group">
                  <div className="calc-label-row">
                    <label className="calc-label" htmlFor="guestRange">2. Quy mô khách mời</label>
                    <span className="calc-value-badge" id="guestCountVal">{guestCount} khách</span>
                  </div>
                  <input
                    type="range"
                    id="guestRange"
                    min="20"
                    max="1000"
                    step="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="calc-slider"
                  />
                </div>

                {/* Step 3: Hạng mục dịch vụ đi kèm */}
                <div className="calc-group">
                  <label className="calc-label">3. Hạng mục bổ sung</label>
                  <div className="calc-checkboxes">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optStage}
                        onChange={() => setAddons({ ...addons, optStage: !addons.optStage })}
                      />
                      <span>Sân khấu & Màn LED HD (+15 triệu)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optSound}
                        onChange={() => setAddons({ ...addons, optSound: !addons.optSound })}
                      />
                      <span>Âm thanh & Ánh sáng cao cấp (+12 triệu)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optMC}
                        onChange={() => setAddons({ ...addons, optMC: !addons.optMC })}
                      />
                      <span>MC & Vũ đoàn biểu diễn (+8 triệu)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optMedia}
                        onChange={() => setAddons({ ...addons, optMedia: !addons.optMedia })}
                      />
                      <span>Quay phim 4K & Chụp ảnh Flycam (+10 triệu)</span>
                    </label>
                  </div>
                </div>

                {/* Step 4: Ưu đãi & Khuyến mãi */}
                <div className="calc-group">
                  <label className="calc-label">4. Khuyến mãi & Voucher</label>
                  <div className="calc-checkboxes">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={discountPercent}
                        onChange={() => setDiscountPercent(!discountPercent)}
                      />
                      <span>Chiết khấu ưu đãi đặt sớm (-5% tính trước)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={voucher}
                        onChange={() => setVoucher(!voucher)}
                      />
                      <span>Voucher khuyến mãi tiền mặt (-2.000.000đ trừ sau)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="calc-result-box">
                <div className="result-card">
                  <span className="result-badge">Ước tính ngân sách</span>
                  <div className="result-amount" id="totalEstimatePrice">{fmt(total)} VNĐ</div>
                  <p className="result-note">
                    * Báo giá chi tiết đã bao gồm Phí phục vụ 5%, Thuế VAT 8% và ước tính tiền cọc đợt 1 (30%) theo chuẩn hợp đồng.
                  </p>

                  <hr className="result-divider" />

                  <div className="result-breakdown">
                    <div className="bd-row">
                      <span>Phí gói cơ bản:</span>
                      <strong id="basePriceLabel">{fmt(basePrice)}đ</strong>
                    </div>
                    <div className="bd-row">
                      <span>Phụ thu số lượng khách:</span>
                      <strong id="guestPriceLabel">{fmt(guestSurcharge)}đ</strong>
                    </div>
                    <div className="bd-row">
                      <span>Dịch vụ bổ sung:</span>
                      <strong id="addonPriceLabel">{fmt(addonTotal)}đ</strong>
                    </div>
                    <div className="bd-row" style={{ color: '#087f82' }}>
                      <span>Chiết khấu % (áp dụng trước):</span>
                      <strong id="discountPercentLabel">-{fmt(discountVal)}đ</strong>
                    </div>
                    <div className="bd-row" style={{ color: '#087f82' }}>
                      <span>Voucher trực tiếp (trừ sau):</span>
                      <strong id="voucherLabel">-{fmt(voucherVal)}đ</strong>
                    </div>
                    <div className="bd-row">
                      <span>Phí phục vụ (5%):</span>
                      <strong id="serviceChargeLabel">{fmt(serviceCharge)}đ</strong>
                    </div>
                    <div className="bd-row">
                      <span>Thuế VAT (8%):</span>
                      <strong id="vatLabel">{fmt(vat)}đ</strong>
                    </div>
                    <div className="bd-row" style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '6px' }}>
                      <span style={{ fontWeight: 700 }}>Tiền cọc đợt 1 (30%):</span>
                      <strong id="depositLabel" style={{ color: '#d9763d', fontSize: '1.05rem' }}>{fmt(deposit)}đ</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-block margin-top"
                    id="calcSubmitBtn"
                    onClick={() => alert(`Báo giá chi tiết đã được tính toán: ${fmt(total)} VNĐ. Chuyên viên sẽ liên hệ tư vấn hợp đồng!`)}
                  >
                    📩 Nhận Báo Giá Chi Tiết Qua Email
                  </button>

                  <Link
                    to="/menu"
                    className="btn btn-outline btn-block"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      borderColor: '#087f82',
                      color: '#087f82',
                      fontWeight: 700,
                      marginTop: '10px',
                      padding: '10px',
                      background: '#f0fdfa',
                    }}
                  >
                    <span>🪄</span> Tùy Biến Món Ăn: Chọn Thực Đơn Tiệc Cưới →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalculatorPage;
