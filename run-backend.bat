@echo off
echo ====================================================
echo Starting NoteStack Backend (Spring Boot 3 + Java 17)
echo Server will run on: http://localhost:8080
echo ====================================================
cd /d "%~dp0backend"
if exist "target\notestack-backend-1.0.0.jar" (
    java -jar target\notestack-backend-1.0.0.jar
) else (
    mvn spring-boot:run
)
pause
