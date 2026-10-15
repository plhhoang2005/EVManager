package com.evmanager.reports.service;

import com.evmanager.events.repository.EventRepository;
import com.evmanager.reports.dto.EventExportDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final EventRepository eventRepository;
    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Transactional(readOnly = true)
    public byte[] exportEventRevenueReport(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate cannot be after endDate");
        }

        OffsetDateTime startDateTime = null;
        OffsetDateTime endDateTime = null;

        if (startDate != null) {
            startDateTime = startDate.atStartOfDay(DEFAULT_ZONE).toOffsetDateTime();
        }
        if (endDate != null) {
            endDateTime = endDate.atTime(LocalTime.MAX).atZone(DEFAULT_ZONE).toOffsetDateTime();
        }

        List<EventExportDto> events = eventRepository.findEventsForExport(startDateTime, endDateTime);

        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("BaoCao_DoanhThu");
            sheet.setDisplayGridlines(true);

            // Create styles
            CellStyle companyTitleStyle = createCompanyTitleStyle(workbook);
            CellStyle reportTitleStyle = createReportTitleStyle(workbook);
            CellStyle subtitleStyle = createSubtitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyleLeft = createDataStyle(workbook, HorizontalAlignment.LEFT, null);
            CellStyle dataStyleCenter = createDataStyle(workbook, HorizontalAlignment.CENTER, null);
            CellStyle dataStyleRightMoney = createDataStyle(workbook, HorizontalAlignment.RIGHT, "#,##0");
            CellStyle totalLabelStyle = createTotalStyle(workbook, HorizontalAlignment.RIGHT, null);
            CellStyle totalValueStyle = createTotalStyle(workbook, HorizontalAlignment.RIGHT, "#,##0");

            // Row 0 (Excel 1): Company Title
            Row row0 = sheet.createRow(0);
            Cell cell0 = row0.createCell(0);
            cell0.setCellValue("EVMANAGER – TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI");
            cell0.setCellStyle(companyTitleStyle);

            // Row 1 (Excel 2): Report Title
            Row row1 = sheet.createRow(1);
            Cell cell1 = row1.createCell(0);
            cell1.setCellValue("BÁO CÁO THỐNG KÊ DANH SÁCH SỰ KIỆN VÀ DOANH THU");
            cell1.setCellStyle(reportTitleStyle);

            // Row 2 (Excel 3): Time Subtitle
            Row row2 = sheet.createRow(2);
            Cell cell2 = row2.createCell(0);
            String timeText;
            if (startDate != null && endDate != null) {
                timeText = "Thời gian thống kê: Từ ngày " + startDate.format(DATE_FORMATTER) + " đến ngày " + endDate.format(DATE_FORMATTER);
            } else if (startDate != null) {
                timeText = "Thời gian thống kê: Từ ngày " + startDate.format(DATE_FORMATTER);
            } else if (endDate != null) {
                timeText = "Thời gian thống kê: Đến ngày " + endDate.format(DATE_FORMATTER);
            } else {
                timeText = "Thời gian thống kê: Toàn bộ thời gian";
            }
            cell2.setCellValue(timeText);
            cell2.setCellStyle(subtitleStyle);

            // Row 3 (Excel 4): Table Header (Columns A to H)
            String[] headers = {
                    "STT",
                    "Mã Hợp Đồng",
                    "Tên Sự Kiện / Tiệc Cưới",
                    "Khách Hàng",
                    "Sảnh Tổ Chức",
                    "Ngày Tổ Chức",
                    "Doanh Thu (VNĐ)",
                    "Trạng Thái"
            };
            Row headerRow = sheet.createRow(3);
            headerRow.setHeightInPoints(28);
            for (int col = 0; col < headers.length; col++) {
                Cell headerCell = headerRow.createCell(col);
                headerCell.setCellValue(headers[col]);
                headerCell.setCellStyle(headerStyle);
            }

            // Data Rows start at row index 4 (Excel Row 5)
            int currentRowIndex = 4;

            if (events == null || events.isEmpty()) {
                // Empty data case
                Row emptyRow = sheet.createRow(currentRowIndex++);
                emptyRow.setHeightInPoints(22);
                Cell emptyCell = emptyRow.createCell(0);
                emptyCell.setCellValue("Không có dữ liệu sự kiện trong khoảng thời gian đã chọn");
                emptyCell.setCellStyle(dataStyleCenter);
                for (int c = 1; c < headers.length; c++) {
                    Cell cCell = emptyRow.createCell(c);
                    cCell.setCellStyle(dataStyleCenter);
                }
                sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, headers.length - 1));

                // Total Row
                Row totalRow = sheet.createRow(currentRowIndex);
                totalRow.setHeightInPoints(24);
                for (int c = 0; c < 6; c++) {
                    Cell labelCell = totalRow.createCell(c);
                    labelCell.setCellStyle(totalLabelStyle);
                }
                totalRow.getCell(0).setCellValue("TỔNG CỘNG (VNĐ)");
                sheet.addMergedRegion(new CellRangeAddress(currentRowIndex, currentRowIndex, 0, 5));

                Cell totalValueCell = totalRow.createCell(6);
                totalValueCell.setCellValue(0.0);
                totalValueCell.setCellStyle(totalValueStyle);

                Cell statusTotalCell = totalRow.createCell(7);
                statusTotalCell.setCellStyle(totalLabelStyle);
            } else {
                int firstDataRowExcel = 5; // Excel 1-based index (index 4 + 1)
                for (int i = 0; i < events.size(); i++) {
                    EventExportDto dto = events.get(i);
                    Row dataRow = sheet.createRow(currentRowIndex++);
                    dataRow.setHeightInPoints(20);

                    // Col 0 (A): STT
                    Cell cellA = dataRow.createCell(0);
                    cellA.setCellValue(i + 1);
                    cellA.setCellStyle(dataStyleCenter);

                    // Col 1 (B): Mã Hợp Đồng
                    Cell cellB = dataRow.createCell(1);
                    cellB.setCellValue(dto.getContractCode() != null ? dto.getContractCode() : "N/A");
                    cellB.setCellStyle(dataStyleCenter);

                    // Col 2 (C): Tên Sự Kiện
                    Cell cellC = dataRow.createCell(2);
                    cellC.setCellValue(dto.getEventName() != null ? dto.getEventName() : "N/A");
                    cellC.setCellStyle(dataStyleLeft);

                    // Col 3 (D): Khách Hàng
                    Cell cellD = dataRow.createCell(3);
                    cellD.setCellValue(dto.getCustomerName() != null ? dto.getCustomerName() : "N/A");
                    cellD.setCellStyle(dataStyleLeft);

                    // Col 4 (E): Sảnh Tổ Chức
                    Cell cellE = dataRow.createCell(4);
                    cellE.setCellValue(dto.getVenueName() != null ? dto.getVenueName() : "N/A");
                    cellE.setCellStyle(dataStyleLeft);

                    // Col 5 (F): Ngày Tổ Chức
                    Cell cellF = dataRow.createCell(5);
                    String dateFormatted = dto.getStartAt() != null ? dto.getStartAt().format(DATE_TIME_FORMATTER) : "N/A";
                    cellF.setCellValue(dateFormatted);
                    cellF.setCellStyle(dataStyleCenter);

                    // Col 6 (G): Doanh Thu (VNĐ) - numeric cell for formula calculation
                    Cell cellG = dataRow.createCell(6);
                    double amount = dto.getTotalAmount() != null ? dto.getTotalAmount().doubleValue() : 0.0;
                    cellG.setCellValue(amount);
                    cellG.setCellStyle(dataStyleRightMoney);

                    // Col 7 (H): Trạng Thái
                    Cell cellH = dataRow.createCell(7);
                    cellH.setCellValue(dto.getStatus() != null ? dto.getStatus() : "N/A");
                    cellH.setCellStyle(dataStyleCenter);
                }

                int lastDataRowExcel = 4 + events.size(); // Excel 1-based index of last row
                // Total Summary Row
                Row totalRow = sheet.createRow(currentRowIndex);
                totalRow.setHeightInPoints(24);
                for (int c = 0; c < 6; c++) {
                    Cell labelCell = totalRow.createCell(c);
                    labelCell.setCellStyle(totalLabelStyle);
                }
                totalRow.getCell(0).setCellValue("TỔNG CỘNG (VNĐ)");
                sheet.addMergedRegion(new CellRangeAddress(currentRowIndex, currentRowIndex, 0, 5));

                // Col G: Formula =SUM(G5:GN)
                Cell totalValueCell = totalRow.createCell(6);
                String formula = "SUM(G" + firstDataRowExcel + ":G" + lastDataRowExcel + ")";
                totalValueCell.setCellFormula(formula);
                totalValueCell.setCellStyle(totalValueStyle);

                // Col H: empty with border
                Cell statusTotalCell = totalRow.createCell(7);
                statusTotalCell.setCellStyle(totalLabelStyle);
            }

            // Auto-size columns with padding
            for (int col = 0; col < headers.length; col++) {
                sheet.autoSizeColumn(col);
                int currentWidth = sheet.getColumnWidth(col);
                sheet.setColumnWidth(col, Math.max(currentWidth + 1200, 3200));
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Failed to generate Excel report: {}", e.getMessage(), e);
            throw new RuntimeException("Error generating Excel report: " + e.getMessage(), e);
        }
    }

    private CellStyle createCompanyTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Calibri");
        font.setFontHeightInPoints((short) 13);
        font.setBold(true);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        return style;
    }

    private CellStyle createReportTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Calibri");
        font.setFontHeightInPoints((short) 16);
        font.setBold(true);
        font.setColor(IndexedColors.ROYAL_BLUE.getIndex());
        style.setFont(font);
        return style;
    }

    private CellStyle createSubtitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Calibri");
        font.setFontHeightInPoints((short) 10);
        font.setItalic(true);
        font.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setFont(font);
        return style;
    }

    private CellStyle createHeaderStyle(XSSFWorkbook workbook) {
        XSSFCellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontName("Calibri");
        font.setFontHeightInPoints((short) 11);
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);

        // Header Background: Deep Steel Blue #2F5597
        byte[] rgb = new byte[]{(byte) 47, (byte) 85, (byte) 151};
        style.setFillForegroundColor(new XSSFColor(rgb, null));
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        setBorders(style, BorderStyle.THIN, IndexedColors.GREY_40_PERCENT.getIndex());
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook, HorizontalAlignment alignment, String dataFormatString) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Calibri");
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);

        style.setAlignment(alignment);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        if (dataFormatString != null) {
            DataFormat format = workbook.createDataFormat();
            style.setDataFormat(format.getFormat(dataFormatString));
        }

        setBorders(style, BorderStyle.THIN, IndexedColors.GREY_25_PERCENT.getIndex());
        return style;
    }

    private CellStyle createTotalStyle(XSSFWorkbook workbook, HorizontalAlignment alignment, String dataFormatString) {
        XSSFCellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontName("Calibri");
        font.setFontHeightInPoints((short) 11);
        font.setBold(true);
        style.setFont(font);

        style.setAlignment(alignment);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        // Light gray fill #F2F4F7
        byte[] rgb = new byte[]{(byte) 242, (byte) 244, (byte) 247};
        style.setFillForegroundColor(new XSSFColor(rgb, null));
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.DOUBLE);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        short borderColor = IndexedColors.GREY_40_PERCENT.getIndex();
        style.setTopBorderColor(borderColor);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        style.setLeftBorderColor(borderColor);
        style.setRightBorderColor(borderColor);

        if (dataFormatString != null) {
            DataFormat format = workbook.createDataFormat();
            style.setDataFormat(format.getFormat(dataFormatString));
        }

        return style;
    }

    private void setBorders(CellStyle style, BorderStyle borderStyle, short colorIndex) {
        style.setBorderTop(borderStyle);
        style.setBorderBottom(borderStyle);
        style.setBorderLeft(borderStyle);
        style.setBorderRight(borderStyle);
        style.setTopBorderColor(colorIndex);
        style.setBottomBorderColor(colorIndex);
        style.setLeftBorderColor(colorIndex);
        style.setRightBorderColor(colorIndex);
    }
}
