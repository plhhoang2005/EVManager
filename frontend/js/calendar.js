/**
 * Module Lịch sự kiện (calendar.js)
 * Tích hợp FullCalendar hiển thị lịch trình sự kiện từ dữ liệu Quản trị & Backend
 */

let fullCalendarInstance = null;

// Biến mockEvents dự phòng khi Backend chưa có dữ liệu hoặc offline
const mockEvents = [
    { title: 'Lễ cưới Hoàng Gia - Tuấn Kiệt & Mai Phương', start: '2026-11-02T17:30:00', backgroundColor: '#e11d48', borderColor: '#e11d48', extendedProps: { location: 'Sảnh Kim Cương', status: 'PREPARING' } },
    { title: 'Hội nghị Thường Niên Doanh Nhân Trẻ TP.HCM', start: '2026-11-01T08:00:00', backgroundColor: '#0284c7', borderColor: '#0284c7', extendedProps: { location: 'Sảnh Sapphire', status: 'IN_PROGRESS' } },
    { title: 'Lễ Kỷ Niệm 10 Năm Tập Đoàn GreenTech', start: '2026-10-31T18:00:00', backgroundColor: '#7c3aed', borderColor: '#7c3aed', extendedProps: { location: 'Sảnh Ruby', status: 'COMPLETED' } }
];

function formatCalendarEvents(rawInput) {
    const list = Array.isArray(rawInput) ? rawInput : (rawInput && rawInput.content ? rawInput.content : []);
    
    return list.map(ev => {
        let title = ev.eventName || ev.title || 'Sự kiện';
        if (ev.client) title += ` (${ev.client})`;
        
        const start = ev.startAt || ev.start || ev.date;
        const end = ev.endAt || ev.end;
        const location = ev.venueName || ev.location || 'LV34 Convention Center';
        const status = ev.status || 'SCHEDULED';
        
        let bgColor = '#087f82';
        const tLower = title.toLowerCase();
        if (tLower.includes('cưới') || tLower.includes('hôn')) bgColor = '#e11d48';
        else if (tLower.includes('hội nghị') || tLower.includes('summit')) bgColor = '#0284c7';
        else if (tLower.includes('kỷ niệm') || tLower.includes('gala') || tLower.includes('party')) bgColor = '#7c3aed';
        else if (status === 'IN_PROGRESS') bgColor = '#059669';

        return {
            id: ev.eventId || ev.id,
            title: title,
            start: start,
            end: end,
            backgroundColor: bgColor,
            borderColor: bgColor,
            extendedProps: {
                location: location,
                status: status,
                guestCount: ev.guestCount || 0
            }
        };
    });
}

function getCalendarEventsFromStorage() {
    const savedEvents = localStorage.getItem('lv34_events');
    if (!savedEvents) {
        return mockEvents;
    }

    try {
        const eventsList = JSON.parse(savedEvents);
        const formatted = formatCalendarEvents(eventsList);
        return formatted.length > 0 ? formatted : mockEvents;
    } catch (e) {
        return mockEvents;
    }
}

// Gọi API lấy sự kiện với hỗ trợ cả dạng mảng và Spring Data Page
async function getCalendarEvents() {
    try {
        const response = await fetchAPI('/api/v1/events?page=0&size=100');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: API Events chưa sẵn sàng.`);
        }
        const data = await response.json();
        const formatted = formatCalendarEvents(data);
        if (formatted.length > 0) {
            return formatted;
        }
        return getCalendarEventsFromStorage();
    } catch (error) {
        console.warn('Sử dụng dữ liệu sự kiện dự phòng cho Calendar:', error.message);
        return getCalendarEventsFromStorage();
    }
}

async function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    if (fullCalendarInstance) {
        fullCalendarInstance.destroy();
    }

    const eventsData = await getCalendarEvents();

    fullCalendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'vi',
        timeZone: 'Asia/Ho_Chi_Minh',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: eventsData,
        eventClick: function(info) {
            const loc = info.event.extendedProps.location || 'Chưa cập nhật';
            const status = info.event.extendedProps.status || 'Đã xác nhận';
            const guests = info.event.extendedProps.guestCount ? `${info.event.extendedProps.guestCount} khách` : 'Chưa định';
            
            Swal.fire({
                title: '🎉 ' + info.event.title,
                html: `
                    <div style="text-align:left;line-height:1.8;padding:8px 0;font-size:0.95rem;">
                        <div><b>⏰ Bắt đầu:</b> ${info.event.start ? info.event.start.toLocaleString('vi-VN') : ''}</div>
                        <div><b>🏛️ Địa điểm:</b> ${loc}</div>
                        <div><b>👥 Quy mô:</b> ${guests}</div>
                        <div><b>📌 Trạng thái:</b> <span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:9999px;font-weight:700;font-size:0.8rem;">${status}</span></div>
                    </div>
                `,
                icon: 'info',
                confirmButtonColor: '#087f82',
                confirmButtonText: 'Đóng'
            });
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
