package com.university.management.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStatsDto {
    private Long courseId;
    private String courseCode;
    private String courseName;
    private int totalGraded;
    private double averageScore;
    private double highestScore;
    private double lowestScore;
    private double passRatePercentage;
}
