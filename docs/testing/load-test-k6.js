import http from 'k6/http';
import { check, sleep } from 'k6';

// ==============================================================================
// KỊCH BẢN KIỂM THỬ HIỆU NĂNG HỆ THỐNG EVMANAGER (TASK QA-22 / ISSUE #153)
// Công cụ: k6 (Grafana Labs)
// Mục tiêu: Giả lập 50 người dùng đồng thời (50 VUs) tra cứu sảnh và lịch sự kiện
// Tiêu chuẩn chấp nhận: Thời gian phản hồi trung bình < 500ms, Error rate < 1%
// ==============================================================================

export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp-up: Tăng dần từ 0 lên 50 người dùng trong 10s
    { duration: '40s', target: 50 },  // Steady state: Duy trì 50 người dùng gửi request liên tục trong 40s
    { duration: '10s', target: 0 },   // Ramp-down: Giảm dần tải về 0 trong 10s
  ],
  thresholds: {
    // 1. Thời gian phản hồi trung bình phải < 500ms
    http_req_duration: ['avg<500', 'p(95)<800'],
    // 2. Tỷ lệ lỗi cho phép < 1%
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: '5s',
  };

  // 1. Kiểm thử API tra cứu sảnh khả dụng (Public Endpoint)
  const venueRes = http.get(
    `${BASE_URL}/api/v1/venues/available?date=2026-10-25&session=EVENING`,
    params
  );

  check(venueRes, {
    'Venues status is 200': (r) => r.status === 200,
    'Venues response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Nghỉ ngơi ngẫu nhiên giữa các thao tác người dùng (Pacing: 100ms - 500ms)
  sleep(0.3);

  // 2. Kiểm thử API tra cứu lịch sự kiện (Public Calendar Endpoint)
  const calendarRes = http.get(
    `${BASE_URL}/api/v1/events/calendar?start=2026-10-01T00:00:00Z&end=2026-10-31T23:59:59Z`,
    params
  );

  check(calendarRes, {
    'Calendar status is 200': (r) => r.status === 200,
    'Calendar response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(0.5);
}
