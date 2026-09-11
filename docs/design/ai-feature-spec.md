# AI Feature Spec — LV34-001 EVManager
**Phiên bản:** v1.0  
**Ngày:** 11/09/2026  
**Người soạn:** Hoàng (PM)  
**Trạng thái:** Approved — thực hiện sau khi MVP hoàn chỉnh (Tuần 7)

---

## Tổng quan quyết định

Nhóm phân loại tính năng thông minh thành 3 tầng:

| Tầng | Tính năng | Bản chất | Ưu tiên |
|---|---|---|---|
| 🟢 Bắt buộc | Kiểm tra xung đột lịch tự động | Algorithm — không cần ML | MVP Tuần 3 |
| 🟡 Nên làm | Dự báo chi phí sự kiện | Machine Learning (Linear Regression) | Tuần 7 |
| 🔵 Bonus | Phân loại tin nhắn khách hàng | API call (Gemini/OpenAI) | Tuần 7 nếu còn thời gian |

---

## TẦNG 1 🟢 — Kiểm tra xung đột lịch tự động (Bắt buộc — Tuần 3)

### Mô tả
Khi nhân viên điều phối tạo hoặc chỉnh sửa sự kiện, hệ thống tự động kiểm tra xem khung thời gian đó có bị trùng với sự kiện khác không.

### Use Case liên quan
- UC #6: Quản lý lịch sự kiện
- UC #7: Kiểm tra xung đột lịch

### Luồng xử lý
```
Người dùng chọn ngày/giờ sự kiện
  → Backend query DB: SELECT * FROM Events WHERE date = ? AND status != 'cancelled'
  → Kiểm tra overlap: (start1 < end2) AND (end1 > start2)
  → Nếu conflict → trả về danh sách sự kiện bị trùng + gợi ý slot trống gần nhất
  → Nếu ok → cho phép lưu
```

### API endpoint
```
POST /api/events/check-conflict
Body: { date, start_time, end_time, venue_id? }
Response: {
  conflict: boolean,
  conflicting_events: [...],
  suggested_slots: [{ start, end }, ...] // 3 slot gần nhất trống
}
```

### Gợi ý slot trống
- Tìm 3 khung giờ gần nhất trong ngày còn trống (mỗi slot cách nhau ≥ 2 tiếng)
- Nếu không còn slot trong ngày → gợi ý ngày kế tiếp

### Người thực hiện
- **Phúc** (Backend): Viết API + business logic
- **Hậu** (DB): Index column date + start_time + end_time trong bảng Events
- **Nhân** (Frontend): Hiển thị conflict warning + suggested slots trong UI

### Deadline
Tuần 3 — 27/09/2026

---

## TẦNG 2 🟡 — Dự báo chi phí sự kiện (ML — Tuần 7)

### Mô tả
Khi nhân viên tư vấn tạo báo giá cho khách hàng, hệ thống gợi ý ước tính tổng chi phí dựa trên các thông tin đầu vào.

### Use Case liên quan
- UC #5: Tạo yêu cầu/báo giá
- UC #12: Báo cáo doanh thu

### Input features (X)
| Feature | Kiểu | Mô tả |
|---|---|---|
| event_type | Categorical | Cưới / Tiệc sinh nhật / Hội nghị / Khác |
| guest_count | Số | Số lượng khách |
| duration_hours | Số | Thời gian tổ chức (giờ) |
| num_services | Số | Số lượng gói dịch vụ chọn |
| month | Số 1-12 | Tháng tổ chức (mùa vụ) |
| is_weekend | Boolean | Ngày cuối tuần hay không |
| venue_type | Categorical | Nội thất / Ngoại thất / Online |

### Output (y)
- `estimated_cost`: Ước tính tổng chi phí (VND)
- `confidence_range`: Khoảng tin cậy [min, max]

### Thuật toán đề xuất
```
Bước 1: Dùng Linear Regression làm baseline
  → sklearn.linear_model.LinearRegression
  → Ưu điểm: đơn giản, giải thích được, dễ demo

Bước 2: Nếu còn thời gian, thử Random Forest
  → sklearn.ensemble.RandomForestRegressor
  → Ưu điểm: chính xác hơn, xử lý được phi tuyến
```

### Dữ liệu training
- Nguồn: Bảng Contracts + Payments + EventServices (dữ liệu seed)
- **Yêu cầu tối thiểu: ≥ 50 hợp đồng mẫu** với đầy đủ features
- Hậu cần seed đủ dữ liệu đa dạng từ Tuần 2

