package com.university.management.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranscriptDto {
    private UserDto student;
    private List<GradeDto> grades;
    private int totalCreditsEarned;
    private double cumulativeGpa;
}
