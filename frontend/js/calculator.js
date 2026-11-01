/**
 * Module Tính chi phí (calculator.js)
 * Xử lý công cụ tính chi phí trên trang calculator.html theo quy chuẩn BA UC-08 & Bug-03
 * Tích hợp AI Smart Event Planner (Gemini AI API)
 */

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = sessionStorage.getItem('currentUser');
    const navActions = document.getElementById('navActions');

    if (navActions && currentUser === 'admin') {
        navActions.innerHTML = `
            <a href="admin.html" class="btn btn-primary btn-sm">
                <span>⚡ Trang Quản Trị</span>
            </a>
            <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Toggle Navigation">
                <span></span><span></span><span></span>
            </button>
        `;
    }

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
    }

    initCalculatorLogic();
    initAiPlannerLogic();
});

function initCalculatorLogic() {
    let selectedBasePrice = 40000000;
    const guestRange = document.getElementById('guestRange');
    const guestCountVal = document.getElementById('guestCountVal');

    const optBtns = document.querySelectorAll('#eventTypeGroup .calc-opt-btn');
    optBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            optBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedBasePrice = parseInt(btn.getAttribute('data-base')) || 40000000;
            recalculate();
        });
    });

    if (guestRange) {
        guestRange.addEventListener('input', function(e) {
            if (guestCountVal) guestCountVal.textContent = `${e.target.value} khách`;
            recalculate();
        });
    }

    const checkboxes = document.querySelectorAll('.calc-checkboxes input[type="checkbox"]');
    checkboxes.forEach(function(cb) { cb.addEventListener('change', recalculate); });

    function recalculate() {
        const guests = parseInt(guestRange ? guestRange.value : 150);
        // Ước tính chi phí thực đơn/bàn: 250.000 đ/khách
        const guestPrice = guests * 250000;

        // Dịch vụ bổ sung (sân khấu, âm thanh, MC, quay phim)
        let addonPrice = 0;
        ['optStage', 'optSound', 'optMC', 'optMedia'].forEach(function(id) {
            const cb = document.getElementById(id);
            if (cb && cb.checked) {
                addonPrice += parseInt(cb.value) || 0;
            }
        });

        // Tổng chi phí trước chiết khấu
        const subtotalBeforeDiscount = selectedBasePrice + guestPrice + addonPrice;

        // 1. Áp dụng Chiết khấu % TRƯỚC theo quy chuẩn BUG-03 & BA UC-08
        const discountCb = document.getElementById('optDiscountPercent');
        const discountPercent = (discountCb && discountCb.checked) ? (parseInt(discountCb.value) || 5) : 0;
        const discountAmount = Math.round(subtotalBeforeDiscount * (discountPercent / 100));
        const afterDiscount = subtotalBeforeDiscount - discountAmount;

        // 2. Tiếp tục trừ Voucher tiền mặt TRỰC TIẾP SAU chiết khấu theo BUG-03
        const voucherCb = document.getElementById('optVoucher');
        const voucherAmount = (voucherCb && voucherCb.checked) ? (parseInt(voucherCb.value) || 2000000) : 0;
        const netSubtotal = Math.max(0, afterDiscount - voucherAmount);

        // 3. Phí phục vụ 5%
        const serviceCharge = Math.round(netSubtotal * 0.05);

        // 4. Thuế GTGT VAT 8% (tính trên tổng dịch vụ đã cộng phí phục vụ)
        const vat = Math.round((netSubtotal + serviceCharge) * 0.08);

        // 5. Tổng ngân sách trọn gói
        const grandTotal = netSubtotal + serviceCharge + vat;

        // 6. Tiền đặt cọc tối thiểu đợt 1 (30% tổng giá trị hợp đồng)
        const depositMin = Math.round(grandTotal * 0.30);

        // Hiển thị ra giao diện
        const totalElem = document.getElementById('totalEstimatePrice');
        const baseElem = document.getElementById('basePriceLabel');
        const guestElem = document.getElementById('guestPriceLabel');
        const addonElem = document.getElementById('addonPriceLabel');
        const discountPercentElem = document.getElementById('discountPercentLabel');
        const voucherElem = document.getElementById('voucherLabel');
        const serviceChargeElem = document.getElementById('serviceChargeLabel');
        const vatElem = document.getElementById('vatLabel');
        const depositElem = document.getElementById('depositLabel');

        if (totalElem) totalElem.textContent = `${grandTotal.toLocaleString('vi-VN')} VNĐ`;
        if (baseElem) baseElem.textContent = `${selectedBasePrice.toLocaleString('vi-VN')}đ`;
        if (guestElem) guestElem.textContent = `${guestPrice.toLocaleString('vi-VN')}đ`;
        if (addonElem) addonElem.textContent = `${addonPrice.toLocaleString('vi-VN')}đ`;
        if (discountPercentElem) discountPercentElem.textContent = `-${discountAmount.toLocaleString('vi-VN')}đ`;
        if (voucherElem) voucherElem.textContent = `-${voucherAmount.toLocaleString('vi-VN')}đ`;
        if (serviceChargeElem) serviceChargeElem.textContent = `${serviceCharge.toLocaleString('vi-VN')}đ`;
        if (vatElem) vatElem.textContent = `${vat.toLocaleString('vi-VN')}đ`;
        if (depositElem) depositElem.textContent = `${depositMin.toLocaleString('vi-VN')}đ`;
    }

    // Tính toán khởi tạo lần đầu
    recalculate();

    const calcSubmitBtn = document.getElementById('calcSubmitBtn');
    if (calcSubmitBtn) {
        calcSubmitBtn.addEventListener('click', function() {
            const totalElem = document.getElementById('totalEstimatePrice');
            const totalText = totalElem ? totalElem.textContent : '';
            window.location.href = `contact.html?estimate=${encodeURIComponent(totalText)}`;
        });
    }
}

