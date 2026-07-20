package com.university.management.controller;

import com.university.management.dto.CourseDto;
import com.university.management.model.Course;
import com.university.management.model.Role;
import com.university.management.model.User;
import com.university.management.repository.CourseRepository;
import com.university.management.repository.UserRepository;
import com.university.management.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseDto::build)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> ResponseEntity.ok(CourseDto.build(course)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody CourseDto courseDto) {
        if (courseRepository.existsByCourseCode(courseDto.getCourseCode())) {
            return ResponseEntity.badRequest().body("Error: Course code is already in use!");
        }

        User teacher = null;
        if (courseDto.getTeacher() != null && courseDto.getTeacher().getId() != null) {
            Optional<User> teacherOpt = userRepository.findById(courseDto.getTeacher().getId());
            if (teacherOpt.isPresent() && teacherOpt.get().getRole() == Role.TEACHER) {
                teacher = teacherOpt.get();
            } else {
                return ResponseEntity.badRequest().body("Error: Specified teacher is invalid or not a TEACHER!");
            }
        }

        Course course = Course.builder()
                .courseCode(courseDto.getCourseCode())
                .name(courseDto.getName())
                .description(courseDto.getDescription())
                .teacher(teacher)
                .build();

        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(CourseDto.build(savedCourse));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseDto courseDto) {
        return courseRepository.findById(id).map(course -> {
            User currentUser = getCurrentUser();
            
            if (currentUser.getRole() == Role.TEACHER) {
                if (course.getTeacher() == null || !course.getTeacher().getId().equals(currentUser.getId())) {
                    return ResponseEntity.status(403).body("Error: You are not authorized to update this course!");
                }
            }

            if (currentUser.getRole() == Role.ADMIN) {
                if (!course.getCourseCode().equals(courseDto.getCourseCode()) && courseRepository.existsByCourseCode(courseDto.getCourseCode())) {
                    return ResponseEntity.badRequest().body("Error: Course code is already in use!");
                }
                course.setCourseCode(courseDto.getCourseCode());

                if (courseDto.getTeacher() != null && courseDto.getTeacher().getId() != null) {
                    Optional<User> teacherOpt = userRepository.findById(courseDto.getTeacher().getId());
                    if (teacherOpt.isPresent() && teacherOpt.get().getRole() == Role.TEACHER) {
                        course.setTeacher(teacherOpt.get());
                    } else {
                        return ResponseEntity.badRequest().body("Error: Specified teacher is invalid!");
                    }
                } else {
                    course.setTeacher(null);
                }
            }

            course.setName(courseDto.getName());
            course.setDescription(courseDto.getDescription());

            Course updatedCourse = courseRepository.save(course);
            return ResponseEntity.ok(CourseDto.build(updatedCourse));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        return courseRepository.findById(id).map(course -> {
            courseRepository.delete(course);
            return ResponseEntity.ok("Course deleted successfully!");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/enroll")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> enrollStudent(@PathVariable Long id, @RequestParam(required = false) Long studentId) {
        return courseRepository.findById(id).map(course -> {
            User studentToEnroll;
            User currentUser = getCurrentUser();

            if (currentUser.getRole() == Role.STUDENT) {
                studentToEnroll = currentUser;
            } else {
                if (studentId == null) {
                    return ResponseEntity.badRequest().body("Error: studentId query parameter is required for Admin!");
                }
                Optional<User> studentOpt = userRepository.findById(studentId);
                if (studentOpt.isEmpty() || studentOpt.get().getRole() != Role.STUDENT) {
                    return ResponseEntity.badRequest().body("Error: Student not found or invalid!");
                }
                studentToEnroll = studentOpt.get();
            }

            course.getStudents().add(studentToEnroll);
            courseRepository.save(course);

            return ResponseEntity.ok(CourseDto.build(course));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/unenroll")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<?> unenrollStudent(@PathVariable Long id, @RequestParam(required = false) Long studentId) {
        return courseRepository.findById(id).map(course -> {
            User studentToUnenroll;
            User currentUser = getCurrentUser();

            if (currentUser.getRole() == Role.STUDENT) {
                studentToUnenroll = currentUser;
            } else {
                if (studentId == null) {
                    return ResponseEntity.badRequest().body("Error: studentId query parameter is required for Admin!");
                }
                Optional<User> studentOpt = userRepository.findById(studentId);
                if (studentOpt.isEmpty() || studentOpt.get().getRole() != Role.STUDENT) {
                    return ResponseEntity.badRequest().body("Error: Student not found or invalid!");
                }
                studentToUnenroll = studentOpt.get();
            }

            course.getStudents().remove(studentToUnenroll);
            courseRepository.save(course);

            return ResponseEntity.ok(CourseDto.build(course));
        }).orElse(ResponseEntity.notFound().build());
    }
}