### Pipeline kỹ thuật
```
1. Data collection: Query từ DB → export CSV
2. Preprocessing: One-hot encoding (event_type, venue_type), normalize số
3. Train/test split: 80/20
4. Train model: LinearRegression
5. Evaluate: MAE, RMSE, R²
6. Save model: joblib.dump(model, 'cost_predictor.pkl')
7. Serve: FastAPI endpoint hoặc tích hợp vào backend chính
8. Frontend: Hiển thị ước tính + confidence range trong form báo giá
```

### API endpoint
```
POST /api/ai/predict-cost
Body: {
  event_type: "wedding",
  guest_count: 200,
  duration_hours: 6,
  num_services: 4,
  month: 10,
  is_weekend: true,
  venue_type: "indoor"
}
Response: {
  estimated_cost: 45000000,
  confidence_range: { min: 38000000, max: 52000000 },
  model_version: "v1.0",
  note: "Ước tính dựa trên 50 sự kiện tương tự"
}
```

### UI/UX
- Hiển thị trong form **Tạo báo giá** (UC #5) dưới dạng card gợi ý
- Label rõ: "Ước tính AI — chỉ mang tính tham khảo"
- Hiển thị khoảng tin cậy dạng bar
- Nút "Dùng giá này" để điền vào form

### Người thực hiện
- **Phúc** (Backend): Viết pipeline ML + API endpoint
- **Hậu** (DB): Chuẩn bị ≥50 bản seed đa dạng, viết query extract training data
- **Nhân** (Frontend): UI card dự báo chi phí trong form báo giá

### Điều kiện bắt đầu
- MVP đã hoàn chỉnh (100% Must-have xong)
- Gate 3 xác nhận không còn lỗi Critical
- Hậu đã seed ≥ 50 bản hợp đồng

### Deadline
Tuần 7 — trước 25/10/2026 (nếu điều kiện thỏa mãn)

---

## TẦNG 3 🔵 — Phân loại tin nhắn khách hàng (Bonus)

### Mô tả
Khi khách hàng gửi yêu cầu/tin nhắn, hệ thống tự động gắn nhãn loại yêu cầu để nhân viên xử lý nhanh hơn.

### Các nhãn phân loại
| Nhãn | Ví dụ |
|---|---|
| `pricing_inquiry` | "Cho tôi hỏi giá gói cưới 200 khách?" |
| `availability_check` | "Ngày 20/12 còn chỗ không?" |
| `booking_request` | "Tôi muốn đặt chỗ cho tiệc sinh nhật" |
| `complaint` | "Dịch vụ hôm qua có vấn đề..." |
| `change_request` | "Tôi muốn đổi ngày sự kiện" |
| `other` | Không thuộc nhóm nào trên |

### Cách thực hiện (đơn giản nhất)
```python
# Gọi Gemini API với few-shot prompting
import google.generativeai as genai

def classify_message(message: str) -> dict:
    prompt = f"""
    Phân loại tin nhắn khách hàng sau vào 1 trong các nhãn:
    pricing_inquiry, availability_check, booking_request, 
    complaint, change_request, other
    
    Tin nhắn: "{message}"
    
    Trả về JSON: {{"label": "...", "confidence": 0.0-1.0, "summary": "..."}}
    """
    response = model.generate_content(prompt)
    return parse_json(response.text)
```

### API endpoint
```
POST /api/ai/classify-message
Body: { message: "..." }
Response: {
  label: "pricing_inquiry",
  confidence: 0.92,
  summary: "Khách hỏi giá gói dịch vụ"
}
```

### Điều kiện thực hiện
- Chỉ làm nếu Tầng 2 (dự báo chi phí) đã xong
- Cần có Gemini API key (free tier đủ dùng)

---

## Checklist tổng hợp

### Tuần 3 (Phúc + Hậu + Nhân)
- [ ] Viết API check-conflict
- [ ] Index bảng Events
- [ ] UI hiển thị conflict warning + suggested slots
- [ ] Viết test case cho check-conflict (≥ 5 test case)

### Tuần 2 (Hậu chuẩn bị từ sớm)
- [ ] Seed ≥ 50 bản hợp đồng đa dạng (event_type, guest_count, cost...)
- [ ] Thiết kế schema đủ columns cho ML training

### Tuần 7 (nếu MVP xong)
- [ ] Extract training data từ DB
- [ ] Train LinearRegression model
- [ ] Evaluate: MAE < 5.000.000 VND, R² > 0.7
- [ ] Wrap vào API endpoint
- [ ] UI card dự báo chi phí
- [ ] (Bonus) Integrate Gemini API classify-message

---

## Quy tắc vàng

> **"Không bao giờ để AI làm trễ MVP."**  
> Nếu đến Tuần 6 mà còn lỗi Must-have chưa fix → **hủy toàn bộ AI**, tập trung vào MVP.

---
*v1.0 — LV34-001 — MAN104 — 11/09/2026*
