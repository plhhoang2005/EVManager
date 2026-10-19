package com.evmanager.reports.service;

import com.evmanager.events.repository.EventRepository;
import com.evmanager.reports.dto.EventExportDto;
import org.apache.poi.ss.usermodel.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExcelExportServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private ExcelExportService excelExportService;

    private List<EventExportDto> mockEvents;

    @BeforeEach
    void setUp() {
        mockEvents = new ArrayList<>();
        mockEvents.add(EventExportDto.builder()
                .eventId(1L)
                .contractCode("HD-202610-001")
                .eventName("Tiệc cưới Hoàng & Mai")
                .customerName("Nguyễn Văn Hoàng")
                .venueName("Sảnh Kim Cương")
                .startAt(OffsetDateTime.of(2026, 10, 15, 11, 0, 0, 0, ZoneOffset.ofHours(7)))
                .totalAmount(new BigDecimal("150000000.00"))
                .status("CONFIRMED")
                .build());

        mockEvents.add(EventExportDto.builder()
                .eventId(2L)
                .contractCode("HD-202610-002")
                .eventName("Tiệc cưới Tuấn & Lan")
                .customerName("Trần Anh Tuấn")
                .venueName("Sảnh Vàng")
                .startAt(OffsetDateTime.of(2026, 10, 16, 18, 0, 0, 0, ZoneOffset.ofHours(7)))
                .totalAmount(new BigDecimal("85000000.00"))
                .status("COMPLETED")
                .build());
    }

    @Test
    @DisplayName("TC-01: Xuất báo cáo có dữ liệu -> File XLSX hợp lệ, đúng cấu trúc, header, data và formula")
    void testExportEventRevenueReport_NormalData() throws IOException {
        when(eventRepository.findEventsForExport(any(), any())).thenReturn(mockEvents);

        byte[] bytes = excelExportService.exportEventRevenueReport(
                LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31));

        assertNotNull(bytes);
        assertTrue(bytes.length > 0);
        try {
            java.nio.file.Files.createDirectories(java.nio.file.Path.of("target"));
            java.nio.file.Files.write(java.nio.file.Path.of("target/sample_BaoCao_DoanhThu.xlsx"), bytes);
        } catch (Exception ignored) {}

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            assertNotNull(sheet, "Sheet BaoCao_DoanhThu must exist");

            // Check Row 0: Company Title
            Row row0 = sheet.getRow(0);
            assertNotNull(row0);
            assertEquals("EVMANAGER – TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI", row0.getCell(0).getStringCellValue());

            // Check Row 1: Report Title
            Row row1 = sheet.getRow(1);
            assertNotNull(row1);
            assertEquals("BÁO CÁO THỐNG KÊ DANH SÁCH SỰ KIỆN VÀ DOANH THU", row1.getCell(0).getStringCellValue());

            // Check Row 2: Period Subtitle
            Row row2 = sheet.getRow(2);
            assertNotNull(row2);
            assertTrue(row2.getCell(0).getStringCellValue().contains("01/10/2026"));
            assertTrue(row2.getCell(0).getStringCellValue().contains("31/10/2026"));

            // Check Row 3: Header Row
            Row headerRow = sheet.getRow(3);
            assertNotNull(headerRow);
            assertEquals("STT", headerRow.getCell(0).getStringCellValue());
            assertEquals("Mã Hợp Đồng", headerRow.getCell(1).getStringCellValue());
            assertEquals("Tên Sự Kiện / Tiệc Cưới", headerRow.getCell(2).getStringCellValue());
            assertEquals("Khách Hàng", headerRow.getCell(3).getStringCellValue());
            assertEquals("Sảnh Tổ Chức", headerRow.getCell(4).getStringCellValue());
            assertEquals("Ngày Tổ Chức", headerRow.getCell(5).getStringCellValue());
            assertEquals("Doanh Thu (VNĐ)", headerRow.getCell(6).getStringCellValue());
            assertEquals("Trạng Thái", headerRow.getCell(7).getStringCellValue());

            // Check Data Row 1 (Row index 4, Excel row 5)
            Row dataRow1 = sheet.getRow(4);
            assertNotNull(dataRow1);
            assertEquals(1, (int) dataRow1.getCell(0).getNumericCellValue());
            assertEquals("HD-202610-001", dataRow1.getCell(1).getStringCellValue());
            assertEquals("Tiệc cưới Hoàng & Mai", dataRow1.getCell(2).getStringCellValue());
            assertEquals("Nguyễn Văn Hoàng", dataRow1.getCell(3).getStringCellValue());
            assertEquals("Sảnh Kim Cương", dataRow1.getCell(4).getStringCellValue());
            assertEquals(150000000.0, dataRow1.getCell(6).getNumericCellValue(), 0.001);
            assertEquals("CONFIRMED", dataRow1.getCell(7).getStringCellValue());

            // Check Data Row 2 (Row index 5, Excel row 6)
            Row dataRow2 = sheet.getRow(5);
            assertNotNull(dataRow2);
            assertEquals(2, (int) dataRow2.getCell(0).getNumericCellValue());
            assertEquals("HD-202610-002", dataRow2.getCell(1).getStringCellValue());
            assertEquals(85000000.0, dataRow2.getCell(6).getNumericCellValue(), 0.001);

            // Check Total Summary Row (Row index 6, Excel row 7)
            Row totalRow = sheet.getRow(6);
            assertNotNull(totalRow);
            assertEquals("TỔNG CỘNG (VNĐ)", totalRow.getCell(0).getStringCellValue());

            Cell totalCell = totalRow.getCell(6);
            assertEquals(CellType.FORMULA, totalCell.getCellType());
            assertEquals("SUM(G5:G6)", totalCell.getCellFormula());
        }
    }

    @Test
    @DisplayName("TC-02: Báo cáo không có dữ liệu -> Không lỗi, hiển thị dòng trống thông báo, tổng cộng = 0")
    void testExportEventRevenueReport_EmptyData() throws IOException {
        when(eventRepository.findEventsForExport(any(), any())).thenReturn(Collections.emptyList());

        byte[] bytes = excelExportService.exportEventRevenueReport(
                LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31));

        assertNotNull(bytes);

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            assertNotNull(sheet);

            // Check Row 4 (Data area when empty)
            Row emptyRow = sheet.getRow(4);
            assertNotNull(emptyRow);
            assertTrue(emptyRow.getCell(0).getStringCellValue().contains("Không có dữ liệu"));

            // Check Total Row (Row index 5)
            Row totalRow = sheet.getRow(5);
            assertNotNull(totalRow);
            assertEquals("TỔNG CỘNG (VNĐ)", totalRow.getCell(0).getStringCellValue());
            assertEquals(0.0, totalRow.getCell(6).getNumericCellValue(), 0.001);
        }
    }

    @Test
    @DisplayName("TC-03: Trường hợp đúng 1 bản ghi -> Công thức SUM đúng 1 ô =SUM(G5:G5)")
    void testExportEventRevenueReport_SingleRecord() throws IOException {
        when(eventRepository.findEventsForExport(any(), any())).thenReturn(List.of(mockEvents.get(0)));

        byte[] bytes = excelExportService.exportEventRevenueReport(null, null);

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            Row totalRow = sheet.getRow(5); // row index 5 (Excel row 6)
            Cell totalCell = totalRow.getCell(6);
            assertEquals(CellType.FORMULA, totalCell.getCellType());
            assertEquals("SUM(G5:G5)", totalCell.getCellFormula());
        }
    }

    @Test
    @DisplayName("TC-04: Nhiều bản ghi (16 bản ghi) -> Công thức khớp chính xác ví dụ issue: =SUM(G5:G20)")
    void testExportEventRevenueReport_SixteenRecordsMatchesIssueExample() throws IOException {
        List<EventExportDto> sixteenEvents = new ArrayList<>();
        for (int i = 1; i <= 16; i++) {
            sixteenEvents.add(EventExportDto.builder()
                    .eventId((long) i)
                    .contractCode("HD-202610-0" + (i < 10 ? "0" + i : i))
                    .eventName("Tiệc cưới " + i)
                    .customerName("Khách hàng " + i)
                    .venueName("Sảnh " + i)
                    .startAt(OffsetDateTime.of(2026, 10, 15, 12, 0, 0, 0, ZoneOffset.ofHours(7)))
                    .totalAmount(new BigDecimal("10000000.00"))
                    .status("CONFIRMED")
                    .build());
        }
        when(eventRepository.findEventsForExport(any(), any())).thenReturn(sixteenEvents);

        byte[] bytes = excelExportService.exportEventRevenueReport(null, null);

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            // Row index 4 is Excel 5 (1st data row)
            // Row index 19 is Excel 20 (16th data row)
            // Row index 20 is Excel 21 (Total row)
            Row totalRow = sheet.getRow(20);
            assertNotNull(totalRow);
            Cell totalCell = totalRow.getCell(6);
            assertEquals(CellType.FORMULA, totalCell.getCellType());
            assertEquals("SUM(G5:G20)", totalCell.getCellFormula(),
                    "Formula must match Issue #121 specification =SUM(G5:G20)");
        }
    }

    @Test
    @DisplayName("TC-05: Giá trị tiền ghi thành cell numeric, giữ nguyên độ chính xác và định dạng số")
    void testExportEventRevenueReport_MoneyFormatting() throws IOException {
        when(eventRepository.findEventsForExport(any(), any())).thenReturn(List.of(mockEvents.get(0)));

        byte[] bytes = excelExportService.exportEventRevenueReport(null, null);

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            Row dataRow = sheet.getRow(4);
            Cell moneyCell = dataRow.getCell(6);

            assertEquals(CellType.NUMERIC, moneyCell.getCellType(), "Money cell must be numeric type");
            assertEquals(150000000.0, moneyCell.getNumericCellValue(), 0.001);

            CellStyle style = moneyCell.getCellStyle();
            assertNotNull(style);
            assertEquals(HorizontalAlignment.RIGHT, style.getAlignment());
        }
    }

    @Test
    @DisplayName("TC-06: Dữ liệu null (chưa có hợp đồng hoặc trường rỗng) -> Xử lý an toàn không crash")
    void testExportEventRevenueReport_NullFields() throws IOException {
        EventExportDto eventWithNulls = EventExportDto.builder()
                .eventId(99L)
                .contractCode(null)
                .eventName(null)
                .customerName(null)
                .venueName(null)
                .startAt(null)
                .totalAmount(null)
                .status(null)
                .build();

        when(eventRepository.findEventsForExport(any(), any())).thenReturn(List.of(eventWithNulls));

        byte[] bytes = excelExportService.exportEventRevenueReport(null, null);
        assertNotNull(bytes);

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            Row dataRow = sheet.getRow(4);

            assertEquals("N/A", dataRow.getCell(1).getStringCellValue());
            assertEquals("N/A", dataRow.getCell(2).getStringCellValue());
            assertEquals("N/A", dataRow.getCell(3).getStringCellValue());
            assertEquals("N/A", dataRow.getCell(4).getStringCellValue());
            assertEquals("N/A", dataRow.getCell(5).getStringCellValue());
            assertEquals(0.0, dataRow.getCell(6).getNumericCellValue(), 0.001);
            assertEquals("N/A", dataRow.getCell(7).getStringCellValue());
        }
    }

    @Test
    @DisplayName("TC-07: Phòng chống Formula Injection -> Chuỗi bắt đầu bằng '=' được lưu dưới dạng Text, không biến thành Formula")
    void testExportEventRevenueReport_FormulaInjectionPrevention() throws IOException {
        EventExportDto maliciousEvent = EventExportDto.builder()
                .eventId(999L)
                .contractCode("HD-001")
                .eventName("=1+1")
                .customerName("=SUM(A1:A10)")
                .venueName("@DangerousVenue")
                .startAt(OffsetDateTime.now())
                .totalAmount(new BigDecimal("1000000.00"))
                .status("SCHEDULED")
                .build();

        when(eventRepository.findEventsForExport(any(), any())).thenReturn(List.of(maliciousEvent));

        byte[] bytes = excelExportService.exportEventRevenueReport(null, null);

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            Row dataRow = sheet.getRow(4);

            Cell eventNameCell = dataRow.getCell(2);
            assertEquals(CellType.STRING, eventNameCell.getCellType(), "Must be STRING cell, not FORMULA");
            assertEquals("=1+1", eventNameCell.getStringCellValue());

            Cell customerCell = dataRow.getCell(3);
            assertEquals(CellType.STRING, customerCell.getCellType(), "Must be STRING cell, not FORMULA");
            assertEquals("=SUM(A1:A10)", customerCell.getStringCellValue());

            Cell venueCell = dataRow.getCell(4);
            assertEquals(CellType.STRING, venueCell.getCellType(), "Must be STRING cell, not FORMULA");
            assertEquals("@DangerousVenue", venueCell.getStringCellValue());

            // Only total row cell has formula
            Row totalRow = sheet.getRow(5);
            assertEquals(CellType.FORMULA, totalRow.getCell(6).getCellType());
        }
    }

    @Test
    @DisplayName("TC-10: Dữ liệu Unicode tiếng Việt có dấu được hiển thị và đọc lại nguyên vẹn")
    void testExportEventRevenueReport_VietnameseCharacters() throws IOException {
        EventExportDto vnEvent = EventExportDto.builder()
                .eventId(10L)
                .contractCode("HĐ-2026-ĐẶC-BIỆT")
                .eventName("Lễ Thành Hôn Nguyễn Văn A & Trần Thị B")
                .customerName("Ông Nguyễn Văn Cường")
                .venueName("Sảnh Bạch Kim & Ngọc Trai")
                .startAt(OffsetDateTime.now())
                .totalAmount(new BigDecimal("250000000.00"))
                .status("ĐÃ XÁC NHẬN")
                .build();

        when(eventRepository.findEventsForExport(any(), any())).thenReturn(List.of(vnEvent));

        byte[] bytes = excelExportService.exportEventRevenueReport(null, null);

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            Sheet sheet = workbook.getSheet("BaoCao_DoanhThu");
            Row dataRow = sheet.getRow(4);

            assertEquals("HĐ-2026-ĐẶC-BIỆT", dataRow.getCell(1).getStringCellValue());
            assertEquals("Lễ Thành Hôn Nguyễn Văn A & Trần Thị B", dataRow.getCell(2).getStringCellValue());
            assertEquals("Ông Nguyễn Văn Cường", dataRow.getCell(3).getStringCellValue());
            assertEquals("Sảnh Bạch Kim & Ngọc Trai", dataRow.getCell(4).getStringCellValue());
            assertEquals("ĐÃ XÁC NHẬN", dataRow.getCell(7).getStringCellValue());
        }
    }

    @Test
    @DisplayName("TC-17: Validation: startDate sau endDate -> Ném IllegalArgumentException")
    void testValidation_StartDateAfterEndDate() {
        LocalDate start = LocalDate.of(2026, 10, 31);
        LocalDate end = LocalDate.of(2026, 10, 1);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                excelExportService.exportEventRevenueReport(start, end));
        assertTrue(ex.getMessage().contains("cannot be after"));
    }
}
