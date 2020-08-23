package com.example.salonapi.dto;

import com.example.salonapi.config.SalonDetails;
import com.example.salonapi.entity.Ticket;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BookingInfo {
    private Ticket ticket;
    private SalonDetails salonDetails;
}
