package com.evmanager.notifications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailSendResponse {
    private boolean success;
    private String recipient;
    private String subject;
    private String message;
    private OffsetDateTime sentAt;
}
