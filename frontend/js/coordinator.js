/**
 * coordinator.js - Xử lý Bảng điều phối Sự kiện, FullCalendar & Vận hành Ops
 * Tích hợp đa tab: Bảng điều phối, Lịch trình FullCalendar, Checklist SOP, Sơ đồ sảnh tiệc
 */

let cachedCoordinatorEvents = [];
let cachedCoordinatorVenues = [];
let coordinatorCalendarInstance = null;

let defaultChecklist = [
    { text: '1. Kiểm tra màn hình LED P3, hệ thống âm thanh vòm và 4 micro không dây (Cabin kỹ thuật)', done: true },
    { text: '2. Bố trí bàn tiệc theo sơ đồ layout đã duyệt và trang trí hoa tươi sảnh chính', done: true },
    { text: '3. Bàn giao kịch bản MC nghi thức và timeline trình chiếu cho bộ phận điều phối', done: true },
    { text: '4. Đón tiếp ban tổ chức, đại biểu & kiểm tra quầy Check-in lễ tân sảnh tiệc', done: false },
    { text: '5. Phục vụ Teabreak & Khai tiệc món chính đúng timeline cam kết với khách hàng', done: false }
];

let coordinatorChecklist = [...defaultChecklist];

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Khởi tạo chuyển tab
    setupCoordinatorTabs();

    // 2. Chào mừng
    const userFullName = sessionStorage.getItem('userFullName') || 'Coordinator Lead';
    const greetingEl = document.getElementById('adminSidebarGreeting');
    if (greetingEl) {
        greetingEl.textContent = `Xin chào, ${userFullName}`;
    }

    // 3. Khởi tạo Checklist
    renderChecklist();

    // 4. Tải dữ liệu ban đầu
    await loadCoordinatorEvents();
});

// ==========================================
// 1. ĐIỀU HƯỚNG TAB
// ==========================================
function setupCoordinatorTabs() {
    const navButtons = document.querySelectorAll('.sidebar-nav .nav-item[data-tab]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchCoordinatorTab(tabId);
        });
    });
}

function switchCoordinatorTab(tabId) {
    document.querySelectorAll('.sidebar-nav .nav-item[data-tab]').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    const titleEl = document.getElementById('coordPageTitle');
    const subEl = document.getElementById('coordPageSubtitle');
    const titles = {
        'tab-coord-dashboard': { title: 'Bảng điều phối Vận hành (Operations Control)', sub: 'Giám sát chuẩn bị sảnh, phân bổ nhân sự và trạng thái tiệc thời gian thực.' },
        'tab-coord-calendar': { title: 'Lịch Vận Hành Sự Kiện & Hội Nghị', sub: 'Lịch trực quan theo tháng, tuần và ngày đối chiếu trùng sảnh tiệc.' },
        'tab-coord-checklist': { title: 'Checklist Tiêu Chuẩn Vận Hành Tiệc (SOP)', sub: 'Kiểm tra âm thanh, ánh sáng, màn hình LED, bàn tiệc và kịch bản MC.' },
        'tab-coord-venues': { title: 'Sơ Đồ & Tình Trạng Sảnh Tiệc (Halls Status)', sub: 'Giám sát sức chứa, vị trí và trạng thái sẵn sàng đón khách.' }
    };

    if (titles[tabId] && titleEl && subEl) {
        titleEl.textContent = titles[tabId].title;
        subEl.textContent = titles[tabId].sub;
    }

    if (tabId === 'tab-coord-calendar') {
        setTimeout(initCoordinatorCalendar, 150);
    }
    if (tabId === 'tab-coord-venues') {
        loadCoordinatorVenues();
    }
}

