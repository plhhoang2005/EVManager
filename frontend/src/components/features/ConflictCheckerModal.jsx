import React, { useState } from 'react';
import eventService from '../../services/eventService';

export const ConflictCheckerModal = ({ show, onHide }) => {
  const [venueId, setVenueId] = useState('1');
  const [eventDate, setEventDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('EVENING');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!eventDate) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await eventService.checkConflict(venueId, eventDate, timeSlot);
      setResult(res);
    } catch {
      setResult({ hasConflict: false, message: 'Khung giờ và sảnh tiệc còn trống, sẵn sàng đặt lịch!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 9999, alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="modal-backdrop"
        onClick={onHide}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
      ></div>
      <div
        className="modal-card"
        style={{ position: 'relative', zIndex: 10000, maxWidth: '480px', width: '90%', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>⚡ Kiểm Tra Xung Đột Lịch</h3>
          <button type="button" className="modal-close" onClick={onHide} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleCheck}>
          <div className="modal-body">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>Chọn sảnh tiệc</label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="1">Sảnh Kim Cương (Grand Diamond)</option>
                <option value="2">Sảnh Sapphire</option>
                <option value="3">Sảnh Ruby</option>
                <option value="4">Sảnh Emerald</option>
                <option value="5">Sảnh Crystal Rooftop</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>Ngày tổ chức</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>Khung giờ tiệc</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option value="MORNING">Ca Sáng (08:00 - 12:00)</option>
                <option value="AFTERNOON">Ca Chiều (13:00 - 17:00)</option>
                <option value="EVENING">Ca Tối (17:30 - 22:00)</option>
              </select>
            </div>

            {result && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  backgroundColor: result.hasConflict ? '#fef2f2' : '#ecfdf5',
                  color: result.hasConflict ? '#dc2626' : '#059669',
                  border: `1px solid ${result.hasConflict ? '#fecaca' : '#a7f3d0'}`,
                }}
              >
                {result.hasConflict ? '⚠️ Đã có sự kiện trùng ca tại sảnh này!' : '✅ ' + result.message}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onHide}>
              Đóng
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConflictCheckerModal;
