@echo off
cd /d C:\nginx
echo Stopping all nginx proc...
taskkill /f /im nginx.exe >nul 2>&1
echo Starting nginx...
start nginx -c conf/nginx.conf
echo Accomply. Check - must be one process:
tasklist | findstr nginx
pause
echo Now - must be 2 processes: master process and worker process - OK
tasklist | findstr nginx
pause