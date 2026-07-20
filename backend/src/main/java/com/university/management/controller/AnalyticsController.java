package com.university.management.controller;

import com.university.management.dto.AnalyticsDto;
import com.university.management.model.Course;
import com.university.management.model.Role;
import com.university.management.repository.CourseRepository;
import com.university.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<AnalyticsDto> getAnalyticsSummary() {
        long totalStudents = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .count();

        long totalTeachers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.TEACHER)
                .count();

        List<Course> courses = courseRepository.findAll();
        long totalCourses = courses.size();

        long totalEnrollments = courses.stream()
                .mapToLong(c -> c.getStudents() != null ? c.getStudents().size() : 0)
                .sum();

        long totalCapacity = courses.stream()
                .mapToLong(c -> c.getMaxCapacity() != null ? c.getMaxCapacity() : 30)
                .sum();

        double utilizationRate = totalCapacity > 0
                ? Math.round(((double) totalEnrollments / totalCapacity * 100.0) * 10.0) / 10.0
                : 0.0;

        AnalyticsDto analytics = AnalyticsDto.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalCourses(totalCourses)
                .totalEnrollments(totalEnrollments)
                .totalCapacity(totalCapacity)
                .capacityUtilizationRate(utilizationRate)
                .build();

        return ResponseEntity.ok(analytics);
    }
}
