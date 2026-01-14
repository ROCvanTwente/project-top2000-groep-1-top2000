@echo off
echo ===============================
echo Top 2000 Frontend Quick Start
echo ===============================
echo.

cd react\Client

if not exist "package.json" (
    echo [ERROR] Cannot find package.json
    echo Make sure you're in the correct directory
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
call npm install

if errorlevel 1 (
    echo [ERROR] npm install failed
    pause
    exit /b 1
)

echo.
echo ===============================
echo Starting development server...
echo ===============================
echo Open your browser to: http://localhost:5173
echo.

call npm run dev

pause