/**
 * Khởi tạo logic tương tác với API AI Planning
 */
function initAiPlannerLogic() {
    const aiPlanBtn = document.getElementById('aiPlanBtn');
    const aiSyncWithCalcBtn = document.getElementById('aiSyncWithCalcBtn');
    const aiEventType = document.getElementById('aiEventType');
    const aiTotalBudget = document.getElementById('aiTotalBudget');
    const aiGuestCount = document.getElementById('aiGuestCount');
    const aiSpecialNotes = document.getElementById('aiSpecialNotes');

    const aiLoadingSpinner = document.getElementById('aiLoadingSpinner');
    const aiResultBox = document.getElementById('aiResultBox');
    const aiSummaryText = document.getElementById('aiSummaryText');
    const aiBudgetBreakdownContainer = document.getElementById('aiBudgetBreakdownContainer');
    const aiServicesContainer = document.getElementById('aiServicesContainer');
    const aiMilestonesContainer = document.getElementById('aiMilestonesContainer');
    const aiTimelineContainer = document.getElementById('aiTimelineContainer');
    const aiSaveProposalBtn = document.getElementById('aiSaveProposalBtn');

    let currentAiPlan = null;

    // 1. Đồng bộ số liệu từ bảng tính chi phí truyền thống sang AI input
    if (aiSyncWithCalcBtn) {
        aiSyncWithCalcBtn.addEventListener('click', function() {
            const totalElem = document.getElementById('totalEstimatePrice');
            if (totalElem) {
                const numericStr = totalElem.textContent.replace(/[^\d]/g, '');
                const val = parseInt(numericStr) || 80000000;
                if (aiTotalBudget) aiTotalBudget.value = val;
            }

            const guestRange = document.getElementById('guestRange');
            if (guestRange && aiGuestCount) {
                aiGuestCount.value = guestRange.value;
            }

            const activeBtn = document.querySelector('#eventTypeGroup .calc-opt-btn.active');
            if (activeBtn && aiEventType) {
                const type = activeBtn.getAttribute('data-type');
                if (type) aiEventType.value = type;
            }
        });
    }

    // 2. Gửi yêu cầu lập kế hoạch AI
    if (aiPlanBtn) {
        aiPlanBtn.addEventListener('click', async function() {
            const eventType = aiEventType ? aiEventType.value : 'wedding';
            const totalBudget = parseFloat(aiTotalBudget ? aiTotalBudget.value : 80000000) || 50000000;
            const guestCount = parseInt(aiGuestCount ? aiGuestCount.value : 150) || 100;
            const specialNotes = aiSpecialNotes ? aiSpecialNotes.value.trim() : '';

            if (totalBudget <= 0) {
                alert('Vui lòng nhập ngân sách hợp lệ lớn hơn 0 VNĐ');
                return;
            }

            // Hiển thị trạng thái loading
            if (aiLoadingSpinner) aiLoadingSpinner.style.display = 'block';
            if (aiResultBox) aiResultBox.style.display = 'none';
            aiPlanBtn.disabled = true;

            const payload = {
                eventType: eventType,
                totalBudget: totalBudget,
                guestCount: guestCount,
                specialNotes: specialNotes
            };

            try {
                const apiBase = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : (window.location.port === '8080' ? '' : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080' : window.location.origin));
                const response = await fetch(`${apiBase}/api/v1/ai/plan-event`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`Lỗi máy chủ (${response.status})`);
                }

                const data = await response.json();
                currentAiPlan = data;
                renderAiPlan(data, totalBudget);

            } catch (err) {
                console.warn('Lỗi gọi API AI, áp dụng dữ liệu dự phòng cục bộ:', err);
                // Fallback trực tiếp phía client nếu server backend chưa bật
                const fallbackData = createClientFallbackPlan(eventType, totalBudget, guestCount);
                currentAiPlan = fallbackData;
                renderAiPlan(fallbackData, totalBudget);
            } finally {
                if (aiLoadingSpinner) aiLoadingSpinner.style.display = 'none';
                aiPlanBtn.disabled = false;
            }
        });
    }

    // 3. Render kết quả AI
    function renderAiPlan(data, totalBudget) {
        if (!data || !aiResultBox) return;

        // Tóm tắt định hướng
        if (aiSummaryText) {
            aiSummaryText.textContent = data.summary || 'Kế hoạch sự kiện tối ưu ngân sách.';
        }

        // Bảng phân bổ ngân sách
        if (aiBudgetBreakdownContainer && data.budgetBreakdown) {
            aiBudgetBreakdownContainer.innerHTML = '';
            for (const [category, amount] of Object.entries(data.budgetBreakdown)) {
                const percent = Math.min(100, Math.round((amount / totalBudget) * 100)) || 0;
                const row = document.createElement('div');
                row.className = 'ai-budget-row';
                row.innerHTML = `
                    <div style="flex: 1; padding-right: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span style="font-weight: 600; color: #1e293b;">${category}</span>
                            <span style="color: #4f46e5; font-weight: 700;">${amount.toLocaleString('vi-VN')}đ (${percent}%)</span>
                        </div>
                        <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #6366f1, #a855f7); width: ${percent}%; height: 100%;"></div>
                        </div>
                    </div>
                `;
                aiBudgetBreakdownContainer.appendChild(row);
            }
        }

        // Gói dịch vụ gợi ý
        if (aiServicesContainer && Array.isArray(data.recommendedServices)) {
            aiServicesContainer.innerHTML = '';
            data.recommendedServices.forEach(function(svc) {
                const li = document.createElement('li');
                li.style.marginBottom = '6px';
                li.textContent = svc;
                aiServicesContainer.appendChild(li);
            });
        }

        // Mốc thời gian chuẩn bị (Milestones)
        if (aiMilestonesContainer && Array.isArray(data.preparationMilestones)) {
            aiMilestonesContainer.innerHTML = '';
            data.preparationMilestones.forEach(function(ms) {
                const div = document.createElement('div');
                div.className = 'ai-milestone-item';
                div.textContent = ms;
                aiMilestonesContainer.appendChild(div);
            });
        }

        // Kịch bản timeline
        if (aiTimelineContainer && Array.isArray(data.dayOfTimeline)) {
            aiTimelineContainer.innerHTML = '';
            data.dayOfTimeline.forEach(function(tl) {
                const div = document.createElement('div');
                div.className = 'ai-timeline-item';
                div.textContent = tl;
                aiTimelineContainer.appendChild(div);
            });
        }

        aiResultBox.style.display = 'block';
        aiResultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 4. In / Xuất Kế Hoạch PDF
    const aiPrintPlanBtn = document.getElementById('aiPrintPlanBtn');
    if (aiPrintPlanBtn) {
        aiPrintPlanBtn.addEventListener('click', function() {
            const timestampElem = document.getElementById('printTimestamp');
            if (timestampElem) {
                const now = new Date();
                timestampElem.textContent = 'Ngày xuất: ' + now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
            }
            window.print();
        });
    }

    // 5. Đăng ký tư vấn theo kế hoạch AI (Modal & API)
    const aiInquiryModal = document.getElementById('aiInquiryModal');
    const closeInquiryModalBtn = document.getElementById('closeInquiryModalBtn');
    const cancelInquiryBtn = document.getElementById('cancelInquiryBtn');
    const aiInquiryForm = document.getElementById('aiInquiryForm');
    const inquiryStatusMessage = document.getElementById('inquiryStatusMessage');

    if (aiSaveProposalBtn && aiInquiryModal) {
        aiSaveProposalBtn.addEventListener('click', function() {
            aiInquiryModal.style.display = 'flex';
            if (inquiryStatusMessage) inquiryStatusMessage.style.display = 'none';
        });
    }

    function closeInquiryModal() {
        if (aiInquiryModal) aiInquiryModal.style.display = 'none';
    }

    if (closeInquiryModalBtn) closeInquiryModalBtn.addEventListener('click', closeInquiryModal);
    if (cancelInquiryBtn) cancelInquiryBtn.addEventListener('click', closeInquiryModal);

    if (aiInquiryModal) {
        aiInquiryModal.addEventListener('click', function(e) {
            if (e.target === aiInquiryModal) closeInquiryModal();
        });
    }

    if (aiInquiryForm) {
        aiInquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitInquiryBtn');
            if (submitBtn) submitBtn.disabled = true;

            const fullName = document.getElementById('inquiryFullName').value.trim();
            const phone = document.getElementById('inquiryPhone').value.trim();
            const email = document.getElementById('inquiryEmail').value.trim();
            const notes = document.getElementById('inquiryNotes').value.trim();

            const eventType = aiEventType ? aiEventType.value : 'wedding';
            const totalBudget = aiTotalBudget ? parseFloat(aiTotalBudget.value) : 0;
            const guestCount = aiGuestCount ? parseInt(aiGuestCount.value) : 100;
            const planSummary = currentAiPlan && currentAiPlan.summary ? currentAiPlan.summary : '';

            const payload = {
                fullName: fullName,
                phone: phone,
                email: email,
                eventType: eventType,
                budget: totalBudget,
                guestCount: guestCount,
                specialNotes: notes,
                planSummary: planSummary
            };

            try {
                const apiBase = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : (window.location.port === '8080' ? '' : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080' : window.location.origin));
                const res = await fetch(`${apiBase}/api/v1/ai/inquiry`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.message || `Lỗi máy chủ (${res.status})`);
                }

                const result = await res.json();
                if (inquiryStatusMessage) {
                    inquiryStatusMessage.style.display = 'block';
                    inquiryStatusMessage.style.background = '#ecfdf5';
                    inquiryStatusMessage.style.color = '#065f46';
                    inquiryStatusMessage.style.border = '1px solid #a7f3d0';
                    inquiryStatusMessage.innerHTML = `
                        <strong>🎉 Tiếp nhận thành công!</strong><br>
                        Mã hồ sơ: <strong>${result.inquiryCode}</strong><br>
                        ${result.message || 'Chuyên viên Sales của EVManager sẽ liên hệ sớm!'}
                    `;
                }

                setTimeout(() => {
                    closeInquiryModal();
                    aiInquiryForm.reset();
                    if (submitBtn) submitBtn.disabled = false;
                }, 3000);

            } catch (err) {
                if (inquiryStatusMessage) {
                    inquiryStatusMessage.style.display = 'block';
                    inquiryStatusMessage.style.background = '#fef2f2';
                    inquiryStatusMessage.style.color = '#991b1b';
                    inquiryStatusMessage.style.border = '1px solid #fecaca';
                    inquiryStatusMessage.innerHTML = `<strong>Lỗi:</strong> ${err.message}`;
                }
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // Fallback client dự phòng khi máy chủ backend chưa khởi động
    function createClientFallbackPlan(type, budget, guests) {
        return {
            summary: `Đề xuất tối ưu hóa ngân sách cho sự kiện ${type} quy mô ${guests} khách. Ngân sách được cân đối hài hòa giữa sảnh tiệc, ẩm thực, thiết bị âm thanh ánh sáng và trang trí.`,
            budgetBreakdown: {
                "Sảnh tiệc & Thực đơn ẩm thực": Math.round(budget * 0.45),
                "Âm thanh & Ánh sáng sân khấu": Math.round(budget * 0.20),
                "Trang trí, Concept & Backdrop": Math.round(budget * 0.15),
                "Nhân sự điều phối & MC": Math.round(budget * 0.10),
                "Dự phòng & Chi phí khác": Math.round(budget * 0.10)
            },
            recommendedServices: [
                "Gói âm thanh ánh sáng biểu diễn cao cấp",
                "Trang trí hoa tươi & Photobooth check-in",
                "Nhân sự điều phối sự kiện (Event Coordinator) & MC",
                "Quay phim 4K highlight & Chụp ảnh sự kiện"
            ],
            preparationMilestones: [
                "T-30 ngày: Ký hợp đồng dịch vụ & đặt cọc đợt 1 (30%)",
                "T-15 ngày: Chốt layout thiết kế sảnh và thực đơn tiệc",
                "T-7 ngày: Chốt danh sách khách mời và kịch bản MC",
                "T-3 ngày: Tổng duyệt âm thanh ánh sáng & visual màn LED",
                "T-0 ngày: Bàn giao sảnh và vận hành sự kiện chính thức"
            ],
            dayOfTimeline: [
                "17:00 - 18:00: Đón tiếp khách mời & Check-in photobooth",
                "18:00 - 18:30: Khai mạc sự kiện và nghi thức chính",
                "18:30 - 20:00: Phục vụ tiệc ẩm thực & Giao lưu văn nghệ",
                "20:00 - 20:45: Hoạt động điểm nhấn & Minigame may mắn",
                "20:45 - 21:15: Bế mạc, chụp ảnh kỷ niệm và cảm ơn khách"
            ]
        };
    }
}
