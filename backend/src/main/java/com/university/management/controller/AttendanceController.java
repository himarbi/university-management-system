package com.university.management.controller;

import com.university.management.dto.AttendanceDto;
import com.university.management.dto.AttendanceSubmissionDto;
import com.university.management.model.Attendance;
import com.university.management.model.Course;
import com.university.management.model.Role;
import com.university.management.model.User;
import com.university.management.repository.AttendanceRepository;
import com.university.management.repository.CourseRepository;
import com.university.management.repository.UserRepository;
import com.university.management.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @GetMapping("/my-attendance")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<AttendanceDto>> getMyAttendance(@RequestParam(required = false) Long studentId) {
        User currentUser = getCurrentUser();
        User targetStudent;

        if (currentUser.getRole() == Role.STUDENT) {
            targetStudent = currentUser;
        } else {
            if (studentId == null) return ResponseEntity.badRequest().build();
            targetStudent = userRepository.findById(studentId).orElse(null);
            if (targetStudent == null || targetStudent.getRole() != Role.STUDENT) {
                return ResponseEntity.badRequest().build();
            }
        }

        List<Attendance> attendances = attendanceRepository.findByStudentId(targetStudent.getId());
        List<AttendanceDto> dtos = attendances.stream().map(AttendanceDto::build).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getCourseAttendance(@PathVariable Long courseId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) return ResponseEntity.notFound().build();

        Course course = courseOpt.get();
        User currentUser = getCurrentUser();

        if (currentUser.getRole() == Role.TEACHER) {
            if (course.getTeacher() == null || !course.getTeacher().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Error: You are not authorized to view attendance for this course!");
            }
        }

        List<Attendance> attendances = attendanceRepository.findByCourseId(courseId);
        List<AttendanceDto> dtos = attendances.stream().map(AttendanceDto::build).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/record")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> recordAttendance(@Valid @RequestBody AttendanceSubmissionDto dto) {
        Optional<Course> courseOpt = courseRepository.findById(dto.getCourseId());
        if (courseOpt.isEmpty()) return ResponseEntity.badRequest().body("Error: Course not found!");

        Course course = courseOpt.get();
        User currentUser = getCurrentUser();

        if (currentUser.getRole() == Role.TEACHER) {
            if (course.getTeacher() == null || !course.getTeacher().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Error: You can only record attendance for your assigned courses!");
            }
        }

        Optional<User> studentOpt = userRepository.findById(dto.getStudentId());
        if (studentOpt.isEmpty() || studentOpt.get().getRole() != Role.STUDENT) {
            return ResponseEntity.badRequest().body("Error: Student not found or invalid!");
        }
        User student = studentOpt.get();

        LocalDate attendanceDate = LocalDate.parse(dto.getDate());
        Optional<Attendance> existingOpt = attendanceRepository.findByStudentIdAndCourseIdAndDate(
                student.getId(), course.getId(), attendanceDate
        );

        Attendance attendance;
        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
            attendance.setStatus(dto.getStatus().toUpperCase());
            attendance.setRemarks(dto.getRemarks());
        } else {
            attendance = Attendance.builder()
                    .student(student)
                    .course(course)
                    .date(attendanceDate)
                    .status(dto.getStatus().toUpperCase())
                    .remarks(dto.getRemarks())
                    .build();
        }

        Attendance saved = attendanceRepository.save(attendance);
        return ResponseEntity.ok(AttendanceDto.build(saved));
    }
}
