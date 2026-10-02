@echo off
echo ========================================================
echo   Starting PostgreSQL Server for EVManager...
echo ========================================================

rem Xoa postmaster.pid cu neu co
if exist "C:\pgdata\postmaster.pid" (
    del /f /q "C:\pgdata\postmaster.pid"
)

rem Khoi dong PostgreSQL tu data folder C:\pgdata
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" start -D "C:\pgdata" -l "C:\pgdata\pg.log"

rem Kiem tra trang thai
"C:\Program Files\PostgreSQL\18\bin\pg_isready.exe" -h 127.0.0.1 -p 5432
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] PostgreSQL dang hoat dong tai cong 5432!
) else (
    echo.
    echo [Loi] Khong the ket noi den PostgreSQL. Vui long kiem tra file C:\pgdata\pg.log
)

pause
