package com.example.salonapi.controller;

import com.example.salonapi.entity.Ticket;
import com.example.salonapi.repository.TicketRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Api(tags = "Salon Ticket Services")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketRepository ticketRepository;

    @ApiOperation(value = "VerifyTicketAPI")
    @GetMapping("/{ticketId}")
    public Ticket getTicketById(@PathVariable("ticketId") Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Ticket is not found"));
    }
}
