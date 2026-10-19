package com.evmanager.contracts.controller;

import com.evmanager.reports.service.PdfExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Contract PDF", description = "Endpoints for exporting wedding party contract details to PDF")
public class ContractPdfController {

    private final PdfExportService pdfExportService;

    @GetMapping({"/api/v1/contracts/{id}/pdf", "/api/contracts/{id}/pdf"})
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES', 'CUSTOMER')")
    @Operation(summary = "Export wedding party contract to PDF format")
    public ResponseEntity<byte[]> exportContractPdf(@PathVariable("id") Long id) {
        return pdfExportService.getContractPdfResponse(id);
    }
}
