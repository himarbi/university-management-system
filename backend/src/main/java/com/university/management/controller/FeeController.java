package com.university.management.controller;

import com.university.management.dto.FeeStatementDto;
import com.university.management.dto.PaymentSubmissionDto;
import com.university.management.model.FeeStatement;
import com.university.management.model.Role;
import com.university.management.model.User;
import com.university.management.repository.FeeStatementRepository;
import com.university.management.repository.UserRepository;
import com.university.management.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    @Autowired
    private FeeStatementRepository feeStatementRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @GetMapping("/my-statement")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<?> getMyStatement(@RequestParam(required = false) Long studentId) {
        User currentUser = getCurrentUser();
        User targetStudent;

        if (currentUser.getRole() == Role.STUDENT) {
            targetStudent = currentUser;
        } else {
            if (studentId == null) return ResponseEntity.badRequest().body("studentId parameter is required");
            targetStudent = userRepository.findById(studentId).orElse(null);
            if (targetStudent == null || targetStudent.getRole() != Role.STUDENT) {
                return ResponseEntity.badRequest().body("Invalid student account");
            }
        }

        List<FeeStatement> statements = feeStatementRepository.findByStudentId(targetStudent.getId());
        List<FeeStatementDto> dtos = statements.stream().map(FeeStatementDto::build).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<FeeStatementDto> getAllStatements() {
        return feeStatementRepository.findAll().stream()
                .map(FeeStatementDto::build)
                .collect(Collectors.toList());
    }

    @PostMapping("/pay")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<?> makePayment(@Valid @RequestBody PaymentSubmissionDto payment) {
        Optional<FeeStatement> statementOpt = feeStatementRepository.findById(payment.getStatementId());
        if (statementOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Fee statement not found!");
        }

        FeeStatement statement = statementOpt.get();
        User currentUser = getCurrentUser();

        if (currentUser.getRole() == Role.STUDENT) {
            if (!statement.getStudent().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Error: You can only make payments on your own statement!");
            }

            // Student payments require admin verification
            statement.setPendingPaymentAmount(payment.getPaymentAmount());
            statement.setStatus("PENDING_VERIFICATION");
            FeeStatement saved = feeStatementRepository.save(statement);
            return ResponseEntity.ok(FeeStatementDto.build(saved));
        }

        // Admin payments apply immediately
        double newPaidAmount = (statement.getPaidAmount() != null ? statement.getPaidAmount() : 0.0) + payment.getPaymentAmount();
        double totalFee = (statement.getTuitionAmount() != null ? statement.getTuitionAmount() : 0.0)
                + (statement.getLabFee() != null ? statement.getLabFee() : 0.0)
                + (statement.getRegistrationFee() != null ? statement.getRegistrationFee() : 0.0);

        double newBalance = Math.max(0.0, totalFee - newPaidAmount);
        statement.setPaidAmount(newPaidAmount);
        statement.setBalance(newBalance);

        if (newBalance <= 0) {
            statement.setStatus("PAID");
        } else {
            statement.setStatus("PENDING");
        }

        FeeStatement saved = feeStatementRepository.save(statement);
        return ResponseEntity.ok(FeeStatementDto.build(saved));
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id, @RequestParam boolean approve) {
        return feeStatementRepository.findById(id).map(statement -> {
            if (!"PENDING_VERIFICATION".equalsIgnoreCase(statement.getStatus())) {
                return ResponseEntity.badRequest().body("Error: No pending payment on this statement to verify!");
            }

            double pendingAmount = statement.getPendingPaymentAmount() != null ? statement.getPendingPaymentAmount() : 0.0;

            if (approve) {
                double newPaidAmount = (statement.getPaidAmount() != null ? statement.getPaidAmount() : 0.0) + pendingAmount;
                double totalFee = (statement.getTuitionAmount() != null ? statement.getTuitionAmount() : 0.0)
                        + (statement.getLabFee() != null ? statement.getLabFee() : 0.0)
                        + (statement.getRegistrationFee() != null ? statement.getRegistrationFee() : 0.0);

                double newBalance = Math.max(0.0, totalFee - newPaidAmount);
                statement.setPaidAmount(newPaidAmount);
                statement.setBalance(newBalance);
                statement.setPendingPaymentAmount(0.0);

                if (newBalance <= 0) {
                    statement.setStatus("PAID");
                } else {
                    statement.setStatus("PENDING");
                }
            } else {
                // Rejected: reset pending payment, revert status to PENDING
                statement.setPendingPaymentAmount(0.0);
                statement.setStatus("PENDING");
            }

            FeeStatement saved = feeStatementRepository.save(statement);
            return ResponseEntity.ok(FeeStatementDto.build(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateStatement(@RequestParam Long studentId,
                                               @RequestParam(defaultValue = "1200.0") Double tuitionAmount) {
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (studentOpt.isEmpty() || studentOpt.get().getRole() != Role.STUDENT) {
            return ResponseEntity.badRequest().body("Error: Invalid student account");
        }
        User student = studentOpt.get();

        double lab = 150.0;
        double reg = 100.0;
        double total = tuitionAmount + lab + reg;

        FeeStatement statement = FeeStatement.builder()
                .student(student)
                .academicTerm("Fall 2026")
                .tuitionAmount(tuitionAmount)
                .labFee(lab)
                .registrationFee(reg)
                .paidAmount(0.0)
                .balance(total)
                .status("PENDING")
                .dueDate(LocalDate.now().plusMonths(1))
                .build();

        FeeStatement saved = feeStatementRepository.save(statement);
        return ResponseEntity.ok(FeeStatementDto.build(saved));
    }
}
