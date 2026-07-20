package com.university.management.dto;

import com.university.management.model.Attendance;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDto {
    private Long id;
    private UserDto student;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String date;
    private String status; // PRESENT, ABSENT, LATE, EXCUSED
    private String remarks;

    public static AttendanceDto build(Attendance attendance) {
        if (attendance == null) return null;
        return AttendanceDto.builder()
                .id(attendance.getId())
                .student(UserDto.build(attendance.getStudent()))
                .courseId(attendance.getCourse().getId())
                .courseCode(attendance.getCourse().getCourseCode())
                .courseName(attendance.getCourse().getName())
                .date(attendance.getDate() != null ? attendance.getDate().toString() : null)
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .build();
    }
}
