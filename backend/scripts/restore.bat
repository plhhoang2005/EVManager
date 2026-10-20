@echo off
REM ==============================================================================
REM EVManager - Database Restore Script for Windows (PostgreSQL)
REM Deliverable for Issue BE-33 (#130) - Hardened Version
REM ==============================================================================

setlocal enabledelayedexpansion

if "%~1"=="" (
    echo [ERROR] Thieu duong dan file backup can phuc hoi!
    echo Cach su dung: restore.bat ^<duong_dan_file_backup.sql hoac .sql.gz^>
    echo Vi du: restore.bat "..\backups\evmanager_backup_20261020_110000.sql.gz"
    exit /b 1
)

set "RESTORE_FILE=%~1"

if not exist "%RESTORE_FILE%" (
    echo [ERROR] File backup khong ton tai: "%RESTORE_FILE%"
    exit /b 1
)

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%.."

set "DB_HOST=localhost"
set "DB_PORT=5432"
set "DB_NAME=evmanager"
set "DB_USERNAME=postgres"
set "DB_PASSWORD=postgres"

if exist "%BACKEND_DIR%\.env" (
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

echo ==================================================
echo   CANH BAO: THAO TAC NAY SE GHI DE CSDL HIEN CO!
echo   Database dich: %DB_NAME%@%DB_HOST%:%DB_PORT%
echo   File phuc hoi: "%RESTORE_FILE%"
echo ==================================================

set /p CONFIRM="Ban co chac chan muon khoi phuc? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo [INFO] Da huy thao tac phuc hoi an toan.
    exit /b 0
)

set "PGPASSWORD=%DB_PASSWORD%"

REM Ngat cac ket noi active toi CSDL de tranh deadlock voi connection pool cua backend
echo [INFO] Dang ngat cac ket noi active toi CSDL %DB_NAME% de tranh deadlock...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d postgres -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '%DB_NAME%' AND pid <> pg_backend_pid();" >nul 2>&1

set "FINAL_RESTORE_FILE=%RESTORE_FILE%"
set "TEMP_EXTRACTED="

REM Xu ly neu file la dinh dang nen .gz
if "%RESTORE_FILE:~-3%"==".gz" (
    where tar >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo [INFO] Dang giai nen file .gz bang tar...
        set "TEMP_EXTRACTED=%TEMP%\evmanager_restore_temp_%RANDOM%.sql"
        tar -xzf "%RESTORE_FILE%" -O > "!TEMP_EXTRACTED!"
        set "FINAL_RESTORE_FILE=!TEMP_EXTRACTED!"
    ) else (
        echo [WARN] Khong tim thay 'tar' de giai nen .gz. Thu dung psql truc tiep neu la script ho tro.
    )
)

echo [INFO] Dang tien hanh khoi phuc co so du lieu voi ON_ERROR_STOP=1...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USERNAME% -d %DB_NAME% -v ON_ERROR_STOP=1 -f "%FINAL_RESTORE_FILE%"

set "RESTORE_EXIT=%ERRORLEVEL%"

if defined TEMP_EXTRACTED (
    if exist "%TEMP_EXTRACTED%" del /f /q "%TEMP_EXTRACTED%"
)

if %RESTORE_EXIT% equ 0 (
    echo ==================================================
    echo [SUCCESS] Du lieu da duoc phuc hoi nguyen ven 100%%!
    echo ==================================================
) else (
    echo ==================================================
    echo [ERROR] Phuc hoi that bai voi exit code %RESTORE_EXIT%.
    echo ==================================================
)

set "PGPASSWORD="
endlocal
