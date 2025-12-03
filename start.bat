@echo off
REM Smart Grid IoT - Windows Start Script

echo.
echo ========================================
echo   Smart Grid IoT System
echo ========================================
echo.

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: start.bat [command]
    echo.
    echo Available commands:
    echo   docker-up        Start all services with Docker
    echo   docker-down      Stop all services
    echo   docker-logs      View service logs
    echo   docker-rebuild   Rebuild from scratch
    echo   docker-ps        Show running containers
    echo   backend          Start backend only
    echo   frontend         Start frontend only
    echo   generator        Start generator only
    echo   help             Show this message
    echo.
    exit /b 0
)

if "%1"=="docker-up" (
    echo Starting services...
    docker-compose up -d
    timeout /t 3 >nul
    echo.
    echo Services started!
    echo Dashboard: http://localhost:3000
    echo API: http://localhost:5000
    echo MongoDB: localhost:27017
    echo MQTT: localhost:1883
    echo.
    goto :eof
)

if "%1"=="docker-down" (
    echo Stopping services...
    docker-compose down
    echo Services stopped.
    goto :eof
)

if "%1"=="docker-logs" (
    docker-compose logs -f
    goto :eof
)

if "%1"=="docker-rebuild" (
    echo Rebuilding from scratch...
    docker-compose down -v
    docker-compose up -d --build
    timeout /t 3 >nul
    echo Services rebuilt and started!
    goto :eof
)

if "%1"=="docker-ps" (
    docker-compose ps
    goto :eof
)

if "%1"=="backend" (
    echo Starting backend...
    cd backend
    call npm install
    call npm start
    goto :eof
)

if "%1"=="frontend" (
    echo Starting frontend...
    cd frontend
    call npm install
    call npm run dev
    goto :eof
)

if "%1"=="generator" (
    echo Starting generator...
    cd generator
    call npm install
    call npm start
    goto :eof
)

if "%1"=="help" (
    echo Smart Grid IoT - Available Commands
    echo.
    echo Docker Commands:
    echo   start.bat docker-up      Start all services
    echo   start.bat docker-down    Stop all services
    echo   start.bat docker-logs    View logs
    echo   start.bat docker-rebuild Full reset
    echo   start.bat docker-ps      Show containers
    echo.
    echo Local Development:
    echo   start.bat backend        Start backend only
    echo   start.bat frontend       Start frontend only
    echo   start.bat generator      Start generator only
    echo.
    echo Other:
    echo   start.bat help           Show this message
    echo.
    goto :eof
)

echo Unknown command: %1
echo Use: start.bat help
exit /b 1
