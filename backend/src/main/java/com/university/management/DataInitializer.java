package com.university.management;

import com.university.management.model.*;
import com.university.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private FeeStatementRepository feeStatementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("No users found. Seeding initial data...");

            // Create Admin
            User admin = User.builder()
                    .username("admin")
                    .email("admin@university.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);

            // Create Teachers
            User teacher1 = User.builder()
                    .username("john_doe")
                    .email("john.doe@university.com")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .build();
            userRepository.save(teacher1);

            User teacher2 = User.builder()
                    .username("jane_smith")
                    .email("jane.smith@university.com")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .build();
            userRepository.save(teacher2);

            // Create Students
            User student1 = User.builder()
                    .username("alice_jones")
                    .email("alice@university.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(student1);

            User student2 = User.builder()
                    .username("bob_miller")
                    .email("bob@university.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(student2);

            // Create Courses
            Course course1 = Course.builder()
                    .courseCode("CS-101")
                    .name("Introduction to Computer Science")
                    .description("Learn the fundamentals of computer programming using Java, algorithmic thinking, and problem solving.")
                    .department("Computer Science")
                    .credits(4)
                    .maxCapacity(30)
                    .teacher(teacher1)
                    .students(new HashSet<>(Set.of(student1)))
                    .build();
            courseRepository.save(course1);

            Course course2 = Course.builder()
                    .courseCode("MATH-201")
                    .name("Calculus II")
                    .description("Covers integration, applications of integration, differential equations, sequences, and series.")
                    .department("Mathematics")
                    .credits(3)
                    .maxCapacity(25)
                    .teacher(teacher2)
                    .students(new HashSet<>(Set.of(student1, student2)))
                    .build();
            courseRepository.save(course2);

            Course course3 = Course.builder()
                    .courseCode("SWE-310")
                    .name("Software Engineering Practices")
                    .description("Introductory course on software design patterns, agile workflows, version control, and testing frameworks.")
                    .department("Software Engineering")
                    .credits(3)
                    .maxCapacity(40)
                    .teacher(teacher1)
                    .students(new HashSet<>())
                    .build();
            courseRepository.save(course3);

            // Create Initial Grades
            Grade grade1 = Grade.builder()
                    .student(student1)
                    .course(course1)
                    .letterGrade("A")
                    .numericalScore(94.5)
                    .gpaPoint(4.0)
                    .remarks("Outstanding academic performance and project execution.")
                    .build();
            gradeRepository.save(grade1);

            Grade grade2 = Grade.builder()
                    .student(student1)
                    .course(course2)
                    .letterGrade("A-")
                    .numericalScore(89.0)
                    .gpaPoint(3.7)
                    .remarks("Great problem solving skills in midterms and finals.")
                    .build();
            gradeRepository.save(grade2);

            Grade grade3 = Grade.builder()
                    .student(student2)
                    .course(course2)
                    .letterGrade("B+")
                    .numericalScore(86.5)
                    .gpaPoint(3.3)
                    .remarks("Solid coursework and active tutorial participation.")
                    .build();
            gradeRepository.save(grade3);

            // Create Initial Announcements
            Announcement ann1 = Announcement.builder()
                    .title("Welcome to Fall Academic Semester 2026")
                    .content("Welcome all students and faculty! Course registration is now active. Please check your assigned schedules and department requirements.")
                    .targetRole("ALL")
                    .priority("HIGH")
                    .category("ACADEMIC")
                    .author(admin)
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .build();
            announcementRepository.save(ann1);

            Announcement ann2 = Announcement.builder()
                    .title("Midterm Grade Submission Deadline")
                    .content("All faculty members are requested to finalize midterm grade entries via the Faculty Grading Portal by next Friday.")
                    .targetRole("TEACHER")
                    .priority("URGENT")
                    .category("EXAMS")
                    .author(admin)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build();
            announcementRepository.save(ann2);

            // Create Attendance Initial Data
            Attendance att1 = Attendance.builder()
                    .student(student1)
                    .course(course1)
                    .date(LocalDate.now().minusDays(3))
                    .status("PRESENT")
                    .remarks("On time")
                    .build();
            attendanceRepository.save(att1);

            Attendance att2 = Attendance.builder()
                    .student(student1)
                    .course(course1)
                    .date(LocalDate.now().minusDays(1))
                    .status("PRESENT")
                    .remarks("On time")
                    .build();
            attendanceRepository.save(att2);

            Attendance att3 = Attendance.builder()
                    .student(student2)
                    .course(course2)
                    .date(LocalDate.now().minusDays(2))
                    .status("LATE")
                    .remarks("Arrived 10 minutes late")
                    .build();
            attendanceRepository.save(att3);

            // Create Fee Statement Initial Data
            FeeStatement fee1 = FeeStatement.builder()
                    .student(student1)
                    .academicTerm("Fall 2026")
                    .tuitionAmount(1400.0)
                    .labFee(150.0)
                    .registrationFee(100.0)
                    .paidAmount(1650.0)
                    .balance(0.0)
                    .status("PAID")
                    .dueDate(LocalDate.now().plusMonths(1))
                    .build();
            feeStatementRepository.save(fee1);

            FeeStatement fee2 = FeeStatement.builder()
                    .student(student2)
                    .academicTerm("Fall 2026")
                    .tuitionAmount(1200.0)
                    .labFee(150.0)
                    .registrationFee(100.0)
                    .paidAmount(500.0)
                    .balance(950.0)
                    .status("PENDING")
                    .dueDate(LocalDate.now().plusWeeks(2))
                    .build();
            feeStatementRepository.save(fee2);

            System.out.println("Data seeding complete!");
        } else {
            System.out.println("Users already exist. Skipping data seeding.");
        }
    }
}
