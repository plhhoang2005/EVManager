/**
 * Module Lịch sự kiện (calendar.js)
 * Tích hợp FullCalendar hiển thị lịch trình sự kiện từ dữ liệu Quản trị
 */

let fullCalendarInstance = null;

// Biến mockEvents dự phòng khi Backend chưa có API Events (404)
const mockEvents = [
    { title: 'Lễ cưới Hoàng Gia - Anh Minh', start: '2026-10-15T17:30:00', backgroundColor: '#087f82', borderColor: '#087f82', extendedProps: { location: 'GEM Center, Q.1', status: 'Đã xác nhận' } },
    { title: 'Hội nghị Tech Summit 2026', start: '2026-10-20T08:00:00', backgroundColor: '#d9763d', borderColor: '#d9763d', extendedProps: { location: 'White Palace, Q. Phú Nhuận', status: 'Đang chuẩn bị' } },
    { title: 'Đại nhạc hội EDM Summer Splash', start: '2026-11-05T19:00:00', backgroundColor: '#7865a7', borderColor: '#7865a7', extendedProps: { location: 'Sân vận động QK7', status: 'Đã xác nhận' } }
];

function formatCalendarEvents(eventsList) {
    const colors = {
        'Tiệc cưới': '#087f82',
        'Hội nghị': '#d9763d',
        'Concert': '#7865a7',
        'Sinh nhật': '#2563eb'
    };

    return eventsList.map(ev => ({
        title: ev.client ? `${ev.title} (${ev.client})` : ev.title,
        start: ev.date || ev.start,
        backgroundColor: colors[ev.type] || '#087f82',
        borderColor: colors[ev.type] || '#087f82',
        extendedProps: {
            location: ev.location || 'Chưa cập nhật',
            status: ev.status || 'Đã xác nhận',
            budget: ev.budget || 0
        }
    }));
}

function getCalendarEventsFromStorage() {
    const savedEvents = localStorage.getItem('lv34_events');
    if (!savedEvents) {
        return mockEvents;
    }

    try {
        const eventsList = JSON.parse(savedEvents);
        return formatCalendarEvents(eventsList);
    } catch (e) {
        return mockEvents;
    }
}

// Gọi API lấy sự kiện với try...catch tự động kích hoạt mockEvents nếu API bị lỗi (404)
async function getCalendarEvents() {
    try {
        const response = await fetchAPI('/api/v1/events');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: API Events chưa sẵn sàng.`);
        }
        const data = await response.json();
        return formatCalendarEvents(data);
    } catch (error) {
        console.warn('Backend chưa có API Events (Lỗi 404/kết nối). Tự động kích hoạt mockEvents:', error.message);
        return getCalendarEventsFromStorage();
    }
}

async function initCalendar() {
    console.log("Đã tải module Lịch sự kiện!");

    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    if (fullCalendarInstance) {
        fullCalendarInstance.destroy();
    }

    const eventsData = await getCalendarEvents();

    fullCalendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'vi',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: eventsData,
        eventClick: function(info) {
            const loc = info.event.extendedProps.location || 'Chưa cập nhật';
            const status = info.event.extendedProps.status || 'Đã xác nhận';
            alert(`🎉 ${info.event.title}\n⏰ Thời gian: ${info.event.start ? info.event.start.toLocaleString('vi-VN') : ''}\n📍 Địa điểm: ${loc}\n📌 Trạng thái: ${status}`);
        }
    });

    fullCalendarInstance.render();
}

window.refreshFullCalendar = async function() {
    const eventsData = await getCalendarEvents();
    if (fullCalendarInstance) {
        fullCalendarInstance.removeAllEvents();
        fullCalendarInstance.addEventSource(eventsData);
    } else {
        await initCalendar();
    }
};

document.addEventListener('dashboard:ready', initCalendar);