@echo off
echo ========================================================
echo   Stopping PostgreSQL Server...
echo ========================================================

"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" stop -D "C:\pgdata" -m fast

pause
