package com.university.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceSubmissionDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Date is required (YYYY-MM-DD)")
    private String date;

    @NotBlank(message = "Status is required (PRESENT, ABSENT, LATE, EXCUSED)")
    private String status;

    private String remarks;
}
