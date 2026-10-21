package com.notestack.repository;

import com.notestack.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDepartment(String department);
    List<Subject> findByDepartmentAndSemester(String department, Integer semester);
    Optional<Subject> findByDepartmentAndSemesterAndCode(String department, Integer semester, String code);
}
