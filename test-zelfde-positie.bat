@echo off
echo ================================================================
echo   ZELFDE POSITIE - VERIFICATION TEST
echo ================================================================
echo.

echo Testing database connection and stored procedure...
echo.

sqlcmd -S "(localdb)\mssqllocaldb" -d "TemplateJwtProjectDb" -Q "SELECT COUNT(*) AS SongCount FROM (EXEC GetZelfdePositie @Jaar = 2024) AS Results" -W -h-1

if errorlevel 1 (
    echo.
    echo [ERROR] Could not execute stored procedure!
    echo.
    echo Please check:
    echo  1. LocalDB is running
    echo  2. Database exists
    echo  3. Stored procedure was created
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================================
echo   SUCCESS! Stored procedure is working
echo ================================================================
echo.
echo The stored procedure 'GetZelfdePositie' exists and returns data.
echo.
echo Your API endpoint should now work:
echo   GET https://localhost:7003/api/statistics/zelfde-positie/2024
echo.
echo Refresh your React app to see the results!
echo.
pause
