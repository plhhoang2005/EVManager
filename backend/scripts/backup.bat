@echo off
REM ==============================================================================
REM EVManager - Database Backup Script for Windows (PostgreSQL)
REM Deliverable for Issue BE-33 (#130) - Hardened Version
REM ==============================================================================

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%.."
set "BACKUP_DIR=%BACKEND_DIR%\backups"

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

set "DB_HOST=localhost"
set "DB_PORT=5432"
set "DB_NAME=evmanager"
set "DB_USERNAME=postgres"
set "DB_PASSWORD=postgres"

if exist "%BACKEND_DIR%\.env" (
    echo [INFO] Dang doc cau hinh tu .env...
    for /f "usebackq tokens=1,* delims==" %%A in ("%BACKEND_DIR%\.env") do (
        set "line=%%A"
        if not "!line:~0,1!"=="#" (
            if "%%A"=="DB_HOST" set "DB_HOST=%%B"
            if "%%A"=="DB_PORT" set "DB_PORT=%%B"
            if "%%A"=="DB_NAME" set "DB_NAME=%%B"
            if "%%A"=="DB_USERNAME" set "DB_USERNAME=%%B"
            if "%%A"=="DB_PASSWORD" set "DB_PASSWORD=%%B"
        )
    )
)

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set "datetime=%%I"
if not defined datetime (
    set "TIMESTAMP=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
    set "TIMESTAMP=%TIMESTAMP: =0%"
) else (
    set "TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%"
)

set "BACKUP_SQL=%BACKUP_DIR%\evmanager_backup_%TIMESTAMP%.sql"
set "BACKUP_GZ=%BACKUP_DIR%\evmanager_backup_%TIMESTAMP%.sql.gz"

echo ==================================================
echo   EVManager - Bat dau sao luu CSDL (Windows)
echo   Database: %DB_NAME%@%DB_HOST%:%DB_PORT%
echo   Thu muc luu: %BACKUP_DIR%
echo ==================================================

set "PGPASSWORD=%DB_PASSWORD%"

pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME% --clean --if-exists --no-owner --no-privileges -f "%BACKUP_SQL%"

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Sao luu that bai voi exit code %ERRORLEVEL%. Vui long kiem tra PostgreSQL service va pg_dump trong PATH.
    if exist "%BACKUP_SQL%" del /f /q "%BACKUP_SQL%"
    set "PGPASSWORD="
    exit /b 1
)

REM Kiem tra kich thuoc file sao luu (>= 1024 bytes)
for %%F in ("%BACKUP_SQL%") do set "FILE_SIZE=%%~zF"
if %FILE_SIZE% lss 1024 (
    echo [ERROR] File sao luu sinh ra khong hop le hoac qua nho (%FILE_SIZE% bytes).
    echo [INFO] Dang xoa file sao luu loi: "%BACKUP_SQL%"
    del /f /q "%BACKUP_SQL%"
    set "PGPASSWORD="
    exit /b 1
)

REM Nen file bang tar san co tren Windows 10/11 neu co
where tar >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [INFO] Dang nen file bang cong cu tar (Windows 10/11 native)...
    tar -czf "%BACKUP_GZ%" -C "%BACKUP_DIR%" "evmanager_backup_%TIMESTAMP%.sql"
    if %ERRORLEVEL% equ 0 (
        del /f /q "%BACKUP_SQL%"
        echo [SUCCESS] Sao luu va nen thanh cong!
        echo Duong dan: "%BACKUP_GZ%"
    ) else (
        echo [WARN] Nen file that bai, giu lai file .sql goc: "%BACKUP_SQL%"
    )
) else (
    echo [INFO] Khong tim thay 'tar' hoac 'gzip' trong PATH, luu file duoi dang .sql.
    echo [SUCCESS] Sao luu thanh cong!
    echo Duong dan: "%BACKUP_SQL%"
)

set "PGPASSWORD="
echo [INFO] Hoan tat quy trinh sao luu.
endlocal
