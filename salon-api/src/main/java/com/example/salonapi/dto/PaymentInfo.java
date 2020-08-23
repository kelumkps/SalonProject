package com.example.salonapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.*;

@Data
@NoArgsConstructor
@ToString
public class PaymentInfo {
    @DecimalMin(value = "0", message = "Please provide Slot Id")
    private Long slotId;
    @DecimalMin(value = "0", message = "Please provide Service ID")
    private Long salonServiceDetailID;
    @NotBlank(message = "Please provide your first name")
    @Size(min = 3, message = "Please provide a valid name")
    private String firstName;
    @NotBlank(message = "Please provide your last name")
    @Size(min = 3, message = "Please provide a valid name")
    private String lastName;
    @NotBlank(message = "Please provide your email")
    @Email(message = "Please provide a valid email")
    private String email;
    @NotBlank(message = "Please provide your phone number")
    @Size(min = 10, message = "Please provide a valid phone number")
    private String phoneNumber;
}
