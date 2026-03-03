@echo off
REM College Event Registration System - Single Run Script
REM This batch file starts MySQL, imports schema, runs backend, and serves frontend

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo College Event Registration System - Project Runner
echo ============================================================
echo.

cd /d "%~dp0"
set "BACKEND_DIR=%CD%\backend"
set "FRONTEND_DIR=%CD%\frontend\web"
set "VENV_PYTHON=%BACKEND_DIR%\venv\Scripts\python.exe"
set "IMPORT_SCRIPT=%BACKEND_DIR%\scripts\import_schema.py"
set "APP_SCRIPT=%BACKEND_DIR%\app.py"

REM Check if venv exists
if not exist "%VENV_PYTHON%" (
    echo [ERROR] Python venv not found. Run setup first.
    pause
    exit /b 1
)

REM Step 1: Check MySQL
echo [1/5] Starting MySQL Service...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I /N "mysqld.exe">nul
if "%ERRORLEVEL%"=="0" (
    echo     [OK] MySQL is already running
) else (
    REM Try to start MySQL service (common names)
    echo [+] Attempting to start MySQL service...
    sc start MySQL80 >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        sc start MySQL >nul 2>&1
    )
    timeout /t 3 /nobreak >nul
    tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I /N "mysqld.exe">nul
    if "!ERRORLEVEL!"=="0" (
        echo     [OK] MySQL service started
    ) else (
        echo     [WARNING] MySQL service not detected. Ensure MySQL is running!
    )
)

REM Step 2: Import Schema
echo [2/5] Importing Database Schema...
"%VENV_PYTHON%" "%IMPORT_SCRIPT%"
if %ERRORLEVEL% neq 0 (
    if %ERRORLEVEL% neq 1 (
        echo     [ERROR] Schema import failed
        pause
        exit /b 1
    )
)
echo     [OK] Database schema ready

REM Step 3: Start Backend
echo [3/5] Starting Backend Server...
start "" "%VENV_PYTHON%" "%APP_SCRIPT%"
timeout /t 3 /nobreak >nul
echo     [OK] Backend started

REM Step 4: Start Frontend
echo [4/5] Starting Frontend Server...
start "" cmd /c "cd /d "%FRONTEND_DIR%" && python -m http.server 8000"
timeout /t 2 /nobreak >nul
echo     [OK] Frontend started

REM Step 5: Information
echo [5/5] Startup Complete
echo.
echo ============================================================
echo PROJECT RUNNING SUCCESSFULLY
echo ============================================================
echo.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:8000
echo Dashboard: http://localhost:8000/html/admin_dashboard.html
echo.
echo Note: Services are running in separate windows.
echo Close each window to stop the service.
echo.
REM Optionally open browser
if "%1" neq "-nopen" (
    start http://localhost:8000/html/admin_dashboard.html
    echo [+] Browser opened
)
echo.
pause
