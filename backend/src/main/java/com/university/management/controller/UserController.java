package com.university.management.controller;

import com.university.management.dto.UserDto;
import com.university.management.model.Role;
import com.university.management.model.User;
import com.university.management.model.Course;
import com.university.management.model.Announcement;
import com.university.management.repository.UserRepository;
import com.university.management.repository.CourseRepository;
import com.university.management.repository.AnnouncementRepository;
import com.university.management.repository.AttendanceRepository;
import com.university.management.repository.GradeRepository;
import com.university.management.repository.FeeStatementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private FeeStatementRepository feeStatementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::build)
                .collect(Collectors.toList());
    }

    @GetMapping("/teachers")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public List<UserDto> getTeachers() {
        return userRepository.findByRole(Role.TEACHER).stream()
                .map(UserDto::build)
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User userRequest) {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        // department is already set from the request body
        User savedUser = userRepository.save(userRequest);
        return ResponseEntity.ok(UserDto.build(savedUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            if (!user.getUsername().equals(userDetails.getUsername()) && userRepository.existsByUsername(userDetails.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            if (!user.getEmail().equals(userDetails.getEmail()) && userRepository.existsByEmail(userDetails.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }

            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            user.setDepartment(userDetails.getDepartment());
            
            if (userDetails.getPassword() != null && !userDetails.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(UserDto.build(updatedUser));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // 1. If teacher, set teacher = null for all courses they teach
            if (user.getRole() == Role.TEACHER) {
                List<Course> courses = courseRepository.findByTeacher(user);
                for (Course course : courses) {
                    course.setTeacher(null);
                    courseRepository.save(course);
                }
            }

            // 2. If student, remove from all enrolled courses (course_students join table)
            List<Course> enrolledCourses = courseRepository.findByStudentsContains(user);
            for (Course course : enrolledCourses) {
                course.getStudents().remove(user);
                courseRepository.save(course);
            }

            // 3. Delete student's attendances, grades, fee statements
            attendanceRepository.deleteByStudentId(user.getId());
            gradeRepository.deleteByStudentId(user.getId());
            feeStatementRepository.deleteByStudentId(user.getId());

            // 4. Update announcements authored by this user, set author = null
            List<Announcement> announcements = announcementRepository.findByAuthor(user);
            for (Announcement announcement : announcements) {
                announcement.setAuthor(null);
                announcementRepository.save(announcement);
            }

            // 5. Finally delete the user
            userRepository.delete(user);
            return ResponseEntity.ok("User deleted successfully!");
        }).orElse(ResponseEntity.notFound().build());
    }
}
