package com.evmanager.notifications.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.customers.model.Customer;
import com.evmanager.events.model.Event;
import com.evmanager.venues.model.Venue;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailTemplateService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DecimalFormat CURRENCY_FORMAT;

    static {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.getDefault());
        symbols.setGroupingSeparator('.');
        symbols.setDecimalSeparator(',');
        CURRENCY_FORMAT = new DecimalFormat("#,##0", symbols);
    }

    // ==========================================
    // 1. Contract Approved (Hợp đồng đã xác nhận/ký)
    // ==========================================

    public String buildContractApprovedSubject(Contract contract) {
        String code = contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId();
        return "[EVManager] Xác nhận hợp đồng tiệc cưới - Mã HĐ: " + code;
    }

    public String buildContractApprovedHtml(Contract contract) {
        Customer customer = contract.getCustomer();
        Event event = contract.getEvent();
        Venue venue = (event != null) ? event.getVenue() : null;

        String safeCustomerName = escape(customer != null ? customer.getFullName() : "Quý khách");
        String safeContractCode = escape(contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId());
        String safeContractDate = contract.getContractDate() != null ? contract.getContractDate().format(DATE_FORMATTER) : "N/A";
        String safeEventName = escape(event != null ? event.getEventName() : "Tiệc cưới");
        String safeVenueName = escape(venue != null ? venue.getVenueName() : "Sảnh tiệc EVManager");
        String safeEventTime = (event != null && event.getStartAt() != null) ? event.getStartAt().format(DATE_TIME_FORMATTER) : "N/A";
        int tableCount = contract.getTableCount() != null ? contract.getTableCount() : 0;
        int reserveCount = contract.getReserveTableCount() != null ? contract.getReserveTableCount() : 0;

        String totalStr = formatMoney(contract.getTotalAmount());
        String depositStr = formatMoney(contract.getDepositAmount());

        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head><meta charset="UTF-8"><title>Xác nhận hợp đồng tiệc cưới</title></head>
            <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                    <div style="background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center;">
                        <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">EVMANAGER – TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI</h1>
                        <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9;">Hotline: 1900 6868 | Email: contact@evmanager.vn</p>
                    </div>
                    <div style="padding: 24px;">
                        <h2 style="color: #1e3a8a; font-size: 18px; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">XÁC NHẬN HỢP ĐỒNG DỊCH VỤ TIỆC CƯỚI</h2>
                        <p>Kính gửi Quý khách <strong>%s</strong>,</p>
                        <p>EVManager xin chân thành cảm ơn Quý khách đã tin tưởng và lựa chọn dịch vụ của chúng tôi. Hợp đồng dịch vụ tiệc cưới của Quý khách đã được <strong>xác nhận thành công</strong> với các thông tin chi tiết như sau:</p>
                        
                        <table style="width: 100%%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                            <tr style="background-color: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; width: 40%%;">Mã hợp đồng:</td><td style="padding: 8px; border: 1px solid #e5e7eb; color: #1e3a8a; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Ngày lập:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%s</td></tr>
                            <tr style="background-color: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Sự kiện tiệc cưới:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%s</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Sảnh tổ chức:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%s</td></tr>
                            <tr style="background-color: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Thời gian khai tiệc:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%s</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Số lượng bàn:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%d chính thức (+ %d dự phòng)</td></tr>
                            <tr style="background-color: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Tổng giá trị hợp đồng:</td><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; color: #111827;">%s VNĐ</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Tiền cọc quy định:</td><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; color: #b91c1c;">%s VNĐ</td></tr>
                        </table>

                        <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">
                            <em>Lưu ý: Quý khách vui lòng hoàn tất thủ tục thanh toán tiền đặt cọc theo quy định trong hợp đồng để sảnh tiệc chính thức được khóa lịch tổ chức.</em>
                        </p>
                        <p style="margin-top: 24px;">Trân trọng,<br><strong>Ban Giám Đốc & Đội ngũ EVManager</strong></p>
                    </div>
                    <div style="background-color: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                        Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh | Website: evmanager.vn
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                safeCustomerName, safeContractCode, safeContractDate, safeEventName, safeVenueName,
                safeEventTime, tableCount, reserveCount, totalStr, depositStr
        );
    }

    public String buildContractApprovedText(Contract contract) {
        Customer customer = contract.getCustomer();
        Event event = contract.getEvent();
        Venue venue = (event != null) ? event.getVenue() : null;

        String name = customer != null ? customer.getFullName() : "Quý khách";
        String code = contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId();
        String date = contract.getContractDate() != null ? contract.getContractDate().format(DATE_FORMATTER) : "N/A";
        String eventName = event != null ? event.getEventName() : "Tiệc cưới";
        String venueName = venue != null ? venue.getVenueName() : "Sảnh tiệc EVManager";
        String time = (event != null && event.getStartAt() != null) ? event.getStartAt().format(DATE_TIME_FORMATTER) : "N/A";

        return """
            Kính gửi Quý khách %s,
            
            Hợp đồng dịch vụ tiệc cưới của Quý khách đã được XÁC NHẬN THÀNH CÔNG trên hệ thống EVManager.
            
            Thông tin hợp đồng:
            - Mã hợp đồng: %s
            - Ngày lập: %s
            - Sự kiện: %s
            - Sảnh tổ chức: %s
            - Thời gian: %s
            - Tổng giá trị hợp đồng: %s VNĐ
            - Tiền cọc quy định: %s VNĐ
            
            Quý khách vui lòng hoàn tất đặt cọc theo thỏa thuận trong hợp đồng để khóa lịch sảnh chính thức.
            
            Hotline: 1900 6868 | Email: contact@evmanager.vn
            Trân trọng,
            EVManager – Trung tâm Hội nghị & Tiệc cưới
            """.formatted(name, code, date, eventName, venueName, time, formatMoney(contract.getTotalAmount()), formatMoney(contract.getDepositAmount()));
    }

    // ==========================================
    // 2. Deposit Confirmed (Xác nhận đã nhận cọc)
    // ==========================================

    public String buildDepositConfirmedSubject(Contract contract) {
        String code = contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId();
        return "[EVManager] Xác nhận đã nhận tiền đặt cọc - Mã HĐ: " + code;
    }

    public String buildDepositConfirmedHtml(Contract contract, BigDecimal paidDeposit, String paymentMethod, String transactionCode) {
        Customer customer = contract.getCustomer();
        Event event = contract.getEvent();
        Venue venue = (event != null) ? event.getVenue() : null;

        String safeCustomerName = escape(customer != null ? customer.getFullName() : "Quý khách");
        String safeContractCode = escape(contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId());
        String safeVenueName = escape(venue != null ? venue.getVenueName() : "Sảnh tiệc EVManager");
        String safeMethod = escape(paymentMethod != null ? paymentMethod : "Tiền mặt / Chuyển khoản");
        String safeTxnCode = escape(transactionCode != null ? transactionCode : "TXN-" + System.currentTimeMillis());

        BigDecimal total = contract.getTotalAmount() != null ? contract.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal paid = paidDeposit != null ? paidDeposit : (contract.getDepositAmount() != null ? contract.getDepositAmount() : BigDecimal.ZERO);
        BigDecimal remaining = total.subtract(paid).max(BigDecimal.ZERO);

        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head><meta charset="UTF-8"><title>Xác nhận đã nhận tiền đặt cọc</title></head>
            <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                    <div style="background-color: #065f46; color: #ffffff; padding: 24px; text-align: center;">
                        <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">EVMANAGER – XÁC NHẬN ĐẶT CỌC THÀNH CÔNG</h1>
                        <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9;">Hotline: 1900 6868 | Email: contact@evmanager.vn</p>
                    </div>
                    <div style="padding: 24px;">
                        <h2 style="color: #065f46; font-size: 18px; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">PHIẾU XÁC NHẬN THU TIỀN ĐẶT CỌC</h2>
                        <p>Kính gửi Quý khách <strong>%s</strong>,</p>
                        <p>Bộ phận Kế toán EVManager xin thông báo đã <strong>nhận thành công khoản tiền đặt cọc</strong> cho hợp đồng tiệc cưới của Quý khách. Lịch sảnh tiệc <strong>%s</strong> đã được chính thức khóa thành công trên hệ thống.</p>
                        
                        <table style="width: 100%%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                            <tr style="background-color: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; width: 40%%;">Mã hợp đồng:</td><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Số tiền cọc đã thu:</td><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; color: #065f46; font-size: 16px;">%s VNĐ</td></tr>
                            <tr style="background-color: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Phương thức thanh toán:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%s</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Mã giao dịch / Biên nhận:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%s</td></tr>
                            <tr style="background-color: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Tổng giá trị hợp đồng:</td><td style="padding: 8px; border: 1px solid #e5e7eb;">%s VNĐ</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Số tiền còn lại:</td><td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; color: #b91c1c;">%s VNĐ</td></tr>
                        </table>

                        <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">
                            Số tiền còn lại sẽ được thanh toán theo tiến độ quy định trong hợp đồng khi diễn ra sự kiện. Quý khách vui lòng lưu giữ email này làm chứng từ xác nhận.
                        </p>
                        <p style="margin-top: 24px;">Trân trọng cảm ơn,<br><strong>Bộ phận Kế toán & Thu ngân EVManager</strong></p>
                    </div>
                    <div style="background-color: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                        Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh | Website: evmanager.vn
                    </div>
                </div>
            </body>
            </html>
            """.formatted(safeCustomerName, safeVenueName, safeContractCode, formatMoney(paid), safeMethod, safeTxnCode, formatMoney(total), formatMoney(remaining));
    }

    public String buildDepositConfirmedText(Contract contract, BigDecimal paidDeposit, String paymentMethod, String transactionCode) {
        Customer customer = contract.getCustomer();
        String name = customer != null ? customer.getFullName() : "Quý khách";
        String code = contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId();

        BigDecimal total = contract.getTotalAmount() != null ? contract.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal paid = paidDeposit != null ? paidDeposit : (contract.getDepositAmount() != null ? contract.getDepositAmount() : BigDecimal.ZERO);
        BigDecimal remaining = total.subtract(paid).max(BigDecimal.ZERO);

        return """
            Kính gửi Quý khách %s,
            
            EVManager xin thông báo ĐÃ NHẬN THÀNH CÔNG TIỀN ĐẶT CỌC cho hợp đồng tiệc cưới.
            
            Chi tiết xác nhận:
            - Mã hợp đồng: %s
            - Số tiền cọc đã nhận: %s VNĐ
            - Phương thức thanh toán: %s
            - Mã giao dịch: %s
            - Tổng giá trị hợp đồng: %s VNĐ
            - Số tiền còn lại: %s VNĐ
            
            Lịch sảnh tiệc của Quý khách đã chính thức được khóa thành công trên hệ thống.
            
            Trân trọng cảm ơn Quý khách!
            Bộ phận Kế toán & Thu ngân EVManager
            """.formatted(name, code, formatMoney(paid), paymentMethod, transactionCode, formatMoney(total), formatMoney(remaining));
    }

    // ==========================================
    // 3. Contract Copy With PDF Attachment
    // ==========================================

    public String buildContractCopySubject(Contract contract) {
        String code = contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId();
        return "[EVManager] Bản sao hợp đồng dịch vụ tiệc cưới - Mã HĐ: " + code;
    }

    public String buildContractCopyHtml(Contract contract) {
        Customer customer = contract.getCustomer();
        Event event = contract.getEvent();
        Venue venue = (event != null) ? event.getVenue() : null;

        String safeCustomerName = escape(customer != null ? customer.getFullName() : "Quý khách");
        String safeContractCode = escape(contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId());
        String safeVenueName = escape(venue != null ? venue.getVenueName() : "Sảnh tiệc EVManager");

        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head><meta charset="UTF-8"><title>Bản sao hợp đồng dịch vụ tiệc cưới</title></head>
            <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                    <div style="background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center;">
                        <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">EVMANAGER – TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI</h1>
                        <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9;">Hotline: 1900 6868 | Email: contact@evmanager.vn</p>
                    </div>
                    <div style="padding: 24px;">
                        <h2 style="color: #1e3a8a; font-size: 18px; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">GỬI BẢN SAO HỢP ĐỒNG ĐIỆN TỬ (ĐÍNH KÈM PDF)</h2>
                        <p>Kính gửi Quý khách <strong>%s</strong>,</p>
                        <p>EVManager xin gửi đến Quý khách bản sao hợp đồng dịch vụ tiệc cưới điện tử (định dạng PDF) cho hợp đồng <strong>%s</strong> tại sảnh <strong>%s</strong>.</p>
                        <p>Chi tiết hợp đồng, danh mục thực đơn, gói dịch vụ và các điều khoản pháp lý đính kèm chi tiết trong tệp tin PDF đính kèm theo thư này.</p>
                        <p>Quý khách vui lòng tải về và lưu giữ bản hợp đồng để tiện theo dõi trong suốt quá trình chuẩn bị và tổ chức sự kiện.</p>
                        <p style="margin-top: 24px;">Trân trọng,<br><strong>Phòng Tư Vấn & Dịch Vụ Khách Hàng EVManager</strong></p>
                    </div>
                    <div style="background-color: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                        Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh | Website: evmanager.vn
                    </div>
                </div>
            </body>
            </html>
            """.formatted(safeCustomerName, safeContractCode, safeVenueName);
    }

    public String buildContractCopyText(Contract contract) {
        Customer customer = contract.getCustomer();
        String name = customer != null ? customer.getFullName() : "Quý khách";
        String code = contract.getContractCode() != null ? contract.getContractCode() : "HD-" + contract.getContractId();

        return """
            Kính gửi Quý khách %s,
            
            EVManager xin gửi đến Quý khách bản sao hợp đồng dịch vụ tiệc cưới điện tử (Mã HĐ: %s).
            Tệp tin hợp đồng khổ A4 định dạng PDF đã được đính kèm theo email này.
            
            Mọi thắc mắc xin vui lòng liên hệ hotline: 1900 6868 hoặc email: contact@evmanager.vn.
            
            Trân trọng,
            EVManager – Trung tâm Hội nghị & Tiệc cưới
            """.formatted(name, code);
    }

    private String escape(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#39;");
    }

    private String formatMoney(BigDecimal amount) {
        if (amount == null) return "0";
        return CURRENCY_FORMAT.format(amount);
    }
}
