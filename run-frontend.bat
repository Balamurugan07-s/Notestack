@echo off
echo ====================================================
echo Starting NoteStack Frontend (React 18 + Bootstrap 5)
echo App will run on: http://localhost:3000
echo ====================================================
cd /d "%~dp0frontend"
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
call npm start
pause
