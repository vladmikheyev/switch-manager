@echo off
chcp 65001 >nul
cd /d C:\nginx

echo [1/4] Stopping all nginx processes...
taskkill /f /im nginx.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Testing nginx configuration...
nginx -t
if %errorlevel% neq 0 (
    echo ❌ Configuration test failed!
    pause
    exit /b 1
)

echo [3/4] Starting nginx...
start nginx -c conf/nginx.conf
timeout /t 2 /nobreak >nul

echo [4/4] Checking nginx processes...
tasklist | findstr /i nginx
if %errorlevel% neq 0 (
    echo ❌ Nginx failed to start!
    pause
    exit /b 1
)

echo ✅ Nginx started successfully!
echo 🌐 Доступно по адресу: http://10.182.63.130:8088
echo 📋 Логи: C:\nginx\logs\
pause