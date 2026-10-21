package com.notestack.controller;

import com.notestack.entity.Category;
import com.notestack.entity.Subject;
import com.notestack.service.CategoryService;
import com.notestack.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final CategoryService categoryService;
    private final SubjectService subjectService;

    public CategoryController(CategoryService categoryService, SubjectService subjectService) {
        this.categoryService = categoryService;
        this.subjectService = subjectService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getSubjects(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester) {
        if (department != null && semester != null) {
            return ResponseEntity.ok(subjectService.getSubjectsByDepartmentAndSemester(department, semester));
        } else if (department != null) {
            return ResponseEntity.ok(subjectService.getSubjectsByDepartment(department));
        }
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }
}
