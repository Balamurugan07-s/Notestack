-- ====================================================================
-- NoteStack - Initial Seed Data
-- ====================================================================

-- 1. SEED USERS
-- Default password for all seed accounts is: Password@123
-- BCrypt hash of 'Password@123': $2a$10$7zB3cT6I8xJ/2Q5v7m8rLeH1xU6g1h0Z5q9o3n2b1a8c7d6e5f4g3
INSERT INTO users (id, name, email, password, college, department, academic_year, role, status, bio) VALUES
(1, 'Admin User', 'admin@notestack.edu', '$2a$10$X87qXG1Q2.VzB9vR7b0w2eT7y3v9Q5j4w1Z2x3C4v5B6n7M8k9L0.', 'National Institute of Technology', 'Computer Science', 4, 'ADMIN', 'ACTIVE', 'System administrator and platform coordinator.'),
(2, 'Aarav Sharma', 'aarav.sharma@notestack.edu', '$2a$10$X87qXG1Q2.VzB9vR7b0w2eT7y3v9Q5j4w1Z2x3C4v5B6n7M8k9L0.', 'National Institute of Technology', 'Computer Science', 3, 'STUDENT', 'ACTIVE', '3rd year CSE student passionate about databases, distributed systems, and algorithms.'),
(3, 'Priya Patel', 'priya.patel@notestack.edu', '$2a$10$X87qXG1Q2.VzB9vR7b0w2eT7y3v9Q5j4w1Z2x3C4v5B6n7M8k9L0.', 'Delhi Technological University', 'Electronics & Communication', 2, 'STUDENT', 'ACTIVE', 'ECE 2nd year. Loves microprocessors and signal processing.'),
(4, 'Rohan Verma', 'rohan.verma@notestack.edu', '$2a$10$X87qXG1Q2.VzB9vR7b0w2eT7y3v9Q5j4w1Z2x3C4v5B6n7M8k9L0.', 'Birla Institute of Technology', 'Information Technology', 3, 'STUDENT', 'ACTIVE', 'IT junior. Focus on cybersecurity and computer networks.'),
(5, 'Sneha Rao', 'sneha.rao@notestack.edu', '$2a$10$X87qXG1Q2.VzB9vR7b0w2eT7y3v9Q5j4w1Z2x3C4v5B6n7M8k9L0.', 'Vellore Institute of Technology', 'Mechanical Engineering', 4, 'STUDENT', 'ACTIVE', 'Final year Mechanical. Thermodynamics, CAD, and Fluid Mechanics enthusiast.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED CATEGORIES
INSERT INTO categories (id, name, code, description, icon) VALUES
(1, 'Lecture Notes', 'LECTURE_NOTES', 'Comprehensive handwritten and digitized classroom lecture notes', 'bi-journal-richtext'),
(2, 'Previous Year Questions (PYQs)', 'QUESTION_PAPERS', 'Midterm, end-semester, and university question papers with solutions', 'bi-file-earmark-text'),
(3, 'Lab Manuals & Code', 'LAB_MANUALS', 'Practical experiments, viva questions, and source code implementations', 'bi-code-square'),
(4, 'Formula Sheets & Summaries', 'FORMULA_SHEETS', 'Quick formula sheets, cheatsheets, and exam revision guides', 'bi-calculator'),
(5, 'Syllabus & Curriculum', 'SYLLABUS', 'Official academic course curriculum, weightage, and reference booklists', 'bi-bookmark-check'),
(6, 'Assignments & Projects', 'ASSIGNMENTS', 'Homework solutions, problem sets, and mini project reports', 'bi-briefcase')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. SEED SUBJECTS (Department -> Semester -> Subject)
INSERT INTO subjects (id, code, name, department, semester) VALUES
-- Computer Science (CSE)
(1, 'CS301', 'Data Structures & Algorithms', 'Computer Science', 3),
(2, 'CS302', 'Computer Organization & Architecture', 'Computer Science', 3),
(3, 'CS401', 'Database Management Systems', 'Computer Science', 4),
(4, 'CS402', 'Theory of Computation & Automata', 'Computer Science', 4),
(5, 'CS501', 'Operating Systems', 'Computer Science', 5),
(6, 'CS502', 'Software Engineering', 'Computer Science', 5),
(7, 'CS601', 'Computer Networks', 'Computer Science', 6),
(8, 'CS602', 'Compiler Design', 'Computer Science', 6),
(9, 'CS701', 'Artificial Intelligence & Machine Learning', 'Computer Science', 7),
(10, 'CS702', 'Cloud Computing & DevOps', 'Computer Science', 7),

-- Electronics & Communication (ECE)
(11, 'EC301', 'Signals and Systems', 'Electronics & Communication', 3),
(12, 'EC302', 'Analog Electronics', 'Electronics & Communication', 3),
(13, 'EC401', 'Digital Signal Processing (DSP)', 'Electronics & Communication', 4),
(14, 'EC402', 'Electromagnetic Fields & Waves', 'Electronics & Communication', 4),
(15, 'EC501', 'Microprocessors & Microcontrollers (8086/ARM)', 'Electronics & Communication', 5),

-- Information Technology (IT)
(16, 'IT401', 'Object Oriented Programming with Java', 'Information Technology', 4),
(17, 'IT501', 'Cryptography and Network Security', 'Information Technology', 5),
(18, 'IT601', 'Web Technologies & Frameworks', 'Information Technology', 6),

-- Mechanical Engineering
(19, 'ME301', 'Thermodynamics & Heat Transfer', 'Mechanical Engineering', 3),
(20, 'ME401', 'Fluid Mechanics and Machinery', 'Mechanical Engineering', 4)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. SEED TAGS
INSERT INTO tags (id, name) VALUES
(1, 'dbms'),
(2, 'sql'),
(3, 'normalization'),
(4, 'algorithms'),
(5, 'data-structures'),
(6, 'trees-and-graphs'),
(7, 'operating-systems'),
(8, 'process-scheduling'),
(9, 'memory-management'),
(10, 'mid-term'),
(11, 'end-term'),
(12, 'formula-sheet'),
(13, 'quick-revision'),
(14, 'lab-viva'),
(15, 'exam-prep')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- End of metadata initialization. Notes will only exist when uploaded and published by users.

