package com.university.management.dto;

import com.university.management.model.FeeStatement;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeStatementDto {
    private Long id;
    private UserDto student;
    private String academicTerm;
    private Double tuitionAmount;
    private Double labFee;
    private Double registrationFee;
    private Double totalFee;
    private Double paidAmount;
    private Double balance;
    private String status;
    private String dueDate;

    public static FeeStatementDto build(FeeStatement statement) {
        if (statement == null) return null;
        double tuition = statement.getTuitionAmount() != null ? statement.getTuitionAmount() : 0.0;
        double lab = statement.getLabFee() != null ? statement.getLabFee() : 0.0;
        double reg = statement.getRegistrationFee() != null ? statement.getRegistrationFee() : 0.0;
        double total = tuition + lab + reg;

        return FeeStatementDto.builder()
                .id(statement.getId())
                .student(UserDto.build(statement.getStudent()))
                .academicTerm(statement.getAcademicTerm())
                .tuitionAmount(tuition)
                .labFee(lab)
                .registrationFee(reg)
                .totalFee(total)
                .paidAmount(statement.getPaidAmount())
                .balance(statement.getBalance())
                .status(statement.getStatus())
                .dueDate(statement.getDueDate() != null ? statement.getDueDate().toString() : null)
                .build();
    }
}
