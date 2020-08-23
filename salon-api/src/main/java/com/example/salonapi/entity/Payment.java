package com.example.salonapi.entity;

import com.example.salonapi.dto.PaymentInfo;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@ToString
@EntityListeners(AuditingEntityListener.class)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long amount;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private PaymentStatus status;
    private String clientSecret;
    private String intentId;
    @CreatedDate
    private LocalDateTime created;
    @LastModifiedDate
    private LocalDateTime updated;
    @ManyToOne
    private SalonServiceDetail selectedService;
    @OneToOne
    private Slot slot;

}
