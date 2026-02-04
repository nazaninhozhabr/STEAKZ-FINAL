@echo off
REM MIS Project - Full Stack Startup Script for Windows
REM This script starts both the backend and frontend servers

setlocal enabledelayedexpansion

echo 🚀 Starting MIS Project Full Stack...
echo.

set PROJECT_ROOT=C:\Users\nazanin\Desktop\MIS-FINAL
set BACKEND_DIR=%PROJECT_ROOT%\steakz-backend
set FRONTEND_DIR=%PROJECT_ROOT%\MIS-PROJECT

REM Check if directories exist
if not exist "%BACKEND_DIR%" (
    echo ❌ Backend directory not found: %BACKEND_DIR%
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo ❌ Frontend directory not found: %FRONTEND_DIR%
    pause
    exit /b 1
)

echo 📋 Starting Backend Server...
cd /d "%BACKEND_DIR%"

if not exist "node_modules" (
    echo ⚙️  Installing backend dependencies...
    call npm install
)

echo ✅ Backend starting...
start cmd /k "npm run dev"
timeout /t 3 /nobreak

echo.
echo 📋 Starting Frontend Server...
cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo ⚙️  Installing frontend dependencies...
    call npm install
)

echo ✅ Frontend starting...
start cmd /k "npm run dev"

echo.
echo ✅ Both servers are running!
echo.
echo 📝 Instructions:
echo    - Backend: http://localhost:3001
echo    - Frontend: http://localhost:5176
echo    - Check the command windows for server logs
echo.
pause
