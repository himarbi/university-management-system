package com.university.management.dto;

import com.university.management.model.Course;
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
    private String courseCode;
    private String name;
    private String description;
    private UserDto teacher;
    private Set<UserDto> students;
    private int studentCount;

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
                .teacher(UserDto.build(course.getTeacher()))
                .students(studentDtos)
                .studentCount(course.getStudents() != null ? course.getStudents().size() : 0)
                .build();
    }
}
