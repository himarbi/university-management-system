package com.university.management.dto;

import com.university.management.model.Grade;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeDto {
    private Long id;
    private UserDto student;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private String letterGrade;
    private Double numericalScore;
    private Double gpaPoint;
    private String remarks;

    public static GradeDto build(Grade grade) {
        if (grade == null) return null;
        return GradeDto.builder()
                .id(grade.getId())
                .student(UserDto.build(grade.getStudent()))
                .courseId(grade.getCourse().getId())
                .courseCode(grade.getCourse().getCourseCode())
                .courseName(grade.getCourse().getName())
                .credits(grade.getCourse().getCredits())
                .letterGrade(grade.getLetterGrade())
                .numericalScore(grade.getNumericalScore())
                .gpaPoint(grade.getGpaPoint())
                .remarks(grade.getRemarks())
                .build();
    }
}
