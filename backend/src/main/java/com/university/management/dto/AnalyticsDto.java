package com.university.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private long totalEnrollments;
    private long totalCapacity;
    private double capacityUtilizationRate;
}
