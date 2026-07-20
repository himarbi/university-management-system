package com.university.management;

import com.university.management.model.Course;
import com.university.management.model.Role;
import com.university.management.model.User;
import com.university.management.repository.CourseRepository;
import com.university.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

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

            System.out.println("Data seeding complete!");
        } else {
            System.out.println("Users already exist. Skipping data seeding.");
        }
    }
}
