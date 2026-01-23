@echo off
echo ==================================================
echo Zelfde Positie Setup Script
echo ==================================================
echo.
echo Dit script zal:
echo 1. De database migratie uitvoeren om de stored procedure aan te maken
echo.

cd TemplateJwtProject

echo Stap 1: Database migratie uitvoeren...
dotnet ef database update
if errorlevel 1 (
    echo FOUT: Database migratie is mislukt!
    pause
    exit /b 1
)

echo.
echo ==================================================
echo Setup voltooid!
echo ==================================================
echo.
echo De stored procedure 'GetZelfdePositie' is aangemaakt.
echo Je kunt nu de applicatie starten en de Zelfde Positie pagina gebruiken.
echo.
pause
