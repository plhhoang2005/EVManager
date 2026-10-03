/**
 * EVManager - Module Lịch Sự Kiện & Lịch Sảnh (calendar.js)
 * Tích hợp FullCalendar v6 hiển thị ca tiệc sảnh theo tháng và tuần
 * Đồng bộ với Backend API /api/v1/events/calendar và dữ liệu hợp đồng tiệc cưới EVManager
 */

let fullCalendarInstance = null;

// Chuyển đổi dữ liệu Hợp đồng thành Event cho FullCalendar
function formatContractsToCalendarEvents(contractsList) {
    const hallColors = {
        'S01': '#087f82', // Kim Cương - Teal
        'S02': '#d9763d', // Vàng - Cam
        'S03': '#7865a7', // Bạch Kim - Tím
        'S04': '#2563eb', // Ngọc Trai - Xanh Dương
        'S05': '#dc2626'  // Ruby - Đỏ
    };

    return contractsList.map(c => {
        const dateStr = c.weddingDate;
        const isLunch = c.session === 'Trưa';
        const start = isLunch ? `${dateStr}T10:00:00` : `${dateStr}T17:00:00`;
        const end = isLunch ? `${dateStr}T14:00:00` : `${dateStr}T21:00:00`;
        const color = hallColors[c.hallId] || '#087f82';

        return {
            id: c.contractId,
            title: `[${c.hallName || 'Sảnh'}] ${c.customerName} (${c.tables} bàn)`,
            start: start,
            end: end,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
                contractId: c.contractId,
                hallName: c.hallName,
                customerName: c.customerName,
                phone: c.phone,
                tables: c.tables,
                session: c.session,
                menuName: c.menuName,
                status: c.status
            }
        };
    });
}

// Lấy danh sách lịch tiệc từ Backend API /api/v1/events/calendar
async function fetchCalendarEvents(startStr, endStr) {
    try {
        const startIso = startStr ? new Date(startStr).toISOString() : new Date(Date.now() - 30 * 86400000).toISOString();
        const endIso = endStr ? new Date(endStr).toISOString() : new Date(Date.now() + 60 * 86400000).toISOString();

        const response = await fetchAPI(`/api/v1/events/calendar?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data.map(ev => ({
                    id: ev.id,
                    title: ev.title,
                    start: ev.start,
                    end: ev.end,
                    backgroundColor: '#087f82',
                    borderColor: '#087f82',
                    extendedProps: ev.extendedProps || {}
                }));
            }
        }
    } catch (e) {
        console.warn("Backend /api/v1/events/calendar offline, nạp từ hợp đồng tiệc:", e.message);
    }

    // Fallback: Lấy từ danh sách hợp đồng tiệc cưới đang lưu trong localStorage
    const savedContracts = localStorage.getItem('ev_contracts');
    if (savedContracts) {
        try {
            const contracts = JSON.parse(savedContracts);
            return formatContractsToCalendarEvents(contracts);
        } catch (err) {}
    }

    // Nếu chưa có, lấy từ BA Mock Data contracts
    if (typeof BA_MOCK_DATA !== 'undefined' && BA_MOCK_DATA.contracts) {
        return formatContractsToCalendarEvents(BA_MOCK_DATA.contracts);
    }

    return [];
}

async function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    if (fullCalendarInstance) {
        fullCalendarInstance.destroy();
    }

    const eventsData = await fetchCalendarEvents();

    fullCalendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'vi',
        timeZone: 'Asia/Ho_Chi_Minh',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        buttonText: {
            today: 'Hôm nay',
            month: 'Tháng',
            week: 'Tuần'
        },
        events: eventsData,
        eventClick: function(info) {
            const props = info.event.extendedProps || {};
            alert(
                `🎉 CHI TIẾT LỊCH TIỆC CƯỚI:\n` +
                `------------------------------------\n` +
                `• Mã HĐ: ${props.contractId || info.event.id}\n` +
                `• Khách hàng: ${props.customerName || 'N/A'}\n` +
                `• Sảnh tổ chức: ${props.hallName || 'Chưa rõ'}\n` +
                `• Ca tiệc: Ca ${props.session || 'Tối'} (${info.event.start ? info.event.start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''})\n` +
                `• Quy mô: ${props.tables || 0} bàn\n` +
                `• Thực đơn: ${props.menuName || 'N/A'}\n` +
                `• Trạng thái: ${props.status || 'Đã xác nhận'}`
            );
        }
    });

    fullCalendarInstance.render();
}

window.refreshFullCalendar = async function() {
    if (!fullCalendarInstance) {
        await initCalendar();
        return;
    }
    const eventsData = await fetchCalendarEvents();
    fullCalendarInstance.removeAllEvents();
    fullCalendarInstance.addEventSource(eventsData);
};

document.addEventListener('DOMContentLoaded', function() {
    // Kích hoạt khi vào tab calendar
    setTimeout(initCalendar, 500);
});