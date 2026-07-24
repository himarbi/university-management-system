package com.university.management.dto;

import com.university.management.model.Course;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDto {

    private Long id;

    @NotBlank(message = "Course code is required")
    @Size(min = 2, max = 15, message = "Course code must be between 2 and 15 characters")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Course code must consist of uppercase letters, numbers, or hyphens (e.g., CS-101)")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    @Size(min = 3, max = 100, message = "Course name must be between 3 and 100 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department name cannot exceed 100 characters")
    private String department;

    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 6, message = "Credits cannot exceed 6")
    private Integer credits;

    @Min(value = 1, message = "Max capacity must be at least 1")
    @Max(value = 500, message = "Max capacity cannot exceed 500")
    private Integer maxCapacity;

    private UserDto teacher;
    private Set<UserDto> students;
    private Integer studentCount;

    public static CourseDto build(Course course) {
        if (course == null) return null;

        Set<UserDto> studentDtos = null;
        if (course.getStudents() != null) {
            studentDtos = course.getStudents().stream()
                    .map(UserDto::build)
                    .collect(Collectors.toSet());
        }

        return CourseDto.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .name(course.getName())
                .description(course.getDescription())
                .department(course.getDepartment() != null ? course.getDepartment() : "Computer Science")
                .credits(course.getCredits() != null ? course.getCredits() : 3)
                .maxCapacity(course.getMaxCapacity() != null ? course.getMaxCapacity() : 30)
                .teacher(UserDto.build(course.getTeacher()))
                .students(studentDtos)
                .studentCount(course.getStudents() != null ? course.getStudents().size() : 0)
                .build();
    }
}
