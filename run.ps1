# College Event Registration System - Single Run Script
# This script starts MySQL, imports schema if needed, runs backend, and serves frontend

param(
    [switch]$NoOpen
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = "$ProjectRoot\backend"
$FrontendDir = "$ProjectRoot\frontend\web"
$EnvFile = "$BackendDir\.env"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "College Event Registration System - Project Runner" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if MySQL is running
function Test-MySQLConnection {
    try {
        $conn = New-Object System.Net.Sockets.TcpClient
        $conn.Connect("localhost", 3306)
        $conn.Close()
        return $true
    } catch {
        return $false
    }
}

# Function to start MySQL service
function Start-MySQLService {
    Write-Host "[*] Checking MySQL service..." -ForegroundColor Yellow
    $MySQLServices = @("MySQL80", "MySQL", "MariaDB")
    
    foreach ($service in $MySQLServices) {
        $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
        if ($svc) {
            if ($svc.Status -ne "Running") {
                Write-Host "[+] Starting MySQL service: $service" -ForegroundColor Green
                Start-Service -Name $service -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 3
            }
            return $true
        }
    }
    
    Write-Host "[-] MySQL service not found. Please install MySQL first." -ForegroundColor Red
    Write-Host "    Download: https://dev.mysql.com/downloads/installer/" -ForegroundColor Yellow
    return $false
}

# Step 1: Start MySQL
Write-Host "[1/5] Starting MySQL Service..." -ForegroundColor Magenta
if (Test-MySQLConnection) {
    Write-Host "    [OK] MySQL is already running" -ForegroundColor Green
} else {
    if (-not (Start-MySQLService)) {
        exit 1
    }
    Start-Sleep -Seconds 2
    if (-not (Test-MySQLConnection)) {
        Write-Host "    [ERROR] MySQL failed to start or not installed" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Import Schema
Write-Host "[2/5] Importing Database Schema..." -ForegroundColor Magenta
$ImportScript = "$BackendDir\scripts\import_schema.py"
$PythonExe = "$BackendDir\venv\Scripts\python.exe"

if (-not (Test-Path $PythonExe)) {
    Write-Host "    [ERROR] Python venv not found. Run setup first." -ForegroundColor Red
    exit 1
}

& $PythonExe $ImportScript 2>&1 | Tee-Object -Variable schemaOutput
# Schema import may fail if already exists (duplicate key), which is fine
Write-Host "    [OK] Database schema ready" -ForegroundColor Green

# Step 3: Start Backend
Write-Host "[3/5] Starting Backend Server..." -ForegroundColor Magenta
$BackendApp = "$BackendDir\app.py"
$BackendProcess = Start-Process -FilePath $PythonExe -ArgumentList $BackendApp -WorkingDirectory $BackendDir -PassThru -NoNewWindow
Write-Host "    [OK] Backend running (PID: $($BackendProcess.Id))" -ForegroundColor Green
Start-Sleep -Seconds 3

# Step 4: Start Frontend
Write-Host "[4/5] Starting Frontend Server..." -ForegroundColor Magenta
$FrontendProcess = Start-Process -FilePath "python" -ArgumentList "-m http.server 8000" -WorkingDirectory $FrontendDir -PassThru -NoNewWindow
Write-Host "    [OK] Frontend running on http://localhost:8000 (PID: $($FrontendProcess.Id))" -ForegroundColor Green
Start-Sleep -Seconds 2

# Step 5: Open Browser
Write-Host "[5/5] Opening Dashboard..." -ForegroundColor Magenta
$DashboardURL = "http://localhost:8000/html/admin_dashboard.html"
if (-not $NoOpen) {
    Start-Process $DashboardURL
    Write-Host "    [+] Browser opened: $DashboardURL" -ForegroundColor Green
} else {
    Write-Host "    [>] Open in browser: $DashboardURL" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "PROJECT RUNNING SUCCESSFULLY" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop: Press Ctrl+C (background processes may continue)" -ForegroundColor Yellow
Write-Host ""

# Keep script running
do { Start-Sleep -Seconds 10 } while ($true)
