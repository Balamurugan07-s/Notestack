package com.notestack.config;

import com.notestack.entity.*;
import com.notestack.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SubjectRepository subjectRepository;
    private final TagRepository tagRepository;
    private final NoteRepository noteRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${notestack.storage.location:uploads}")
    private String storageLocation;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           SubjectRepository subjectRepository,
                           TagRepository tagRepository,
                           NoteRepository noteRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.subjectRepository = subjectRepository;
        this.tagRepository = tagRepository;
        this.noteRepository = noteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing NoteStack database and demo resources...");

        // Ensure storage directory exists
        Path uploadPath = Paths.get(storageLocation);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 1. Seed Categories if empty
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(Arrays.asList(
                new Category("Lecture Notes", "LECTURE_NOTES", "Comprehensive classroom notes & lecture slides", "bi-journal-richtext"),
                new Category("Previous Year Questions (PYQs)", "QUESTION_PAPERS", "Mid-term and end-sem past exam papers with solutions", "bi-file-earmark-text"),
                new Category("Lab Manuals & Code", "LAB_MANUALS", "Practical experiments, code implementations, viva questions", "bi-code-square"),
                new Category("Formula Sheets & Cheatsheets", "FORMULA_SHEETS", "Quick reference guides, cheat sheets, and summaries", "bi-calculator"),
                new Category("Syllabus & Curriculum", "SYLLABUS", "Official syllabus, credit structure, and course references", "bi-bookmark-check"),
                new Category("Assignments & Solutions", "ASSIGNMENTS", "Solved homework, problem sets, and tutorial sheets", "bi-briefcase")
            ));
            logger.info("Seeded 6 note categories.");
        }

        // 2. Seed Subjects if empty
        if (subjectRepository.count() == 0) {
            subjectRepository.saveAll(Arrays.asList(
                new Subject("CS301", "Data Structures & Algorithms", "Computer Science", 3),
                new Subject("CS302", "Computer Organization & Architecture", "Computer Science", 3),
                new Subject("CS401", "Database Management Systems", "Computer Science", 4),
                new Subject("CS402", "Theory of Computation & Automata", "Computer Science", 4),
                new Subject("CS501", "Operating Systems", "Computer Science", 5),
                new Subject("CS502", "Software Engineering", "Computer Science", 5),
                new Subject("CS601", "Computer Networks", "Computer Science", 6),
                new Subject("EC301", "Signals and Systems", "Electronics & Communication", 3),
                new Subject("EC401", "Digital Signal Processing", "Electronics & Communication", 4),
                new Subject("EC501", "Microprocessors & Microcontrollers", "Electronics & Communication", 5),
                new Subject("IT401", "Object Oriented Programming (Java)", "Information Technology", 4),
                new Subject("IT501", "Cryptography & Network Security", "Information Technology", 5),
                new Subject("ME301", "Thermodynamics & Heat Transfer", "Mechanical Engineering", 3),
                new Subject("ME401", "Fluid Mechanics & Machinery", "Mechanical Engineering", 4)
            ));
            logger.info("Seeded academic subjects across departments and semesters.");
        }

        // 3. Seed Default Users if empty
        User adminUser;
        if (userRepository.findByEmail("admin@notestack.edu").isEmpty()) {
            adminUser = new User(
                "Admin Coordinator",
                "admin@notestack.edu",
                passwordEncoder.encode("Admin@123"),
                "National Institute of Technology",
                "Computer Science",
                4,
                Role.ADMIN
            );
            adminUser.setBio("System Administrator & NoteStack Content Reviewer.");
            adminUser = userRepository.save(adminUser);
            logger.info("Created Admin Account: admin@notestack.edu / Admin@123");
        } else {
            adminUser = userRepository.findByEmail("admin@notestack.edu").get();
        }

        User studentUser;
        if (userRepository.findByEmail("student@notestack.edu").isEmpty()) {
            studentUser = new User(
                "Aarav Sharma",
                "student@notestack.edu",
                passwordEncoder.encode("Student@123"),
                "National Institute of Technology",
                "Computer Science",
                3,
                Role.STUDENT
            );
            studentUser.setBio("3rd year CSE student. Passionate about databases, distributed systems, and graph theory.");
            studentUser = userRepository.save(studentUser);
            logger.info("Created Student Account: student@notestack.edu / Student@123");
        } else {
            studentUser = userRepository.findByEmail("student@notestack.edu").get();
        }

        // 4. Seed Tags
        Map<String, Tag> tagMap = new HashMap<>();
        String[] tagNames = {"dbms", "sql", "normalization", "algorithms", "dsa", "exam-prep", "cheatsheet", "operating-systems", "viva"};
        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(tagName)));
            tagMap.put(tagName, tag);
        }

        logger.info("NoteStack database initialization completed successfully! Notes will only appear when uploaded by students.");
    }

    private void createDummyPdf(File file) {
        try (FileOutputStream fos = new FileOutputStream(file)) {
            // Minimal valid PDF binary
            String minimalPdf = "%PDF-1.4\n" +
                    "1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n" +
                    "2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n" +
                    "3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n" +
                    "4 0 obj <</Length 68>> stream\n" +
                    "BT /F1 24 Tf 100 700 Td (NoteStack - Student Study Material) Tj ET\n" +
                    "endstream endobj\n" +
                    "5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj\n" +
                    "xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n0000000385 00000 n \ntrailer <</Size 6 /Root 1 0 R>>\nstartxref\n455\n%%EOF";
            fos.write(minimalPdf.getBytes());
        } catch (Exception e) {
            logger.warn("Could not create dummy PDF: {}", e.getMessage());
        }
    }
}
