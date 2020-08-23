package com.example.salonapi.controller;

import com.example.salonapi.config.SalonDetails;
import com.example.salonapi.dto.BookingInfo;
import com.example.salonapi.dto.PaymentInfo;
import com.example.salonapi.entity.*;
import com.example.salonapi.repository.PaymentRepository;
import com.example.salonapi.repository.SalonServiceDetailRepository;
import com.example.salonapi.repository.SlotRepository;
import com.example.salonapi.repository.TicketRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.Optional;

@Api(tags = "Salon Payment Services")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private SalonDetails salonDetails;
    @Autowired
    private SlotRepository slotRepository;
    @Autowired
    private SalonServiceDetailRepository salonServiceDetailRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private TicketRepository ticketRepository;
    @Value("${stripe.publicKey}")
    private String stripePublicKey;
    @Value("${stripe.secretKey}")
    private String stripeSecretKey;

    @ApiOperation(value = "InitiatePaymentAPI")
    @PostMapping("/initiate")
    public Payment initiatingPayment(@Valid @RequestBody PaymentInfo paymentInfo) {
        Optional<SalonServiceDetail> optionalServiceDetail = salonServiceDetailRepository.findById(paymentInfo.getSalonServiceDetailID());
        if (optionalServiceDetail.isPresent()) {
            Optional<Slot> optionalSlot = slotRepository.findById(paymentInfo.getSlotId());
            if (optionalSlot.isPresent() && SlotStatus.AVAILABLE.equals(optionalSlot.get().getStatus())) {
                SalonServiceDetail serviceDetail = optionalServiceDetail.get();
                Optional<PaymentIntent> paymentIntent = createPaymentIntent(serviceDetail);
                if (paymentIntent.isPresent()) {
                    Slot slot = optionalSlot.get();
                    slot.setSelectedService(serviceDetail);
                    slot.setStatus(SlotStatus.LOCKED);
                    slot.setLockedAt(LocalDateTime.now());
                    slotRepository.save(slot);
                    return createPayment(paymentInfo, slot, serviceDetail, paymentIntent.get());
                }
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot is not found or unavailable");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SalonServiceDetail is not found");
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to initiate payment");
    }

    @ApiOperation(value = "VerifyPaymentAndConfirmSlotAPI")
    @PutMapping("/confirm/{paymentId}")
    public BookingInfo confirmPayment(@PathVariable("paymentId") Long paymentId) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            Optional<PaymentIntent> optionalPaymentIntent = retrievePaymentIntent(payment.getIntentId());
            if (optionalPaymentIntent.isPresent()) {
                PaymentIntent paymentIntent = optionalPaymentIntent.get();
                if ("succeeded".equals(paymentIntent.getStatus())) {
                    Slot slot = payment.getSlot();
                    slot.setStatus(SlotStatus.CONFIRMED);
                    slotRepository.save(slot);
                    payment.setStatus(PaymentStatus.SUCCESS);
                    paymentRepository.save(payment);
                    Ticket ticket = new Ticket();
                    ticket.setPayment(payment);
                    ticket.setTicketStatus(TicketStatus.BOOKED);
                    ticketRepository.save(ticket);
                    return new BookingInfo(ticket, salonDetails.clone());
                } else {
                    throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Payment is not yet processed, Status: " + paymentIntent.getStatus());
                }
            } else {
                throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Payment is not initiated");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment is not found");
        }
    }

    private Payment createPayment(PaymentInfo paymentInfo, Slot slot, SalonServiceDetail serviceDetail, PaymentIntent paymentIntent) {
        Payment payment = new Payment();
        payment.setEmail(paymentInfo.getEmail());
        payment.setFirstName(paymentInfo.getFirstName());
        payment.setLastName(paymentInfo.getLastName());
        payment.setPhoneNumber(paymentInfo.getPhoneNumber());
        payment.setAmount(serviceDetail.getPrice());
        payment.setSelectedService(serviceDetail);
        payment.setSlot(slot);
        payment.setIntentId(paymentIntent.getId());
        payment.setClientSecret(paymentIntent.getClientSecret());
        payment.setStatus(PaymentStatus.PENDING);
        return paymentRepository.save(payment);
    }

    private Optional<PaymentIntent> createPaymentIntent(SalonServiceDetail serviceDetail) {
        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setCurrency("cad")
                            .setAmount(serviceDetail.getPrice() * 100)
                            .build();
            return Optional.ofNullable(PaymentIntent.create(params));
        } catch (StripeException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    private Optional<PaymentIntent> retrievePaymentIntent(String intentId) {
        try {
            Stripe.apiKey = stripeSecretKey;
            return Optional.ofNullable(PaymentIntent.retrieve(intentId));
        } catch (StripeException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
}
