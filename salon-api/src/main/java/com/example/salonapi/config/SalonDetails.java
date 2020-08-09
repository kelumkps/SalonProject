package com.example.salonapi.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalonDetails {
    @Value("${salon.name}")
    private String name;

    @Value("${salon.address}")
    private String address;

    @Value("${salon.city}")
    private String city;

    @Value("${salon.state}")
    private String state;

    @Value("${salon.zipcode}")
    private String zipcode;

    @Value("${salon.phone}")
    private String phone;

    public SalonDetails clone(){
        SalonDetails salonDetails = new SalonDetails();
        salonDetails.address=address;
        salonDetails.city=city;
        salonDetails.state=state;
        salonDetails.zipcode=zipcode;
        salonDetails.phone=phone;
        salonDetails.name=name;
        return salonDetails;
    }
}
