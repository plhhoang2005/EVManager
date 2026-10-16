import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '../../../validations/customerSchema';

export const CustomerFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      fullName: '',
      phone: '',
      email: '',
      tier: 'Tiềm năng',
      address: '',
      notes: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <div className="admin-modal open" id="customerFormModal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <h3>{initialData?.id ? `Chỉnh sửa thông tin khách hàng #${initialData.id}` : 'Thêm mới khách hàng'}</h3>
          <button className="modal-close" type="button" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="custFullName" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Họ và tên khách hàng *
            </label>
            <input
              id="custFullName"
              type="text"
              placeholder="Ví dụ: Nguyễn Văn An"
              {...register('fullName')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.fullName ? '1px solid #dc2626' : '1px solid #cbd5e1',
              }}
            />
            {errors.fullName && (
              <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label htmlFor="custPhone" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Số điện thoại *
              </label>
              <input
                id="custPhone"
                type="tel"
                placeholder="0901234567"
                {...register('phone')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: errors.phone ? '1px solid #dc2626' : '1px solid #cbd5e1',
                }}
              />
              {errors.phone && (
                <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="custEmail" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Địa chỉ Email *
              </label>
              <input
                id="custEmail"
                type="email"
                placeholder="an.nv@gmail.com"
                {...register('email')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: errors.email ? '1px solid #dc2626' : '1px solid #cbd5e1',
                }}
              />
              {errors.email && (
                <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="custTier" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Phân nhóm khách hàng *
            </label>
            <select
              id="custTier"
              {...register('tier')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.tier ? '1px solid #dc2626' : '1px solid #cbd5e1',
                background: '#ffffff',
              }}
            >
              <option value="Tiềm năng">Khách Tiềm năng (Mới tiếp cận)</option>
              <option value="Thường">Khách Thường</option>
              <option value="VIP">Khách VIP (Chi tiêu &gt; 200M)</option>
            </select>
            {errors.tier && (
              <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                {errors.tier.message}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="custAddress" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Địa chỉ liên hệ
            </label>
            <input
              id="custAddress"
              type="text"
              placeholder="Số nhà, đường, quận/huyện, TP.HCM..."
              {...register('address')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
              }}
            />
          </div>

          <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {initialData?.id ? 'Lưu thay đổi' : 'Thêm khách hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
