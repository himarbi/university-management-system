package com.university.management.repository;

import com.university.management.model.FeeStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeStatementRepository extends JpaRepository<FeeStatement, Long> {
    List<FeeStatement> findByStudentId(Long studentId);
    Optional<FeeStatement> findByStudentIdAndAcademicTerm(Long studentId, String academicTerm);
}
