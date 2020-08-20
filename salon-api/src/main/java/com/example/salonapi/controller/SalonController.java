package com.example.salonapi.controller;

import com.example.salonapi.entity.SalonServiceDetail;
import com.example.salonapi.entity.Slot;
import com.example.salonapi.entity.SlotStatus;
import com.example.salonapi.repository.SalonServiceDetailRepository;
import com.example.salonapi.repository.SlotRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Api(tags = "Salon Service Details")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/services")
public class SalonController {
    @Autowired
    private SlotRepository slotRepository;
    @Autowired
    private SalonServiceDetailRepository salonServiceDetailRepository;

    @ApiOperation(value = "RetrieveAvailableSalonServicesAPI")
    @GetMapping("/retrieveAvailableSalonServices")
    public List<SalonServiceDetail> getAllServices() {
        return salonServiceDetailRepository.findAll();
    }

    @ApiOperation(value = "RetrieveAvailableSlotsAPI")
    @GetMapping("/retrieveAvailableSlots")
    public List<Slot> getAvailableSlots(@RequestParam(name = "serviceId") Long serviceId,
                                        @RequestParam(name = "slotFor") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate slotFor) {
        return slotRepository.findByServiceAndDate(serviceId, SlotStatus.AVAILABLE, slotFor.atStartOfDay(), slotFor.plusDays(1).atStartOfDay());
    }
}
