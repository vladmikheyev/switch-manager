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
set "SERVER_IP=10.182.63.130"

:: Создаём папку для логов если нет
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: ============================================
:: 🚀 ЗАГОЛОВОК
:: ============================================
echo.
echo =====================================================
echo    Switch Manager -- Полный запуск приложения
echo =====================================================
echo.

:: ============================================
:: ШАГ 1: Остановка старых процессов
:: ============================================
echo [1/6] Остановка старых процессов...

:: Останавливаем nginx
taskkill /f /im nginx.exe >nul 2>&1
if !errorlevel! equ 0 (
    echo   [OK] Nginx остановлен
) else (
    echo   [INFO] Nginx не был запущен
)

:: Останавливаем Node.js процессы нашего проекта
echo   [INFO] Остановка Node.js процессов...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: Ждём освобождения портов
echo   [INFO] Ожидание освобождения портов...
call :waitForPort %FRONTEND_PORT%
call :waitForPort %BACKEND_PORT%

echo.

:: ============================================
:: ШАГ 2: Запуск бэкенда
:: ============================================
echo [2/6] Запуск бэкенда (порт %BACKEND_PORT%)...

if not exist "%BACKEND_DIR%\server.js" (
    echo   [ERROR] server.js не найден в %BACKEND_DIR%
    pause
    exit /b 1
)

cd /d "%BACKEND_DIR%"
start "Backend" /MIN cmd /k "cd /d %BACKEND_DIR% && npm run dev > %LOG_DIR%\backend.log 2>&1"
timeout /t 3 /nobreak >nul

:: Ждём ответа от бэкенда
echo   [INFO] Ожидание готовности бэкенда...
call :waitForService "http://127.0.0.1:%BACKEND_PORT%/api/health" "backend" 30

if !errorlevel! equ 0 (
    echo   [OK] Бэкенд запущен
) else (
    echo   [WARN] Бэкенд не ответил за 30 сек (проверьте %LOG_DIR%\backend.log)
)

echo.

:: ============================================
:: ШАГ 3: Запуск фронтенда
:: ============================================
echo [3/6] Запуск фронтенда (порт %FRONTEND_PORT%)...

if not exist "%PROJECT_ROOT%\package.json" (
    echo   [ERROR] package.json не найден
    pause
    exit /b 1
)

cd /d "%PROJECT_ROOT%"
start "Frontend" /MIN cmd /k "cd /d %PROJECT_ROOT% && npm start > %LOG_DIR%\frontend.log 2>&1"
timeout /t 5 /nobreak >nul

:: Фронтенд может собираться долго -- даём больше времени
echo   [INFO] Ожидание сборки фронтенда (до 60 сек)...
call :waitForService "http://127.0.0.1:%FRONTEND_PORT%" "frontend" 60

if !errorlevel! equ 0 (
    echo   [OK] Фронтенд запущен
) else (
    echo   [WARN] Фронтенд ещё собирается (проверьте %LOG_DIR%\frontend.log)
)

echo.

:: ============================================
:: ШАГ 4: Запуск nginx
:: ============================================
echo [4/6] Запуск nginx (порт %NGINX_PORT%)...

cd /d "%NGINX_DIR%"

:: Тест конфигурации
nginx -t > "%LOG_DIR%\nginx-test.log" 2>&1
if !errorlevel! neq 0 (
    echo   [ERROR] Ошибка конфигурации nginx!
    type "%LOG_DIR%\nginx-test.log"
    pause
    exit /b 1
)
echo   [OK] Конфигурация nginx валидна

:: Запуск
start "Nginx" /MIN nginx -c conf/nginx.conf
timeout /t 2 /nobreak >nul

:: Проверка процесса
tasklist /fi "imagename eq nginx.exe" | findstr /i nginx >nul
if !errorlevel! neq 0 (
    echo   [ERROR] Nginx не запустился!
    pause
    exit /b 1
)
echo   [OK] Nginx запущен

echo.

:: ============================================
:: ШАГ 5: Проверка сервисов
:: ============================================
echo [5/6] Проверка сервисов...

call :checkService "http://127.0.0.1:%BACKEND_PORT%/api/health" "Backend API"
call :checkService "http://127.0.0.1:%FRONTEND_PORT%" "Frontend (dev)"
call :checkService "http://127.0.0.1:%NGINX_PORT%" "Nginx proxy"

echo.

:: ============================================
:: ШАГ 6: Готово!
:: ============================================
echo [6/6] Готово!
echo.
echo =====================================================
echo   Приложение запущено успешно!
echo =====================================================
echo.
echo   Доступ по адресу:
echo   http://%SERVER_IP%:%NGINX_PORT%
echo.
echo   Порты:
echo   - Фронтенд (dev):  :%FRONTEND_PORT%
echo   - Бэкенд (API):    :%BACKEND_PORT%
echo   - Nginx (прокси):  :%NGINX_PORT%
echo.
echo   Логи:
echo   %LOG_DIR%
echo.
echo   Для остановки: taskkill /f /im node.exe ^& taskkill /f /im nginx.exe
echo.

:: Опционально: открыть браузер
set /p OPEN_BROWSER="Открыть приложение в браузере? (Y/N): "
if /i "!OPEN_BROWSER!"=="Y" (
    start "" "http://%SERVER_IP%:%NGINX_PORT%"
    echo   [OK] Браузер открыт
)

echo.
pause
exit /b 0

:: ============================================
:: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
:: ============================================

:waitForPort
:: Ждёт освобождения порта (до 10 попыток)
set "port=%~1"
for /l %%i in (1,1,10) do (
    netstat -ano | findstr :%port% | findstr LISTENING >nul
    if !errorlevel! neq 0 (
        echo   [OK] Порт %port% свободен
        goto :eof
    )
    timeout /t 1 /nobreak >nul
)
echo   [WARN] Порт %port% всё ещё занят
goto :eof

:waitForService
:: Ждёт ответа от сервиса: url name timeout_sec
set "url=%~1"
set "name=%~2"
set "timeout=%~3"
set "attempt=0"

:wait_loop
set /a attempt+=1
if !attempt! gtr %timeout% (
    exit /b 1
)

curl -s -o nul -w "%%{http_code}" "%url%" | findstr "200 301 302 401" >nul
if !errorlevel! equ 0 (
    exit /b 0
)

timeout /t 1 /nobreak >nul
goto :wait_loop

:checkService
:: Проверяет сервис и выводит результат
set "url=%~1"
set "name=%~2"

curl -s -o nul -w "%%{http_code}" "%url%" | findstr "200 301 302 401" >nul
if !errorlevel! equ 0 (
    echo   [OK] %name% работает
) else (
    echo   [WARN] %name% не отвечает
)
goto :eof