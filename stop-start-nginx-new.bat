@echo off
echo Start 2 nginx instances...
pause

:: Останавливаем все nginx (опционально — раскомментируйте при обновлении конфига)
taskkill /f /im nginx.exe >nul 2>&1
timeout /t 2 >nul
pause

:: Запуск первого nginx (порт 8080)
cd /d C:\nginx
pause
if exist nginx.exe (
echo Starting nginx on port 8080...
start nginx -c conf/nginx.conf
) else (
echo ОШИБКА: nginx.exe не найден в C:\nginx
pause
exit /b 1
)

:: Запуск второго nginx (порт 8088)
cd /d C:\nginx2
pause
if exist nginx.exe (
    echo Starting nginx on port 55555...
    start nginx -c conf/nginx.conf
) else (
    echo ОШИБКА: nginx.exe не найден в C:\nginx2
    pause
    exit /b 1
)
pause

:: Проверка
echo.
echo Check nginx processes
tasklist | findstr nginx

echo.
echo Access granted:
echo   SW-manager http://localhost:8080
echo   Contacts   http://localhost:55555
echo.
echo Your IP 10.182.62.50 is valid
pause