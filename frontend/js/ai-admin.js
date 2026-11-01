/**
 * ai-admin.js - Xử lý Bảng điều khiển Quản lý Google Gemini AI cho Admin (v2.0)
 * Bổ sung: Công tắc Bật/Tắt khẩn cấp (Emergency Kill-Switch) & Thống kê số lượng AI Leads
 */
document.addEventListener('DOMContentLoaded', () => {
    initAdminAiPanel();
});

async function initAdminAiPanel() {
    await loadAdminAiConfig();

    const form = document.getElementById('aiAdminConfigForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveAdminAiConfig();
        });
    }
}

async function loadAdminAiConfig() {
    const statusDot = document.getElementById('aiStatusDot');
    const statusText = document.getElementById('aiStatusText');
    const currentModelEl = document.getElementById('aiCurrentModel');
    const maskedKeyEl = document.getElementById('aiMaskedKey');
    const modelSelect = document.getElementById('aiModelSelect');
    const enabledToggle = document.getElementById('aiEnabledToggle');
    const leadsCountEl = document.getElementById('aiTotalLeadsCount');

    if (!statusText) return;

    try {
        const res = await fetchAPI('/api/v1/ai/admin/config');
        if (!res.ok) {
            statusText.textContent = 'Không thể tải cấu hình AI';
            return;
        }

        const config = await res.json();
        
        if (!config.enabled) {
            statusDot.style.background = '#ef4444'; // Red
            statusText.textContent = '🔴 Đã tắt phục vụ (Tạm dừng hoạt động)';
        } else if (config.active) {
            statusDot.style.background = '#22c55e'; // Green
            statusText.textContent = '🟢 Google Gemini AI đang kết nối & hoạt động';
        } else {
            statusDot.style.background = '#eab308'; // Yellow
            statusText.textContent = '🟡 Chế độ Dự phòng (Fallback Rule-based)';
        }

        if (currentModelEl) currentModelEl.textContent = config.model || 'gemini-2.5-flash';
        if (maskedKeyEl) maskedKeyEl.textContent = config.apiKeyMasked || 'Chưa cấu hình';
        if (modelSelect && config.model) modelSelect.value = config.model;
        if (enabledToggle) enabledToggle.checked = config.enabled;
        if (leadsCountEl) leadsCountEl.textContent = config.totalLeadsCount || 0;

    } catch (err) {
        console.error('Error fetching admin AI config:', err);
        statusText.textContent = 'Lỗi kết nối máy chủ';
    }
}

async function saveAdminAiConfig() {
    const apiKeyInput = document.getElementById('aiNewApiKeyInput');
    const modelSelect = document.getElementById('aiModelSelect');
    const enabledToggle = document.getElementById('aiEnabledToggle');
    const btnSave = document.getElementById('btnSaveAiConfig');
    const alertMsg = document.getElementById('aiConfigAlert');

    const newKey = apiKeyInput ? apiKeyInput.value.trim() : '';
    const newModel = modelSelect ? modelSelect.value : 'gemini-2.5-flash';
    const isEnabled = enabledToggle ? enabledToggle.checked : true;

    if (btnSave) {
        btnSave.disabled = true;
        btnSave.textContent = '⏳ Đang lưu cấu hình...';
    }

    try {
        const res = await fetchAPI('/api/v1/ai/admin/config', {
            method: 'POST',
            body: JSON.stringify({
                apiKey: newKey,
                model: newModel,
                enabled: isEnabled
            })
        });

        if (!res.ok) {
            throw new Error(`Lỗi cập nhật (${res.status})`);
        }

        if (alertMsg) {
            alertMsg.style.display = 'block';
            alertMsg.style.color = '#15803d';
            alertMsg.style.background = '#f0fdf4';
            alertMsg.style.border = '1px solid #bbf7d0';
            alertMsg.textContent = isEnabled 
                ? '✅ Đã lưu cấu hình! Trợ lý AI đang sẵn sàng phục vụ trên website.' 
                : '⚠️ Đã tắt dịch vụ Trợ lý AI! Widget trên website sẽ tạm ẩn.';
            setTimeout(() => { alertMsg.style.display = 'none'; }, 4000);
        }

        if (apiKeyInput) apiKeyInput.value = '';
        await loadAdminAiConfig();

    } catch (err) {
        console.error('Error saving AI config:', err);
        if (alertMsg) {
            alertMsg.style.display = 'block';
            alertMsg.style.color = '#b91c1c';
            alertMsg.style.background = '#fef2f2';
            alertMsg.style.border = '1px solid #fecaca';
            alertMsg.textContent = '❌ Lỗi khi lưu cấu hình AI. Vui lòng thử lại!';
        }
    } finally {
        if (btnSave) {
            btnSave.disabled = false;
            btnSave.textContent = '💾 Lưu Cấu Hình AI';
        }
    }
}