// ==========================================
// 2. TAB 1: DANH SÁCH SỰ KIỆN & ĐẾM NGƯỢC
// ==========================================
async function loadCoordinatorEvents() {
    const tableBody = document.getElementById('eventsTableBody');
    const badgeCount = document.getElementById('upcomingEventsCount');
    const statEvents = document.getElementById('upcomingEventsStat');
    const trendBadge = document.getElementById('eventsCountBadge');
    if (!tableBody) return;

    try {
        const response = await fetchAPI('/api/v1/events?page=0&size=50');
        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:1.5rem;">Không thể tải danh sách sự kiện.</td></tr>`;
            return;
        }

        const data = await response.json();
        cachedCoordinatorEvents = data.content || data || [];

        if (badgeCount) badgeCount.textContent = cachedCoordinatorEvents.length;
        if (statEvents) statEvents.textContent = cachedCoordinatorEvents.length;
        if (trendBadge) trendBadge.textContent = `+${cachedCoordinatorEvents.length} sự kiện`;

        if (cachedCoordinatorEvents.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#64748b;">Chưa có sự kiện nào trong danh sách điều phối.</td></tr>`;
            return;
        }

        // Tự động tính toán đồng hồ đếm ngược giờ tiệc gần nhất
        calculateUpcomingEventCountdown(cachedCoordinatorEvents);

        tableBody.innerHTML = cachedCoordinatorEvents.map((ev, index) => {
            const rawStart = ev.startAt || ev.startTime || '';
            let dateStr = 'Hôm nay';
            let timeStr = '18:00';
            if (rawStart) {
                const d = new Date(rawStart);
                if (!isNaN(d.getTime())) {
                    dateStr = d.toLocaleDateString('vi-VN');
                    timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                }
            }

            const venueName = (ev.venue && ev.venue.venueName) ? ev.venue.venueName : (ev.venueName || 'Sảnh Sapphire');

            let statusBadge = '<span class="summary-pill active">Đang chuẩn bị</span>';
            let nextActionBtn = `<button onclick="changeEventStatus(${ev.eventId || index}, 'IN_PROGRESS')" class="btn btn-primary" style="padding:5px 10px;font-size:0.8rem;">▶ Khai tiệc</button>`;

            if (ev.status === 'IN_PROGRESS') {
                statusBadge = '<span class="summary-pill" style="background:#fef3c7;color:#b45309;">🔴 Đang diễn ra tiệc</span>';
                nextActionBtn = `<button onclick="changeEventStatus(${ev.eventId || index}, 'COMPLETED')" class="btn btn-primary" style="background:#16a34a;padding:5px 10px;font-size:0.8rem;">✓ Hoàn tất tiệc</button>`;
            } else if (ev.status === 'COMPLETED') {
                statusBadge = '<span class="summary-pill" style="background:#dcfce7;color:#15803d;">Đã hoàn thành</span>';
                nextActionBtn = `<span style="color:#64748b;font-size:0.8rem;font-weight:600;">✓ Đã nghiệm thu</span>`;
            } else if (ev.status === 'SCHEDULED') {
                statusBadge = '<span class="summary-pill" style="background:#e0f2fe;color:#0369a1;">Đã lên lịch</span>';
                nextActionBtn = `<button onclick="changeEventStatus(${ev.eventId || index}, 'PREPARING')" class="btn btn-outline" style="padding:5px 10px;font-size:0.8rem;">🛠️ Bắt đầu chuẩn bị</button>`;
            }

            return `
                <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:12px;font-weight:700;color:#087f82;">#EV-${ev.eventId || (index + 1)}</td>
                    <td style="padding:12px;">
                        <strong style="color:#0f172a;display:block;font-size:0.95rem;">${escapeHtml(ev.eventName || 'Sự kiện doanh nghiệp')}</strong>
                        <span style="font-size:0.75rem;color:#64748b;">Điều phối viên: Team Ops LV34</span>
                    </td>
                    <td style="padding:12px;color:#0369a1;font-weight:600;">🏛️ ${escapeHtml(venueName)}</td>
                    <td style="padding:12px;color:#334155;">
                        <div style="font-weight:600;">📅 ${dateStr}</div>
                        <div style="font-size:0.8rem;color:#64748b;">⏰ Giờ bắt đầu: ${timeStr}</div>
                    </td>
                    <td style="padding:12px;font-weight:600;color:#0f172a;">👥 ${ev.guestCount || 200} khách</td>
                    <td style="padding:12px;">${statusBadge}</td>
                    <td style="padding:12px;text-align:center;">${nextActionBtn}</td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        console.error('Error loading events:', err);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:1.5rem;">Lỗi kết nối khi tải danh sách sự kiện.</td></tr>`;
    }
}

function calculateUpcomingEventCountdown(events) {
    const countdownEl = document.getElementById('nextEventCountdown');
    const nameEl = document.getElementById('nextEventName');
    if (!countdownEl || !events || events.length === 0) return;

    const now = new Date().getTime();
    let closestEvent = null;
    let minDiff = Infinity;

    events.forEach(ev => {
        if (ev.status === 'COMPLETED' || ev.status === 'CANCELLED') return;
        const time = new Date(ev.startAt || ev.startTime || '').getTime();
        if (isNaN(time)) return;

        const diff = time - now;
        if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            closestEvent = ev;
        } else if (diff <= 0 && (!closestEvent || minDiff > 0)) {
            // Đang diễn ra
            closestEvent = ev;
            minDiff = diff;
        }
    });

    if (!closestEvent) {
        countdownEl.textContent = 'Hoàn tất lịch tiệc';
        if (nameEl) nameEl.textContent = 'Không có sự kiện sắp tới';
        return;
    }

    if (nameEl) nameEl.textContent = closestEvent.eventName || 'Sự kiện kế tiếp';

    if (minDiff <= 0) {
        countdownEl.textContent = '🔴 Đang diễn ra';
    } else {
        const hours = Math.floor(minDiff / (1000 * 60 * 60));
        const minutes = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            countdownEl.textContent = `Còn ${days} ngày ${hours % 24}h`;
        } else {
            countdownEl.textContent = `Còn ${hours}h ${minutes}m`;
        }
    }
}

