package com.notestack.service;

import com.notestack.entity.Subject;
import com.notestack.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Subject> getSubjectsByDepartment(String department) {
        return subjectRepository.findByDepartment(department);
    }

    public List<Subject> getSubjectsByDepartmentAndSemester(String department, Integer semester) {
        return subjectRepository.findByDepartmentAndSemester(department, semester);
    }
}
