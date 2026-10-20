package com.evmanager.contracts.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Schema(description = "Yêu cầu tạo mới hoặc cập nhật hợp đồng dịch vụ sự kiện")
public class ContractRequest {
    @NotNull(message = "Customer ID is required")
    @Schema(description = "ID khách hàng đứng tên hợp đồng", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long customerId;

    @NotNull(message = "Event ID is required")
    @Schema(description = "ID sự kiện tổ chức", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long eventId;

    @Min(value = 0, message = "Table count cannot be negative")
    @Schema(description = "Số lượng bàn tiệc chính thức", example = "20")
    private Integer tableCount = 0;

    @Min(value = 0, message = "Reserve table count cannot be negative")
    @Schema(description = "Số lượng bàn tiệc dự phòng", example = "2")
    private Integer reserveTableCount = 0;

    @Schema(description = "ID thực đơn tiệc (nếu có)", example = "1")
    private Long menuId;

    @Schema(description = "Danh sách thực đơn chi tiết cho từng loại bàn")
    private List<ContractMenuRequest> menus;

    @NotNull(message = "Contract date is required")
    @Schema(description = "Ngày ký hợp đồng", example = "2026-10-20", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate contractDate;

    @Schema(description = "Danh sách ID các dịch vụ đi kèm được chọn", example = "[1, 2, 3]")
    private List<Long> serviceIds;

    @Min(value = 0, message = "Discount percent cannot be negative")
    @Schema(description = "Tỷ lệ chiết khấu (%)", example = "5.0")
    private java.math.BigDecimal discountPercent;

    @Min(value = 0, message = "Voucher amount cannot be negative")
    @Schema(description = "Số tiền giảm giá voucher (VNĐ)", example = "500000")
    private java.math.BigDecimal voucherAmount;

    @Min(value = 0, message = "VAT percent cannot be negative")
    @Schema(description = "Tỷ lệ thuế VAT (%)", example = "8.0")
    private java.math.BigDecimal vatPercent;

    @Min(value = 0, message = "Deposit amount cannot be negative")
    @Schema(description = "Số tiền đặt cọc lần 1 (VNĐ)", example = "10000000")
    private java.math.BigDecimal depositAmount;
}