window.changeEventStatus = function(eventId, newStatus) {
    // Cập nhật trạng thái sự kiện
    const ev = cachedCoordinatorEvents.find(e => e.eventId === eventId);
    if (ev) {
        ev.status = newStatus;
    }

    const alertBox = document.getElementById('coordinatorAlert');
    if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#f0fdf4';
        alertBox.style.color = '#166534';
        alertBox.style.border = '1px solid #bbf7d0';
        const label = newStatus === 'IN_PROGRESS' ? 'Đang diễn ra tiệc' : newStatus === 'COMPLETED' ? 'Đã hoàn tất & Nghiệm thu' : 'Đang chuẩn bị';
        alertBox.textContent = `✅ Đã chuyển trạng thái sự kiện #EV-${eventId} sang: ${label}`;
        setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
    }

    setTimeout(loadCoordinatorEvents, 300);
};

// ==========================================
// 3. TAB 2: FULLCALENDAR TRỰC QUAN
// ==========================================
function initCoordinatorCalendar() {
    const calendarEl = document.getElementById('coordinatorCalendar');
    if (!calendarEl) return;

    if (coordinatorCalendarInstance) {
        coordinatorCalendarInstance.render();
        return;
    }

    if (typeof FullCalendar === 'undefined') {
        calendarEl.innerHTML = '<p style="color:#ef4444;text-align:center;">Thư viện FullCalendar chưa sẵn sàng.</p>';
        return;
    }

    coordinatorCalendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'vi',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hôm nay',
            month: 'Tháng',
            week: 'Tuần',
            day: 'Ngày'
        },
        events: async function(fetchInfo, successCallback, failureCallback) {
            try {
                const res = await fetchAPI('/api/v1/events/calendar');
                if (res.ok) {
                    const data = await res.json();
                    const list = data.content || data || [];
                    const formatted = list.map(ev => ({
                        id: String(ev.eventId),
                        title: `${ev.eventName || 'Sự kiện'} (${(ev.venue && ev.venue.venueName) || ev.venueName || 'Sảnh'})`,
                        start: ev.startAt || ev.startTime,
                        end: ev.endAt || ev.endTime,
                        backgroundColor: ev.status === 'COMPLETED' ? '#059669' : ev.status === 'IN_PROGRESS' ? '#d97706' : '#0284c7',
                        borderColor: 'transparent'
                    }));
                    successCallback(formatted);
                } else {
                    successCallback([]);
                }
            } catch (err) {
                console.warn('Calendar events load error:', err);
                successCallback([]);
            }
        },
        eventClick: function(info) {
            alert(`🎉 Thông tin Sự kiện:\nTiêu đề: ${info.event.title}\nBắt đầu: ${info.event.start ? info.event.start.toLocaleString('vi-VN') : '---'}`);
        }
    });

    coordinatorCalendarInstance.render();
}

window.refreshCoordinatorCalendar = function() {
    if (coordinatorCalendarInstance) {
        coordinatorCalendarInstance.refetchEvents();
    } else {
        initCoordinatorCalendar();
    }
};

// ==========================================
// 4. TAB 3: CHECKLIST SOP TIÊU CHUẨN
// ==========================================
function renderChecklist() {
    const container = document.getElementById('checklistItemsContainer');
    if (!container) return;

    container.innerHTML = coordinatorChecklist.map((item, index) => {
        return `
            <label class="checklist-item ${item.done ? 'done' : ''}" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;cursor:pointer;">
                <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleChecklistTask(${index})" style="width:18px;height:18px;cursor:pointer;" />
                <span style="font-size:0.92rem;color:#334155;line-height:1.4;">${escapeHtml(item.text)}</span>
            </label>
        `;
    }).join('');

    updateChecklistMetrics();
}

