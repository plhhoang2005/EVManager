package com.evmanager.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractStatusStatsDto {
    private long daCoc;       // CONFIRMED và chưa diễn ra tiệc (SCHEDULED)
    private long dangTiec;    // CONFIRMED và tiệc đang chuẩn bị / diễn ra (PREPARING, IN_PROGRESS)
    private long daThanhLy;   // COMPLETED
    private long daHuy;       // CANCELLED
}
