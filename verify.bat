@echo off
REM Smart Grid IoT - Verification Script for Windows

echo.
echo ==========================================
echo    Smart Grid IoT - System Verification
echo ==========================================
echo.

REM Check Docker
echo Checking Prerequisites...
echo ==========================================
echo.

docker --version > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker is installed
) else (
    echo [FAIL] Docker is NOT installed
)

docker-compose --version > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker Compose is installed
) else (
    echo [FAIL] Docker Compose is NOT installed
)

echo.
echo Checking Project Files...
echo ==========================================
echo.

if exist docker-compose.yml (
    echo [OK] docker-compose.yml exists
) else (
    echo [FAIL] docker-compose.yml missing
)

if exist backend\server.js (
    echo [OK] backend/server.js exists
) else (
    echo [FAIL] backend/server.js missing
)

if exist frontend\pages\index.js (
    echo [OK] frontend/pages/index.js exists
) else (
    echo [FAIL] frontend/pages/index.js missing
)

if exist generator\generator.js (
    echo [OK] generator/generator.js exists
) else (
    echo [FAIL] generator/generator.js missing
)

if exist mosquitto\config\mosquitto.conf (
    echo [OK] mosquitto/config/mosquitto.conf exists
) else (
    echo [FAIL] mosquitto/config/mosquitto.conf missing
)

echo.
echo Checking Docker Containers...
echo ==========================================
echo.

for /f "tokens=*" %%A in ('docker ps --all --quiet --filter name=smartgrid') do (
    echo [OK] Found container: %%A
)

echo.
echo Checking Environment Files...
echo ==========================================
echo.

if exist backend\.env (
    echo [OK] backend/.env configured
) else (
    echo [WARN] backend/.env not found
)

if exist frontend\.env.local (
    echo [OK] frontend/.env.local configured
) else (
    echo [WARN] frontend/.env.local not found
)

if exist generator\.env (
    echo [OK] generator/.env configured
) else (
    echo [WARN] generator/.env not found
)

echo.
echo ==========================================
echo    Verification Complete
echo ==========================================
echo.

echo Recommendations:
echo 1. Start services: docker-compose up -d
echo 2. View logs: docker-compose logs -f
echo 3. Access dashboard: http://localhost:3000
echo 4. Check API: http://localhost:5000/api/homes
echo.

pause