window.toggleChecklistTask = function(index) {
    if (coordinatorChecklist[index]) {
        coordinatorChecklist[index].done = !coordinatorChecklist[index].done;
        renderChecklist();
    }
};

window.addNewChecklistItem = function() {
    const input = document.getElementById('newChecklistInput');
    if (!input || !input.value.trim()) return;

    coordinatorChecklist.push({
        text: `${coordinatorChecklist.length + 1}. ${input.value.trim()}`,
        done: false
    });
    input.value = '';
    renderChecklist();
};

window.resetChecklist = function() {
    coordinatorChecklist = [...defaultChecklist];
    renderChecklist();
};

function updateChecklistMetrics() {
    const total = coordinatorChecklist.length;
    const doneCount = coordinatorChecklist.filter(t => t.done).length;
    const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    const ratioEl = document.getElementById('tasksDoneRatio');
    const percentEl = document.getElementById('checklistProgressPercent');
    const badgeEl = document.getElementById('checklistBadge');

    if (ratioEl) ratioEl.textContent = `${doneCount}/${total} xong`;
    if (percentEl) percentEl.textContent = `${percent}%`;

    if (badgeEl) {
        if (percent === 100) {
            badgeEl.textContent = '✓ Hoàn tất 100%';
            badgeEl.style.background = '#dcfce7';
            badgeEl.style.color = '#15803d';
        } else {
            badgeEl.textContent = `Đang chuẩn bị (${percent}%)`;
            badgeEl.style.background = '#ecfdf5';
            badgeEl.style.color = '#059669';
        }
    }
}

// ==========================================
// 5. TAB 4: SƠ ĐỒ SẢNH TIỆC (VENUES STATUS)
// ==========================================
async function loadCoordinatorVenues() {
    const grid = document.getElementById('coordVenuesGrid');
    if (!grid) return;

    try {
        const response = await fetchAPI('/api/v1/venues?page=0&size=20');
        if (!response.ok) {
            grid.innerHTML = '<p style="color:#ef4444;">Không thể tải danh sách sảnh tiệc.</p>';
            return;
        }

        const data = await response.json();
        cachedCoordinatorVenues = data.content || data || [];

        if (cachedCoordinatorVenues.length === 0) {
            grid.innerHTML = '<p style="color:#64748b;">Chưa có sảnh tiệc nào trong hệ thống.</p>';
            return;
        }

        grid.innerHTML = cachedCoordinatorVenues.map(v => {
            const isAvail = v.status === 'AVAILABLE';
            const statusTag = isAvail
                ? '<span class="summary-pill active">🟢 Sẵn sàng đón khách</span>'
                : `<span class="summary-pill" style="background:#fef3c7;color:#b45309;">${v.status || 'Đang bảo trì'}</span>`;

            return `
                <div class="card" style="background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:1.5rem;border-left:4px solid #087f82;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                        <h3 style="margin:0;font-size:1.15rem;color:#0f172a;">🏛️ ${escapeHtml(v.venueName || 'Sảnh tiệc')}</h3>
                        ${statusTag}
                    </div>
                    <p style="font-size:0.85rem;color:#64748b;margin:0 0 12px 0;">📍 ${escapeHtml(v.address || 'Tầng 1 - Khu trung tâm')}</p>
                    <div style="background:#f8fafc;padding:10px;border-radius:6px;font-size:0.875rem;line-height:1.7;margin-bottom:12px;">
                        <div>👥 <strong>Sức chứa:</strong> ${v.minCapacity || 100} - ${v.maxCapacity || 500} khách</div>
                        <div>💰 <strong>Đơn giá thuê:</strong> ${v.rentalPrice ? Number(v.rentalPrice).toLocaleString('vi-VN') + ' đ' : 'Thỏa thuận'}</div>
                    </div>
                    <button onclick="alert('Đã kiểm tra tín hiệu kỹ thuật sảnh [${escapeHtml(v.venueName)}]: Hệ thống âm thanh, ánh sáng & máy lạnh hoạt động 100%')" class="btn btn-outline" style="width:100%;padding:8px;font-size:0.85rem;">
                        ⚡ Test âm thanh & ánh sáng sảnh
                    </button>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Error loading venues:', err);
        grid.innerHTML = '<p style="color:#ef4444;">Lỗi kết nối khi tải sảnh tiệc.</p>';
    }
}
