package com.university.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "fee_statements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotBlank
    @Column(nullable = false)
    @Builder.Default
    private String academicTerm = "Fall 2026";

    @NotNull
    @Column(nullable = false)
    private Double tuitionAmount;

    @NotNull
    @Column(nullable = false)
    @Builder.Default
    private Double labFee = 150.0;

    @NotNull
    @Column(nullable = false)
    @Builder.Default
    private Double registrationFee = 100.0;

    @NotNull
    @Column(nullable = false)
    @Builder.Default
    private Double paidAmount = 0.0;

    @NotNull
    @Column(nullable = false)
    private Double balance;

    @NotBlank
    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PAID, PENDING, OVERDUE

    @NotNull
    @Column(nullable = false)
    private LocalDate dueDate;
}
