package com.university.management.repository;

import com.university.management.model.Course;
import com.university.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    Boolean existsByCourseCode(String courseCode);
    List<Course> findByTeacher(User teacher);
    List<Course> findByStudentsContains(User student);
}
