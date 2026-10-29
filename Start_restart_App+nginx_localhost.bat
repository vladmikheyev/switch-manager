@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ============================================
:: 📋 НАСТРОЙКИ ПУТЕЙ
:: ============================================
set "PROJECT_ROOT=C:\Users\vg.mikheev\Documents\Swmanager\switch-manager"
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "NGINX_DIR=C:\nginx"
set "LOG_DIR=%PROJECT_ROOT%\logs"
set "FRONTEND_PORT=3000"
set "BACKEND_PORT=5000"
set "NGINX_PORT=8088"
set "LOCALHOST=127.0.0.1"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
where curl >nul 2>&1 && set "HAS_CURL=1" || set "HAS_CURL=0"

:: ============================================
:: 🚀 ЗАГОЛОВОК
:: ============================================
echo.
echo =====================================================
echo    Switch Manager — Запуск в РЕЖИМЕ LOCALHOST
echo    (Доступ только с этого компьютера)
echo =====================================================
echo.
echo [INFO] Пути:
echo   Проект: %PROJECT_ROOT%
echo   Бэкенд: %BACKEND_DIR%
echo   Nginx:  %NGINX_DIR%
echo   Логи:   %LOG_DIR%
echo.

:: ============================================
:: ШАГ 1: ПОЛНАЯ ОЧИСТКА (Kill all)
:: ============================================
echo [1/5] Полная остановка старых процессов...

:: Мягкая, а затем жесткая остановка Nginx для сброса всех воркеров и кэша
nginx -s quit >nul 2>&1
ping 127.0.0.1 -n 2 >nul
taskkill /f /im nginx.exe >nul 2>&1
ping 127.0.0.1 -n 2 >nul

:: Остановка Node.js
taskkill /f /im node.exe >nul 2>&1
ping 127.0.0.1 -n 3 >nul

echo   [OK] Все процессы остановлены.
echo.

:: ============================================
:: ШАГ 2: Запуск бэкенда
:: ============================================
echo [2/5] Запуск бэкенда (порт %BACKEND_PORT%)...
if not exist "%BACKEND_DIR%\server.js" (
    echo   [ERROR] server.js не найден в %BACKEND_DIR%
    goto script_error
)

cd /d "%BACKEND_DIR%"
start "Backend" /MIN cmd /k "cd /d %BACKEND_DIR% && set HOST=%LOCALHOST% && npm run dev > %LOG_DIR%\backend.log 2>&1"

echo   [INFO] Ожидание бэкенда (до 30 сек)...
call :waitForService "http://%LOCALHOST%:%BACKEND_PORT%/api/health" 30
if errorlevel 1 (
    echo   [ERROR] Бэкенд не ответил!
    if exist "%LOG_DIR%\backend.log" type "%LOG_DIR%\backend.log" | more +0
    goto script_error
)
echo   [OK] Бэкенд работает.
echo.

:: ============================================
:: ШАГ 3: Запуск фронтенда (Dev-режим)
:: ============================================
echo [3/5] Запуск фронтенда (порт %FRONTEND_PORT%)...
if not exist "%PROJECT_ROOT%\package.json" (
    echo   [ERROR] package.json не найден
    goto script_error
)

cd /d "%PROJECT_ROOT%"
:: ✅ Важно: передаем --host 127.0.0.1 напрямую в vite/react-scripts
start "Frontend" /MIN cmd /k "cd /d %PROJECT_ROOT% && set BROWSER=none && npm start -- --host %LOCALHOST% > %LOG_DIR%\frontend.log 2>&1"

echo   [INFO] Ожидание фронтенда (до 60 сек)...
call :waitForService "http://%LOCALHOST%:%FRONTEND_PORT%" 60
if errorlevel 1 (
    echo   [WARN] Фронтенд компилируется дольше обычного. Проверьте лог.
) else (
    echo   [OK] Фронтенд работает.
)
echo.

:: ============================================
:: ШАГ 4: Запуск Nginx
:: ============================================
echo [4/5] Запуск Nginx (порт %NGINX_PORT%)...
cd /d "%NGINX_DIR%"

:: Проверка конфига БЕЗ его модификации (модификация PowerShell удалена как опасная)
nginx -t > "%LOG_DIR%\nginx-test.log" 2>&1
if errorlevel 1 (
    echo   [ERROR] Ошибка в nginx.conf!
    type "%LOG_DIR%\nginx-test.log"
    echo   [INFO] Убедитесь, что в nginx.conf нет синтаксических ошибок.
    goto script_error
)
echo   [OK] Конфигурация Nginx валидна.

start "Nginx" /MIN nginx
ping 127.0.0.1 -n 3 >nul

tasklist /fi "imagename eq nginx.exe" | findstr /i nginx >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Nginx не запустился!
    goto script_error
)
echo   [OK] Nginx работает.
echo.

:: ============================================
:: ШАГ 5: Проверка и финал
:: ============================================
echo [5/5] Финальная проверка...
if "!HAS_CURL!"=="1" (
    call :checkService "http://%LOCALHOST%:%BACKEND_PORT%/api/health" "Backend"
    call :checkService "http://%LOCALHOST%:%FRONTEND_PORT%" "Frontend (Dev)"
    call :checkService "http://%LOCALHOST%:%NGINX_PORT%" "Nginx Proxy"
)

echo.
echo =====================================================
echo    ✅ ПРИЛОЖЕНИЕ УСПЕШНО ЗАПУЩЕНО!
echo =====================================================
echo    Адрес: http://%LOCALHOST%:%NGINX_PORT%
echo.
echo    ⚠️ ВАЖНО: Чтобы увидеть свежие изменения и 
echo    избежать старого кэша, в браузере нажмите:
echo    👉  Ctrl + F5  (или Ctrl + Shift + R)
echo =====================================================
echo.

set /p "OPEN=Открыть в браузере? (Y/N): "
if /i "!OPEN:~0,1!"=="Y" (
    start "" "http://%LOCALHOST%:%NGINX_PORT%"
)

:script_end
echo.
echo [INFO] Окно можно закрыть. Сервисы работают в фоне.
echo [INFO] Для остановки: taskkill /f /im node.exe ^& taskkill /f /im nginx.exe
pause >nul
exit /b 0

:script_error
echo.
echo =====================================================
echo    ❌ ПРОИЗОШЛА ОШИБКА ЗАПУСКА
echo    Прокрутите вывод вверх, чтобы увидеть детали.
echo =====================================================
pause >nul
exit /b 0

:: ============================================
:: 🔧 ФУНКЦИИ
:: ============================================
:waitForService
set "W_URL=%~1"
set "W_MAX=%~2"
set "W_TRY=0"
:w_loop
set /a W_TRY+=1
if !W_TRY! gtr !W_MAX! exit /b 1
if "!HAS_CURL!"=="1" (
    curl -s -o nul -w "%%{http_code}" "!W_URL!" | findstr "200 301 302 401" >nul 2>&1
) else (
    powershell -Command "try { iwr '!W_URL!' -TO 2 -EA Stop | out-null; exit 0 } catch { exit 1 }" >nul 2>&1
)
if !errorlevel! equ 0 exit /b 0
ping 127.0.0.1 -n 2 >nul
goto w_loop

:checkService
set "C_URL=%~1"
set "C_NAME=%~2"
if "!HAS_CURL!"=="1" (
    curl -s -o nul -w "%%{http_code}" "!C_URL!" | findstr "200 301 302 401" >nul 2>&1
    if !errorlevel! equ 0 (echo   [OK] !C_NAME!) else (echo   [WARN] !C_NAME!)
) else (
    echo   [SKIP] !C_NAME!
)
goto :eof