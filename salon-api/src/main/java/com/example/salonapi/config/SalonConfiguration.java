package com.example.salonapi.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties
public class SalonConfiguration {
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipcode;
    private String phone;

}
