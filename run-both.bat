@echo off
echo ====================================================
echo Starting NoteStack Full-Stack Platform
echo 1. Backend (Spring Boot): http://localhost:8080
echo 2. Frontend (React App): http://localhost:3000
echo ====================================================
start "NoteStack Backend (Spring Boot)" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"
start "NoteStack Frontend (React)" cmd /k "cd /d "%~dp0frontend" && if not exist node_modules (npm install) && npm start"
