package com.example.salonapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SalonController {
    @GetMapping("/")
    public String home() {
        return "home";
    }
}
