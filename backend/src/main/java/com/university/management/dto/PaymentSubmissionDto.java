package com.university.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentSubmissionDto {

    @NotNull(message = "Fee Statement ID is required")
    private Long statementId;

    @NotNull(message = "Payment amount is required")
    @Min(value = 1, message = "Payment amount must be at least $1")
    private Double paymentAmount;

    private String paymentMethod; // CREDIT_CARD, BANK_TRANSFER, SCHOLARSHIP
}
