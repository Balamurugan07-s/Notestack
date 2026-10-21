# NoteStack – Student Notes Sharing Platform

<div align="center">
  <img src="frontend/public/logo512.png" alt="NoteStack Logo" width="128" height="128" />
  <h3>Centralized, Collaborative Academic Notes & Study Materials Sharing</h3>
  <p>Share Notes. Ace Exams. Collaborate Seamlessly.</p>
</div>

---

## 1. Overview
**NoteStack** is a modern full-stack web application designed for students and educators. Students can sign up, upload study notes (PDF, DOCX, PPTX, images), categorize them by Department, Semester, and Subject, rate materials, write comments, bookmark favorites, and share notes securely via public links or private tokens.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 17 / 21, Spring Boot 3.3.x, Spring Data JPA, Spring Security, Spring Web, Maven |
| **Database** | MySQL 8.0+ |
| **Frontend** | React 18, React Router 6, Axios with JWT interceptors, Context API, Bootstrap 5 |
| **Server-Side Rendering** | Thymeleaf (Public Landing, `/s/{token}` Note Preview, Error Pages, Responsive Email Templates) |
| **Authentication** | BCrypt Password Hashing, Stateless JWT Bearer Tokens, Role-Based Access (STUDENT, ADMIN) |
| **Storage** | Local disk storage abstraction (expandable to AWS S3 / Cloud Storage) |

---

## 3. Brand Identity & Theme
- **App Name:** NoteStack
- **Primary Colors:**
  - Indigo: `#4F46E5`
  - Violet: `#7C3AED`
  - Amber: `#F59E0B`
  - Green: `#10B981`
  - Light Accent: `#C7D2FE`
- **Logo Concept:** Stacked notes with yellow bookmark and green share badge over an indigo-violet gradient background.

---

## 4. Project Structure

```
notestack/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/notestack/
│       │   │   ├── NoteStackApplication.java
│       │   │   ├── config/          # Security, WebMvc, CORS, Storage configs
│       │   │   ├── controller/      # REST API Controllers & Thymeleaf Web Controllers
│       │   │   ├── dto/             # Request & Response DTOs
│       │   │   ├── entity/          # JPA Entity Models
│       │   │   ├── exception/       # Global Exception Handler & Custom Errors
│       │   │   ├── repository/     # Spring Data JPA Repositories
│       │   │   ├── security/        # JWT Filter, Token Provider, UserDetails
│       │   │   ├── service/         # Business Logic & Storage Service
│       │   │   └── util/            # Helpers & Constants
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── schema.sql       # MySQL Table Definitions & Constraints
│       │       ├── data.sql         # Seed Subjects, Categories, Admin & Student data
│       │       ├── static/          # Branding assets (logo.svg, favicon, PNGs)
│       │       └── templates/       # Thymeleaf HTML Pages & Email templates
│       └── test/                    # JUnit 5 & Mockito Unit Tests
│
├── frontend/
│   ├── package.json
│   ├── public/                      # index.html, manifest.json, logo512, favicon.ico
│   └── src/
│       ├── assets/                  # SVG and image assets
│       ├── components/              # Reusable UI components, Navbar, Skeletons
│       ├── context/                 # AuthContext & ThemeContext
│       ├── pages/                   # Landing, Dashboard, Browse, Details, Upload, Profile
│       ├── services/                # Axios API services & Auth Header Interceptors
│       ├── App.js                   # Main Router & Application Container
│       ├── App.css
│       ├── index.js
│       └── index.css                # CSS Variables, Design Tokens, Dark Mode
│
├── .gitignore
└── README.md
```

---

## 5. Database Setup (MySQL 8.0+)

### Step 5.1: Create Database
Log in to MySQL terminal or Workbench:
```sql
CREATE DATABASE IF NOT EXISTS notestack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 5.2: Execute Schema & Seed Data
You can execute the provided SQL scripts directly:
```bash
mysql -u root -p notestack_db < backend/src/main/resources/schema.sql
mysql -u root -p notestack_db < backend/src/main/resources/data.sql
```

*Default Seed Credentials:*
- **Admin Account:** `admin@notestack.edu` / `Password@123`
- **Student Account:** `aarav.sharma@notestack.edu` / `Password@123`

---

## 6. How to Run

### Step 6.1: Backend (Spring Boot 3)
Ensure Java 17+ and Maven 3.8+ are installed.
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
The backend server starts at: `http://localhost:8080`

### Step 6.2: Frontend (React 18)
Ensure Node.js 18+ and npm are installed.
```bash
cd frontend
npm install
npm start
```
The React frontend starts at: `http://localhost:3000`

---

## 7. REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/signup` – Register new student (name, email, password, college, department, year)
- `POST /api/auth/login` – Authenticate user and receive JWT token
- `POST /api/auth/forgot-password` – Send password reset link to email
- `POST /api/auth/reset-password` – Reset password using token

### Notes Management (`/api/notes`)
- `GET /api/notes` – Search & filter notes (by category, subject, tag, department, semester, search term)
- `GET /api/notes/{id}` – View single note details & increment view count
- `POST /api/notes/upload` – Upload note file (PDF, DOCX, PPTX, Images max 10MB) + metadata
- `PUT /api/notes/{id}` – Update note details or replace file
- `DELETE /api/notes/{id}` – Delete note (owner or admin)
- `GET /api/notes/{id}/download` – Download note attachment & increment download count
- `GET /api/notes/my-notes` – List uploaded notes for logged-in student
- `GET /api/notes/trending` – Top viewed and downloaded notes

### Social & Interaction (`/api/notes/{id}/...`)
- `POST /api/notes/{id}/rate` – Submit 1-5 star rating
- `POST /api/notes/{id}/comments` – Add comment
- `POST /api/notes/{id}/bookmark` – Bookmark / unbookmark note
- `POST /api/notes/{id}/report` – Report inappropriate note

### Categories & Subjects (`/api/categories`, `/api/subjects`)
- `GET /api/categories` – List all note categories
- `GET /api/subjects` – Hierarchy list by Department and Semester

### Admin (`/api/admin`)
- `GET /api/admin/notes/pending` – Notes pending review
- `PUT /api/admin/notes/{id}/status` – Approve / Flag / Reject note
- `GET /api/admin/reports` – List user reports
- `GET /api/admin/users` – List all registered students & status

### Public Thymeleaf Web Routes
- `GET /` – Server-side rendered landing & discovery page
- `GET /s/{token}` – Standalone public share link preview with responsive download button

---

## 8. Git Workflow & Commit Guidelines

### Suggested Commit Convention:
```bash
git init
git add .
git commit -m "feat: complete step 1 project structure, branding assets, and database schema"
git branch -M main
git remote add origin https://github.com/<your-username>/notestack.git
git push -u origin main
```
