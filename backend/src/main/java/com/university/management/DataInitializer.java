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
            System.out.println("Seeding authentic Somali university dataset...");

            // 1. Create System Administrator
            User admin = User.builder()
                    .username("admin")
                    .email("abdirahman@university.edu.so")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);

            // 2. Create Somali Faculty Professors
            User teacher1 = User.builder()
                    .username("ibrahim_ahmed")
                    .email("ibrahim.ahmed@university.edu.so")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .build();
            userRepository.save(teacher1);

            User teacher2 = User.builder()
                    .username("fatima_jama")
                    .email("fatima.jama@university.edu.so")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .build();
            userRepository.save(teacher2);

            User teacher3 = User.builder()
                    .username("mohamed_hassan")
                    .email("mohamed.hassan@university.edu.so")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .build();
            userRepository.save(teacher3);

            User teacher4 = User.builder()
                    .username("amina_yusuf")
                    .email("amina.yusuf@university.edu.so")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .build();
            userRepository.save(teacher4);

            // 3. Create Somali Student Accounts
            User student1 = User.builder()
                    .username("hamda_farah")
                    .email("hamda.farah@university.edu.so")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(student1);

            User student2 = User.builder()
                    .username("bilal_warsame")
                    .email("bilal.warsame@university.edu.so")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(student2);

            User student3 = User.builder()
                    .username("zakaria_aden")
                    .email("zakaria.aden@university.edu.so")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(student3);

            User student4 = User.builder()
                    .username("hawa_dahir")
                    .email("hawa.dahir@university.edu.so")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(student4);

            // 4. Create Real University Courses
            Course course1 = Course.builder()
                    .courseCode("CS-101")
                    .name("Introduction to Computer Science")
                    .description("Learn the fundamentals of computer programming using Java, object-oriented design, and algorithmic thinking.")
                    .department("Computer Science")
                    .credits(4)
                    .maxCapacity(30)
                    .teacher(teacher1)
                    .students(new HashSet<>(Set.of(student1, student2, student3)))
                    .build();
            courseRepository.save(course1);

            Course course2 = Course.builder()
                    .courseCode("MATH-201")
                    .name("Calculus II")
                    .description("Advanced calculus covering integration techniques, differential equations, sequences, and infinite series.")
                    .department("Mathematics")
                    .credits(3)
                    .maxCapacity(25)
                    .teacher(teacher2)
                    .students(new HashSet<>(Set.of(student1, student2, student4)))
                    .build();
            courseRepository.save(course2);

            Course course3 = Course.builder()
                    .courseCode("SWE-310")
                    .name("Software Architecture & Design Patterns")
                    .description("Comprehensive guide to enterprise software design patterns, microservices architecture, and code clean principles.")
                    .department("Software Engineering")
                    .credits(3)
                    .maxCapacity(40)
                    .teacher(teacher3)
                    .students(new HashSet<>(Set.of(student1, student3, student4)))
                    .build();
            courseRepository.save(course3);

            Course course4 = Course.builder()
                    .courseCode("EE-220")
                    .name("Digital Logic Circuits & Systems")
                    .description("Explores digital logic gates, Boolean algebra, combinational logic design, and microcontroller hardware programming.")
                    .department("Electrical Engineering")
                    .credits(4)
                    .maxCapacity(35)
                    .teacher(teacher4)
                    .students(new HashSet<>(Set.of(student2, student4)))
                    .build();
            courseRepository.save(course4);

            Course course5 = Course.builder()
                    .courseCode("CS-402")
                    .name("Artificial Intelligence & Machine Learning")
                    .description("Study supervised and unsupervised machine learning models, neural networks, and natural language processing.")
                    .department("Computer Science")
                    .credits(3)
                    .maxCapacity(30)
                    .teacher(teacher1)
                    .students(new HashSet<>(Set.of(student1, student3)))
                    .build();
            courseRepository.save(course5);

            // 5. Create Evaluated Student Grades
            gradeRepository.save(Grade.builder()
                    .student(student1).course(course1)
                    .letterGrade("A").numericalScore(95.0).gpaPoint(4.0)
                    .remarks("Outstanding academic performance and flawless project delivery.")
                    .build());

            gradeRepository.save(Grade.builder()
                    .student(student1).course(course2)
                    .letterGrade("A-").numericalScore(89.5).gpaPoint(3.7)
                    .remarks("Exemplary analytical problem solving in differential calculus.")
                    .build());

            gradeRepository.save(Grade.builder()
                    .student(student1).course(course3)
                    .letterGrade("A").numericalScore(97.0).gpaPoint(4.0)
                    .remarks("Exceptional mastery of software architecture and gang-of-four patterns.")
                    .build());

            gradeRepository.save(Grade.builder()
                    .student(student2).course(course1)
                    .letterGrade("B+").numericalScore(87.5).gpaPoint(3.3)
                    .remarks("Strong Java programming syntax and lab assignment execution.")
                    .build());

            gradeRepository.save(Grade.builder()
                    .student(student2).course(course2)
                    .letterGrade("B").numericalScore(83.0).gpaPoint(3.0)
                    .remarks("Consistent performance in quizzes and calculus tutorials.")
                    .build());

            gradeRepository.save(Grade.builder()
                    .student(student3).course(course1)
                    .letterGrade("A-").numericalScore(91.5).gpaPoint(3.7)
                    .remarks("Great algorithmic comprehension and active lab participation.")
                    .build());

            gradeRepository.save(Grade.builder()
                    .student(student4).course(course4)
                    .letterGrade("A").numericalScore(96.0).gpaPoint(4.0)
                    .remarks("Top score in digital logic breadboard lab examinations.")
                    .build());

            // 6. Create Historical Daily Attendance Logs
            LocalDate today = LocalDate.now();

            attendanceRepository.save(Attendance.builder().student(student1).course(course1).date(today.minusDays(5)).status("PRESENT").remarks("On time").build());
            attendanceRepository.save(Attendance.builder().student(student1).course(course1).date(today.minusDays(3)).status("PRESENT").remarks("On time").build());
            attendanceRepository.save(Attendance.builder().student(student1).course(course1).date(today.minusDays(1)).status("PRESENT").remarks("On time").build());

            attendanceRepository.save(Attendance.builder().student(student2).course(course2).date(today.minusDays(4)).status("PRESENT").remarks("On time").build());
            attendanceRepository.save(Attendance.builder().student(student2).course(course2).date(today.minusDays(2)).status("LATE").remarks("Arrived 10 mins late").build());
            attendanceRepository.save(Attendance.builder().student(student2).course(course2).date(today.minusDays(1)).status("PRESENT").remarks("On time").build());

            attendanceRepository.save(Attendance.builder().student(student3).course(course3).date(today.minusDays(4)).status("PRESENT").remarks("Active participant").build());
            attendanceRepository.save(Attendance.builder().student(student3).course(course3).date(today.minusDays(2)).status("EXCUSED").remarks("Medical slip provided").build());

            attendanceRepository.save(Attendance.builder().student(student4).course(course4).date(today.minusDays(3)).status("PRESENT").remarks("On time").build());
            attendanceRepository.save(Attendance.builder().student(student4).course(course4).date(today.minusDays(1)).status("PRESENT").remarks("On time").build());

            // 7. Create Student Tuition Fee Statements
            feeStatementRepository.save(FeeStatement.builder()
                    .student(student1)
                    .academicTerm("Fall 2026")
                    .tuitionAmount(1600.0)
                    .labFee(150.0)
                    .registrationFee(100.0)
                    .paidAmount(1850.0)
                    .balance(0.0)
                    .status("PAID")
                    .dueDate(today.plusMonths(1))
                    .build());

            feeStatementRepository.save(FeeStatement.builder()
                    .student(student2)
                    .academicTerm("Fall 2026")
                    .tuitionAmount(1200.0)
                    .labFee(150.0)
                    .registrationFee(100.0)
                    .paidAmount(600.0)
                    .balance(850.0)
                    .status("PENDING")
                    .dueDate(today.plusWeeks(2))
                    .build());

            feeStatementRepository.save(FeeStatement.builder()
                    .student(student3)
                    .academicTerm("Fall 2026")
                    .tuitionAmount(1200.0)
                    .labFee(150.0)
                    .registrationFee(100.0)
                    .paidAmount(0.0)
                    .balance(1450.0)
                    .status("OVERDUE")
                    .dueDate(today.minusDays(5))
                    .build());

            feeStatementRepository.save(FeeStatement.builder()
                    .student(student4)
                    .academicTerm("Fall 2026")
                    .tuitionAmount(1400.0)
                    .labFee(150.0)
                    .registrationFee(100.0)
                    .paidAmount(1650.0)
                    .balance(0.0)
                    .status("PAID")
                    .dueDate(today.plusMonths(1))
                    .build());

            // 8. Create Campus Announcements
            announcementRepository.save(Announcement.builder()
                    .title("Midterm Examination Schedule Announcement")
                    .content("The official midterm examination schedule for Fall 2026 has been published. All examinations will be conducted in the Main Academic Building. Please review room assignments.")
                    .targetRole("ALL")
                    .priority("URGENT")
                    .category("EXAMS")
                    .author(admin)
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build());

            announcementRepository.save(Announcement.builder()
                    .title("Faculty Grade Submission Deadline")
                    .content("All faculty members are required to submit midterm progress grades via the Faculty Grading Portal by next Friday at 5:00 PM.")
                    .targetRole("TEACHER")
                    .priority("HIGH")
                    .category("ACADEMIC")
                    .author(admin)
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .build());

            announcementRepository.save(Announcement.builder()
                    .title("Financial Aid & Scholarship Renewal Notice")
                    .content("Students holding merit scholarships or university financial aid must submit their renewal documentation to the Bursar's Office before the end of the month.")
                    .targetRole("STUDENT")
                    .priority("NORMAL")
                    .category("GENERAL")
                    .author(admin)
                    .createdAt(LocalDateTime.now().minusDays(3))
                    .build());

            announcementRepository.save(Announcement.builder()
                    .title("Extended Campus Library Hours During Finals")
                    .content("The Odros University Library will remain open 24/7 starting next Monday to support students preparing for end-of-term projects and exams.")
                    .targetRole("ALL")
                    .priority("NORMAL")
                    .category("CAMPUS_LIFE")
                    .author(admin)
                    .createdAt(LocalDateTime.now().minusDays(4))
                    .build());

            System.out.println("Authentic Somali university dataset seeded successfully!");
        } else {
            System.out.println("Database already contains data. Skipping initialization.");
        }
    }
}
