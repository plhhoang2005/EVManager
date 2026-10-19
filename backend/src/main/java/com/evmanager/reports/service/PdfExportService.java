package com.evmanager.reports.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractMenuEntity;
import com.evmanager.contracts.model.ContractServiceEntity;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.model.Customer;
import com.evmanager.events.model.Event;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.UserRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfExportService {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DecimalFormat CURRENCY_FORMAT;

    static {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.getDefault());
        symbols.setGroupingSeparator('.');
        symbols.setDecimalSeparator(',');
        CURRENCY_FORMAT = new DecimalFormat("#,##0", symbols);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> getContractPdfResponse(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + contractId));

        checkOwnership(contract);

        byte[] pdfBytes = generateContractPdfBytes(contract);

        String rawCode = contract.getContractCode() != null ? contract.getContractCode() : String.valueOf(contractId);
        String safeCode = rawCode.replaceAll("[^a-zA-Z0-9_-]", "_");
        String filename = "HopDong_" + safeCode + ".pdf";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @Transactional(readOnly = true)
    public byte[] generateContractPdf(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + contractId));

        checkOwnership(contract);
        return generateContractPdfBytes(contract);
    }

    public byte[] generateContractPdfBytes(Contract contract) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 40, 40);
            PdfWriter writer = PdfWriter.getInstance(document, out);

            // Footer event
            String contractCode = contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId();
            writer.setPageEvent(new ContractPageFooter(contractCode));

            document.open();

            BaseFont baseFont = getBaseFont();
            Font titleFont = new Font(baseFont, 15, Font.BOLD, new Color(30, 58, 138));
            Font subTitleFont = new Font(baseFont, 10, Font.ITALIC, new Color(75, 85, 99));
            Font sectionFont = new Font(baseFont, 11, Font.BOLD, new Color(31, 41, 55));
            Font boldFont = new Font(baseFont, 9, Font.BOLD, new Color(31, 41, 55));
            Font normalFont = new Font(baseFont, 9, Font.NORMAL, new Color(55, 65, 81));
            Font smallItalicFont = new Font(baseFont, 8, Font.ITALIC, new Color(107, 114, 128));
            Font tableHeaderFont = new Font(baseFont, 9, Font.BOLD, Color.WHITE);

            // 1. Header Banner Table (Company on Left, National Motto on Right)
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{55f, 45f});
            headerTable.setSpacingAfter(10f);

            // Left: Company Info
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            Paragraph compName = new Paragraph("EVMANAGER – TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI", boldFont);
            compName.getFont().setColor(new Color(30, 58, 138));
            leftCell.addElement(compName);
            leftCell.addElement(new Paragraph("Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh", normalFont));
            leftCell.addElement(new Paragraph("Hotline: 1900 6868 | Email: contact@evmanager.vn", normalFont));
            headerTable.addCell(leftCell);

            // Right: National Motto
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph motto1 = new Paragraph("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", boldFont);
            motto1.setAlignment(Element.ALIGN_CENTER);
            Paragraph motto2 = new Paragraph("Độc lập – Tự do – Hạnh phúc", normalFont);
            motto2.setAlignment(Element.ALIGN_CENTER);
            Paragraph mottoDivider = new Paragraph("-----------------***-----------------", smallItalicFont);
            mottoDivider.setAlignment(Element.ALIGN_CENTER);
            rightCell.addElement(motto1);
            rightCell.addElement(motto2);
            rightCell.addElement(mottoDivider);
            headerTable.addCell(rightCell);

            document.add(headerTable);

            // 2. Title & Contract Metadata
            Paragraph titlePara = new Paragraph("HỢP ĐỒNG DỊCH VỤ TỔ CHỨC TIỆC CƯỚI", titleFont);
            titlePara.setAlignment(Element.ALIGN_CENTER);
            document.add(titlePara);

            String dateStr = contract.getContractDate() != null ? contract.getContractDate().format(DATE_FORMATTER) : "N/A";
            Paragraph codePara = new Paragraph("Mã hợp đồng: " + contractCode + "  |  Ngày lập: " + dateStr + "  |  Trạng thái: " + contract.getStatus(), subTitleFont);
            codePara.setAlignment(Element.ALIGN_CENTER);
            codePara.setSpacingAfter(14f);
            document.add(codePara);

            // 3. Parties Section (Bên A & Bên B)
            Paragraph section1 = new Paragraph("I. THÔNG TIN CÁC BÊN GIAO KẾT HỢP ĐỒNG", sectionFont);
            section1.setSpacingAfter(6f);
            document.add(section1);

            PdfPTable partiesTable = new PdfPTable(2);
            partiesTable.setWidthPercentage(100);
            partiesTable.setWidths(new float[]{50f, 50f});
            partiesTable.setSpacingAfter(10f);

            // Bên A
            PdfPCell partyACell = new PdfPCell();
            partyACell.setPadding(8f);
            partyACell.setBackgroundColor(new Color(248, 250, 252));
            partyACell.setBorderColor(new Color(203, 213, 225));
            partyACell.addElement(new Paragraph("BÊN A: TRUNG TÂM TIỆC CƯỚI EVMANAGER", boldFont));
            partyACell.addElement(new Paragraph("Đại diện: Ban Giám Đốc Trung Tâm", normalFont));
            partyACell.addElement(new Paragraph("Số điện thoại: 1900 6868", normalFont));
            partyACell.addElement(new Paragraph("Email: contact@evmanager.vn", normalFont));
            partyACell.addElement(new Paragraph("Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP.HCM", normalFont));
            partiesTable.addCell(partyACell);

            // Bên B (Customer)
            Customer customer = contract.getCustomer();
            String custName = customer != null && customer.getFullName() != null ? customer.getFullName() : "N/A";
            String custPhone = customer != null && customer.getPhone() != null ? customer.getPhone() : "N/A";
            String custEmail = customer != null && customer.getEmail() != null ? customer.getEmail() : "N/A";
            String custAddr = customer != null && customer.getAddress() != null ? customer.getAddress() : "N/A";

            PdfPCell partyBCell = new PdfPCell();
            partyBCell.setPadding(8f);
            partyBCell.setBackgroundColor(new Color(248, 250, 252));
            partyBCell.setBorderColor(new Color(203, 213, 225));
            partyBCell.addElement(new Paragraph("BÊN B: KHÁCH HÀNG ĐẶT TIỆC", boldFont));
            partyBCell.addElement(new Paragraph("Họ và tên: " + custName, normalFont));
            partyBCell.addElement(new Paragraph("Số điện thoại: " + custPhone, normalFont));
            partyBCell.addElement(new Paragraph("Email: " + custEmail, normalFont));
            partyBCell.addElement(new Paragraph("Địa chỉ: " + custAddr, normalFont));
            partiesTable.addCell(partyBCell);

            document.add(partiesTable);

            // 4. Event Information
            Paragraph section2 = new Paragraph("II. THÔNG TIN TIỆC CƯỚI & SẢNH TỔ CHỨC", sectionFont);
            section2.setSpacingAfter(6f);
            document.add(section2);

            Event event = contract.getEvent();
            String eventName = event != null && event.getEventName() != null ? event.getEventName() : "N/A";
            String venueName = event != null && event.getVenue() != null && event.getVenue().getVenueName() != null ? event.getVenue().getVenueName() : "N/A";
            String timeRange = "N/A";
            if (event != null && event.getStartAt() != null) {
                timeRange = event.getStartAt().format(DATE_TIME_FORMATTER);
                if (event.getEndAt() != null) {
                    timeRange += " đến " + event.getEndAt().format(DATE_TIME_FORMATTER);
                }
            }
            int guests = event != null && event.getGuestCount() != null ? event.getGuestCount() : 0;
            int tables = contract.getTableCount() != null ? contract.getTableCount() : 0;
            int reserveTables = contract.getReserveTableCount() != null ? contract.getReserveTableCount() : 0;

            PdfPTable eventTable = new PdfPTable(2);
            eventTable.setWidthPercentage(100);
            eventTable.setWidths(new float[]{50f, 50f});
            eventTable.setSpacingAfter(10f);

            PdfPCell evCell1 = new PdfPCell();
            evCell1.setPadding(6f);
            evCell1.setBorderColor(new Color(226, 232, 240));
            evCell1.addElement(new Paragraph("Tên sự kiện / Tiệc: " + eventName, normalFont));
            evCell1.addElement(new Paragraph("Sảnh tổ chức: " + venueName, normalFont));
            evCell1.addElement(new Paragraph("Thời gian: " + timeRange, normalFont));
            eventTable.addCell(evCell1);

            PdfPCell evCell2 = new PdfPCell();
            evCell2.setPadding(6f);
            evCell2.setBorderColor(new Color(226, 232, 240));
            evCell2.addElement(new Paragraph("Số lượng khách dự kiến: " + guests + " khách", normalFont));
            evCell2.addElement(new Paragraph("Số bàn tiệc chính thức: " + tables + " bàn", normalFont));
            evCell2.addElement(new Paragraph("Số bàn tiệc dự phòng: " + reserveTables + " bàn", normalFont));
            eventTable.addCell(evCell2);

            document.add(eventTable);

            // 5. Cost Breakdown Table
            Paragraph section3 = new Paragraph("III. BẢNG KÊ CHI PHÍ DỊCH VỤ & THỰC ĐƠN TIỆC CƯỚI", sectionFont);
            section3.setSpacingAfter(6f);
            document.add(section3);

            PdfPTable costTable = new PdfPTable(5);
            costTable.setWidthPercentage(100);
            costTable.setWidths(new float[]{8f, 42f, 12f, 18f, 20f});
            costTable.setHeaderRows(1);
            costTable.setSpacingAfter(10f);

            // Table Header
            String[] headers = {"STT", "Hạng Mục Dịch Vụ / Thực Đơn", "Số Lượng", "Đơn Giá (VNĐ)", "Thành Tiền (VNĐ)"};
            for (String h : headers) {
                PdfPCell th = new PdfPCell(new Phrase(h, tableHeaderFont));
                th.setBackgroundColor(new Color(47, 85, 151));
                th.setPadding(6f);
                th.setHorizontalAlignment(Element.ALIGN_CENTER);
                th.setVerticalAlignment(Element.ALIGN_MIDDLE);
                costTable.addCell(th);
            }

            int stt = 1;
            // 1. Phí thuê sảnh
            if (event != null && event.getVenue() != null && event.getVenue().getRentalPrice() != null) {
                BigDecimal venuePrice = event.getVenue().getRentalPrice();
                addTableRow(costTable, String.valueOf(stt++), "Chi phí thuê sảnh (" + venueName + ")", "1 sảnh",
                        formatCurrency(venuePrice), formatCurrency(venuePrice), normalFont);
            }

            // 2. Thực đơn (ContractMenus)
            if (contract.getContractMenus() != null && !contract.getContractMenus().isEmpty()) {
                for (ContractMenuEntity menuEntity : contract.getContractMenus()) {
                    String menuName = menuEntity.getMenu() != null ? menuEntity.getMenu().getMenuName() : "Thực đơn tiệc";
                    int qty = menuEntity.getQuantity() != null ? menuEntity.getQuantity() : 1;
                    BigDecimal price = menuEntity.getAgreedPrice() != null ? menuEntity.getAgreedPrice() : BigDecimal.ZERO;
                    BigDecimal total = price.multiply(BigDecimal.valueOf(qty));
                    addTableRow(costTable, String.valueOf(stt++), "Thực đơn: " + menuName, qty + " bàn",
                            formatCurrency(price), formatCurrency(total), normalFont);
                }
            }

            // 3. Dịch vụ (ContractServices)
            if (contract.getContractServices() != null && !contract.getContractServices().isEmpty()) {
                for (ContractServiceEntity serviceEntity : contract.getContractServices()) {
                    String sName = serviceEntity.getService() != null ? serviceEntity.getService().getServiceName() : "Dịch vụ đi kèm";
                    int qty = serviceEntity.getQuantity() != null ? serviceEntity.getQuantity() : 1;
                    BigDecimal price = serviceEntity.getAgreedUnitPrice() != null ? serviceEntity.getAgreedUnitPrice() : BigDecimal.ZERO;
                    BigDecimal total = price.multiply(BigDecimal.valueOf(qty));
                    addTableRow(costTable, String.valueOf(stt++), "Dịch vụ: " + sName, String.valueOf(qty),
                            formatCurrency(price), formatCurrency(total), normalFont);
                }
            }

            // If no items, display default info
            if (stt == 1) {
                PdfPCell emptyCell = new PdfPCell(new Phrase("Chưa có danh mục dịch vụ chi tiết được ghi nhận", normalFont));
                emptyCell.setColspan(5);
                emptyCell.setPadding(8f);
                emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                costTable.addCell(emptyCell);
            }

            // Summary Totals Rows
            BigDecimal totalAmount = contract.getTotalAmount() != null ? contract.getTotalAmount() : BigDecimal.ZERO;
            BigDecimal depositAmount = contract.getDepositAmount() != null ? contract.getDepositAmount() : BigDecimal.ZERO;
            BigDecimal remainingAmount = totalAmount.subtract(depositAmount);
            if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
                remainingAmount = BigDecimal.ZERO;
            }

            addSummaryRow(costTable, "TỔNG GIÁ TRỊ HỢP ĐỒNG (VNĐ):", formatCurrency(totalAmount), boldFont, new Color(241, 245, 249));
            addSummaryRow(costTable, "Tiền đặt cọc theo quy định (VNĐ):", formatCurrency(depositAmount), normalFont, Color.WHITE);
            addSummaryRow(costTable, "Số tiền còn lại phải thanh toán (VNĐ):", formatCurrency(remainingAmount), boldFont, new Color(254, 242, 242));

            document.add(costTable);

            // 6. Legal Terms Section (from UC-09 Section 4)
            Paragraph section4 = new Paragraph("IV. ĐIỀU KHOẢN PHÁP LÝ HỢP ĐỒNG", sectionFont);
            section4.setSpacingAfter(4f);
            document.add(section4);

            Paragraph term1Header = new Paragraph("Điều 1. Trách nhiệm bảo quản tài sản và cơ sở vật chất sảnh tiệc:", boldFont);
            document.add(term1Header);
            Paragraph term1Body = new Paragraph(
                    "Bên B có trách nhiệm bảo quản trang thiết bị, cơ sở vật chất được bàn giao trong suốt thời gian tổ chức sự kiện. " +
                    "Mọi trường hợp hư hỏng, mất mát phát sinh do lỗi của Bên B hoặc khách mời của Bên B sẽ được bồi thường theo giá trị thiệt hại thực tế và được ghi nhận thành khoản phát sinh khi quyết toán.", normalFont);
            term1Body.setSpacingAfter(4f);
            document.add(term1Body);

            Paragraph term2Header = new Paragraph("Điều 2. Quy định đặt cọc, thanh toán và điều kiện hoàn/hủy cọc:", boldFont);
            document.add(term2Header);
            Paragraph term2Body = new Paragraph(
                    "Bên B có nghĩa vụ thanh toán đầy đủ khoản tiền đặt cọc theo thỏa thuận để giữ sảnh và dịch vụ. " +
                    "Trường hợp Bên B đơn phương hủy tiệc cưới, khoản tiền đặt cọc sẽ được xử lý theo quy định chính sách hoàn/hủy cọc của EVManager. " +
                    "Toàn bộ số tiền còn lại phải được Bên B thanh toán dứt điểm cho Bên A ngay sau khi hoàn tất tiệc cưới.", normalFont);
            term2Body.setSpacingAfter(14f);
            document.add(term2Body);

            // 7. Signatures Section
            PdfPTable signTable = new PdfPTable(2);
            signTable.setWidthPercentage(100);
            signTable.setWidths(new float[]{50f, 50f});
            signTable.setKeepTogether(true);

            PdfPCell signB = new PdfPCell();
            signB.setBorder(Rectangle.NO_BORDER);
            signB.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph signBTitle = new Paragraph("ĐẠI DIỆN BÊN B (KHÁCH HÀNG)", boldFont);
            signBTitle.setAlignment(Element.ALIGN_CENTER);
            Paragraph signBNote = new Paragraph("(Ký, ghi rõ họ tên)", smallItalicFont);
            signBNote.setAlignment(Element.ALIGN_CENTER);
            signB.addElement(signBTitle);
            signB.addElement(signBNote);
            signB.addElement(new Paragraph("\n\n\n\n", normalFont)); // Space for handwritten signature
            Paragraph signBName = new Paragraph(custName, boldFont);
            signBName.setAlignment(Element.ALIGN_CENTER);
            signB.addElement(signBName);
            signTable.addCell(signB);

            PdfPCell signA = new PdfPCell();
            signA.setBorder(Rectangle.NO_BORDER);
            signA.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph signATitle = new Paragraph("ĐẠI DIỆN BÊN A (EVMANAGER)", boldFont);
            signATitle.setAlignment(Element.ALIGN_CENTER);
            Paragraph signANote = new Paragraph("(Ký, ghi rõ họ tên và đóng dấu)", smallItalicFont);
            signANote.setAlignment(Element.ALIGN_CENTER);
            signA.addElement(signATitle);
            signA.addElement(signANote);
            signA.addElement(new Paragraph("\n\n\n\n", normalFont));
            Paragraph signAName = new Paragraph("BAN GIÁM ĐỐC", boldFont);
            signAName.setAlignment(Element.ALIGN_CENTER);
            signA.addElement(signAName);
            signTable.addCell(signA);

            document.add(signTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF for contract id {}: {}", contract.getContractId(), e.getMessage(), e);
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }

    public void generateSampleContractPdf(Path destination) {
        try {
            Contract sampleContract = createSampleContractForDesign();
            byte[] pdfBytes = generateContractPdfBytes(sampleContract);
            if (destination.getParent() != null) {
                Files.createDirectories(destination.getParent());
            }
            Files.write(destination, pdfBytes);
            log.info("Sample contract PDF generated successfully at {}", destination);
        } catch (Exception e) {
            log.error("Failed to generate sample contract PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Could not generate sample PDF: " + e.getMessage(), e);
        }
    }

    public Contract createSampleContractForDesign() {
        Contract contract = new Contract();
        contract.setContractId(101L);
        contract.setContractCode("HD-20261015-001");
        contract.setContractDate(java.time.LocalDate.of(2026, 10, 15));
        contract.setStatus("CONFIRMED");
        contract.setTableCount(30);
        contract.setReserveTableCount(3);
        contract.setTotalAmount(new BigDecimal("165000000.00"));
        contract.setDepositAmount(new BigDecimal("50000000.00"));

        Customer customer = new Customer();
        customer.setCustomerId(1L);
        customer.setFullName("Nguyễn Văn Hoàng");
        customer.setPhone("0901234567");
        customer.setEmail("hoang.nguyen@example.com");
        customer.setAddress("456 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh");
        contract.setCustomer(customer);

        Event event = new Event();
        event.setEventId(1L);
        event.setEventName("Lễ Thành Hôn Hoàng & Mai");
        event.setGuestCount(300);
        event.setStartAt(java.time.OffsetDateTime.of(2026, 10, 25, 11, 0, 0, 0, java.time.ZoneOffset.ofHours(7)));
        event.setEndAt(java.time.OffsetDateTime.of(2026, 10, 25, 14, 0, 0, 0, java.time.ZoneOffset.ofHours(7)));

        com.evmanager.venues.model.Venue venue = new com.evmanager.venues.model.Venue();
        venue.setVenueId(1L);
        venue.setVenueName("Sảnh Kim Cương Hoàng Gia");
        venue.setRentalPrice(new BigDecimal("25000000.00"));
        event.setVenue(venue);
        contract.setEvent(event);

        // Menus
        com.evmanager.menus.model.Menu menu = new com.evmanager.menus.model.Menu();
        menu.setMenuId(1L);
        menu.setMenuName("Set Menu Hoàng Gia 8 Món Cao Cấp");

        ContractMenuEntity menuEntity = new ContractMenuEntity();
        menuEntity.setContract(contract);
        menuEntity.setMenu(menu);
        menuEntity.setQuantity(30);
        menuEntity.setAgreedPrice(new BigDecimal("4000000.00")); // 120,000,000
        contract.getContractMenus().add(menuEntity);

        // Services
        com.evmanager.services.model.Service s1 = new com.evmanager.services.model.Service();
        s1.setServiceId(1L);
        s1.setServiceName("Gói Trang Trí Hoa Tươi Sảnh Cưới");

        ContractServiceEntity serviceEntity1 = new ContractServiceEntity();
        serviceEntity1.setContract(contract);
        serviceEntity1.setService(s1);
        serviceEntity1.setQuantity(1);
        serviceEntity1.setAgreedUnitPrice(new BigDecimal("12000000.00"));
        contract.getContractServices().add(serviceEntity1);

        com.evmanager.services.model.Service s2 = new com.evmanager.services.model.Service();
        s2.setServiceId(2L);
        s2.setServiceName("Âm Thanh, Ánh Sáng & Ban Nhạc Acoustic");

        ContractServiceEntity serviceEntity2 = new ContractServiceEntity();
        serviceEntity2.setContract(contract);
        serviceEntity2.setService(s2);
        serviceEntity2.setQuantity(1);
        serviceEntity2.setAgreedUnitPrice(new BigDecimal("8000000.00"));
        contract.getContractServices().add(serviceEntity2);

        return contract;
    }

    private void checkOwnership(Contract contract) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return; // Handled by security filter
        }

        boolean isStaff = auth.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_SALES") || a.getAuthority().equals("ROLE_COORDINATOR"));

        if (!isStaff) {
            // Customer role -> verify ownership to prevent IDOR
            String currentUsername = auth.getName();
            User user = userRepository.findByUsernameIgnoreCase(currentUsername).orElse(null);
            if (user == null || contract.getCustomer() == null || !isMatchingCustomer(user, contract.getCustomer())) {
                log.warn("IDOR attempt: User '{}' tried to access contract '{}'", currentUsername, contract.getContractId());
                throw new AccessDeniedException("You do not have permission to view this contract");
            }
        }
    }

    private boolean isMatchingCustomer(User user, Customer customer) {
        if (customer.getEmail() != null && user.getEmail() != null &&
                customer.getEmail().trim().equalsIgnoreCase(user.getEmail().trim())) {
            return true;
        }
        if (customer.getPhone() != null && user.getPhone() != null &&
                customer.getPhone().trim().equals(user.getPhone().trim())) {
            return true;
        }
        return false;
    }

    private BaseFont getBaseFont() {
        try (InputStream fontStream = getClass().getResourceAsStream("/fonts/Roboto-Regular.ttf")) {
            if (fontStream != null) {
                byte[] bytes = fontStream.readAllBytes();
                return BaseFont.createFont("Roboto-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, true, bytes, null);
            }
        } catch (Exception e) {
            log.warn("Could not load bundled Roboto font: {}. Trying system fallback...", e.getMessage());
        }

        // Try standard Windows/Linux fonts
        String[] fallbackPaths = {
                "C:/Windows/Fonts/arial.ttf",
                "C:/Windows/Fonts/times.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
        };
        for (String path : fallbackPaths) {
            try {
                if (Files.exists(Path.of(path))) {
                    return BaseFont.createFont(path, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                }
            } catch (Exception ignored) {}
        }

        try {
            return BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize PDF font", e);
        }
    }

    private void addTableRow(PdfPTable table, String col1, String col2, String col3, String col4, String col5, Font font) {
        PdfPCell c1 = new PdfPCell(new Phrase(col1, font));
        c1.setHorizontalAlignment(Element.ALIGN_CENTER);
        c1.setPadding(5f);

        PdfPCell c2 = new PdfPCell(new Phrase(col2, font));
        c2.setHorizontalAlignment(Element.ALIGN_LEFT);
        c2.setPadding(5f);

        PdfPCell c3 = new PdfPCell(new Phrase(col3, font));
        c3.setHorizontalAlignment(Element.ALIGN_CENTER);
        c3.setPadding(5f);

        PdfPCell c4 = new PdfPCell(new Phrase(col4, font));
        c4.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c4.setPadding(5f);

        PdfPCell c5 = new PdfPCell(new Phrase(col5, font));
        c5.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c5.setPadding(5f);

        table.addCell(c1);
        table.addCell(c2);
        table.addCell(c3);
        table.addCell(c4);
        table.addCell(c5);
    }

    private void addSummaryRow(PdfPTable table, String label, String value, Font font, Color bgColor) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setColspan(4);
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        labelCell.setPadding(6f);
        labelCell.setBackgroundColor(bgColor);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valueCell.setPadding(6f);
        valueCell.setBackgroundColor(bgColor);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "0";
        }
        return CURRENCY_FORMAT.format(amount);
    }

    private static class ContractPageFooter extends PdfPageEventHelper {
        private final String contractCode;

        public ContractPageFooter(String contractCode) {
            this.contractCode = contractCode;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footerTable = new PdfPTable(2);
            try {
                footerTable.setWidthPercentage(100);
                footerTable.setWidths(new float[]{70f, 30f});
                footerTable.setTotalWidth(document.right() - document.left());

                Font footerFont = new Font(Font.HELVETICA, 8, Font.ITALIC, new Color(156, 163, 175));

                PdfPCell leftCell = new PdfPCell(new Phrase("EVManager | Hợp đồng: " + contractCode, footerFont));
                leftCell.setBorder(Rectangle.TOP);
                leftCell.setBorderColor(new Color(229, 231, 235));
                leftCell.setPaddingTop(4f);

                PdfPCell rightCell = new PdfPCell(new Phrase("Trang " + writer.getPageNumber(), footerFont));
                rightCell.setBorder(Rectangle.TOP);
                rightCell.setBorderColor(new Color(229, 231, 235));
                rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                rightCell.setPaddingTop(4f);

                footerTable.addCell(leftCell);
                footerTable.addCell(rightCell);

                footerTable.writeSelectedRows(0, -1, document.left(), document.bottom() - 10, writer.getDirectContent());
            } catch (Exception ignored) {}
        }
    }
}
