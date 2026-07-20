package com.university.management.controller;

import com.university.management.dto.*;
import com.university.management.model.Course;
import com.university.management.model.Grade;
import com.university.management.model.Role;
import com.university.management.model.User;
import com.university.management.repository.CourseRepository;
import com.university.management.repository.GradeRepository;
import com.university.management.repository.UserRepository;
import com.university.management.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @GetMapping("/transcript")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<TranscriptDto> getMyTranscript(@RequestParam(required = false) Long studentId) {
        User currentUser = getCurrentUser();
        User targetStudent;

        if (currentUser.getRole() == Role.STUDENT) {
            targetStudent = currentUser;
        } else {
            if (studentId == null) {
                return ResponseEntity.badRequest().build();
            }
            targetStudent = userRepository.findById(studentId).orElse(null);
            if (targetStudent == null || targetStudent.getRole() != Role.STUDENT) {
                return ResponseEntity.badRequest().build();
            }
        }

        List<Grade> grades = gradeRepository.findByStudentId(targetStudent.getId());
        List<GradeDto> gradeDtos = grades.stream().map(GradeDto::build).collect(Collectors.toList());

        // Calculate GPA & Total Credits
        double totalWeightedGpaPoints = 0.0;
        int totalCredits = 0;

        for (Grade g : grades) {
            int credits = g.getCourse() != null && g.getCourse().getCredits() != null ? g.getCourse().getCredits() : 3;
            totalWeightedGpaPoints += (g.getGpaPoint() * credits);
            totalCredits += credits;
        }

        double cumulativeGpa = totalCredits > 0
                ? Math.round((totalWeightedGpaPoints / totalCredits) * 100.0) / 100.0
                : 0.0;

        TranscriptDto transcript = TranscriptDto.builder()
                .student(UserDto.build(targetStudent))
                .grades(gradeDtos)
                .totalCreditsEarned(totalCredits)
                .cumulativeGpa(cumulativeGpa)
                .build();

        return ResponseEntity.ok(transcript);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getCourseGrades(@PathVariable Long courseId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = courseOpt.get();
        User currentUser = getCurrentUser();

        if (currentUser.getRole() == Role.TEACHER) {
            if (course.getTeacher() == null || !course.getTeacher().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Error: You are not authorized to view grades for this course!");
            }
        }

        List<Grade> grades = gradeRepository.findByCourseId(courseId);
        List<GradeDto> gradeDtos = grades.stream().map(GradeDto::build).collect(Collectors.toList());
        return ResponseEntity.ok(gradeDtos);
    }

    @GetMapping("/course/{courseId}/stats")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getCourseClassStats(@PathVariable Long courseId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) return ResponseEntity.notFound().build();

        Course course = courseOpt.get();
        List<Grade> grades = gradeRepository.findByCourseId(courseId);

        if (grades.isEmpty()) {
            ClassStatsDto emptyStats = ClassStatsDto.builder()
                    .courseId(course.getId())
                    .courseCode(course.getCourseCode())
                    .courseName(course.getName())
                    .totalGraded(0)
                    .averageScore(0.0)
                    .highestScore(0.0)
                    .lowestScore(0.0)
                    .passRatePercentage(0.0)
                    .build();
            return ResponseEntity.ok(emptyStats);
        }

        double sum = 0.0;
        double max = Double.MIN_VALUE;
        double min = Double.MAX_VALUE;
        int passCount = 0;

        for (Grade g : grades) {
            double score = g.getNumericalScore() != null ? g.getNumericalScore() : 0.0;
            sum += score;
            if (score > max) max = score;
            if (score < min) min = score;
            if (!"F".equalsIgnoreCase(g.getLetterGrade())) {
                passCount++;
            }
        }

        double avg = Math.round((sum / grades.size()) * 10.0) / 10.0;
        double passRate = Math.round(((double) passCount / grades.size() * 100.0) * 10.0) / 10.0;

        ClassStatsDto stats = ClassStatsDto.builder()
                .courseId(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getName())
                .totalGraded(grades.size())
                .averageScore(avg)
                .highestScore(max == Double.MIN_VALUE ? 0.0 : max)
                .lowestScore(min == Double.MAX_VALUE ? 0.0 : min)
                .passRatePercentage(passRate)
                .build();

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/submit")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> submitGrade(@Valid @RequestBody GradeSubmissionDto submission) {
        return processGradeSubmission(submission);
    }

    @PostMapping("/submit-bulk")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> submitBulkGrades(@Valid @RequestBody List<GradeSubmissionDto> submissions) {
        List<GradeDto> savedGrades = new ArrayList<>();
        for (GradeSubmissionDto dto : submissions) {
            ResponseEntity<?> response = processGradeSubmission(dto);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() instanceof GradeDto) {
                savedGrades.add((GradeDto) response.getBody());
            }
        }
        return ResponseEntity.ok(savedGrades);
    }

    private ResponseEntity<?> processGradeSubmission(GradeSubmissionDto submission) {
        Optional<Course> courseOpt = courseRepository.findById(submission.getCourseId());
        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Course not found!");
        }
        Course course = courseOpt.get();

        User currentUser = getCurrentUser();
        if (currentUser.getRole() == Role.TEACHER) {
            if (course.getTeacher() == null || !course.getTeacher().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Error: You can only submit grades for your assigned courses!");
            }
        }

        Optional<User> studentOpt = userRepository.findById(submission.getStudentId());
        if (studentOpt.isEmpty() || studentOpt.get().getRole() != Role.STUDENT) {
            return ResponseEntity.badRequest().body("Error: Student not found or invalid!");
        }
        User student = studentOpt.get();

        Double gpaPoint = Grade.calculateGpaPoint(submission.getLetterGrade());

        Optional<Grade> existingGradeOpt = gradeRepository.findByStudentIdAndCourseId(student.getId(), course.getId());
        Grade grade;

        if (existingGradeOpt.isPresent()) {
            grade = existingGradeOpt.get();
            grade.setLetterGrade(submission.getLetterGrade().toUpperCase());
            grade.setNumericalScore(submission.getNumericalScore());
            grade.setGpaPoint(gpaPoint);
            grade.setRemarks(submission.getRemarks());
        } else {
            grade = Grade.builder()
                    .student(student)
                    .course(course)
                    .letterGrade(submission.getLetterGrade().toUpperCase())
                    .numericalScore(submission.getNumericalScore())
                    .gpaPoint(gpaPoint)
                    .remarks(submission.getRemarks())
                    .build();
        }

        Grade savedGrade = gradeRepository.save(grade);
        return ResponseEntity.ok(GradeDto.build(savedGrade));
    }
}
