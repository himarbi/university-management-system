package com.university.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "grades", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "course_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotBlank
    @Column(nullable = false)
    private String letterGrade; // A, A-, B+, B, B-, C+, C, C-, D, F

    @NotNull
    @Min(0)
    @Max(100)
    @Column(nullable = false)
    private Double numericalScore;

    @NotNull
    @Min(0)
    @Max(4)
    @Column(nullable = false)
    private Double gpaPoint; // 4.0 for A, 3.7 for A-, etc.

    @Column(length = 500)
    private String remarks;

    public static Double calculateGpaPoint(String letterGrade) {
        if (letterGrade == null) return 0.0;
        switch (letterGrade.toUpperCase().trim()) {
            case "A": return 4.0;
            case "A-": return 3.7;
            case "B+": return 3.3;
            case "B": return 3.0;
            case "B-": return 2.7;
            case "C+": return 2.3;
            case "C": return 2.0;
            case "C-": return 1.7;
            case "D": return 1.0;
            case "F": return 0.0;
            default: return 0.0;
        }
    }
}
