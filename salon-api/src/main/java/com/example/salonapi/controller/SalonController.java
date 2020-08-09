package com.example.salonapi.controller;

import com.example.salonapi.entity.SalonServiceDetail;
import com.example.salonapi.repository.SalonServiceDetailRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api(tags = "Salon Service Details")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/services")
public class SalonController {
    @Autowired
    private SalonServiceDetailRepository salonServiceDetailRepository;

    @ApiOperation(value = "RetrieveAvailableSalonServicesAPI")
    @GetMapping("/retrieveAvailableSalonServices")
    public List<SalonServiceDetail> getAllServices() {
        return salonServiceDetailRepository.findAll();
    }
}
