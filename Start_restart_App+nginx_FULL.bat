@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ============================================
::  НАСТРОЙКИ ПУТЕЙ (Проверьте их!)
:: ============================================
set "PROJECT_ROOT=C:\Users\vg.mikheev\Documents\Swmanager\switch-manager"
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "NGINX_DIR=C:\nginx"
set "LOG_DIR=%PROJECT_ROOT%\logs"
set "FRONTEND_PORT=3000"
set "BACKEND_PORT=5000"
set "NGINX_PORT=8088"
set "SERVER_IP=10.182.63.130"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: Проверка наличия curl
where curl >nul 2>&1 && set "HAS_CURL=1" || set "HAS_CURL=0"

:: ============================================
::  ЗАГОЛОВОК
:: ============================================
echo.
echo =====================================================
echo    Switch Manager — Полный запуск приложения
echo =====================================================
echo.
echo [INFO] Пути:
echo   Проект: %PROJECT_ROOT%
echo   Бэкенд: %BACKEND_DIR%
echo   Nginx:  %NGINX_DIR%
echo   Логи:   %LOG_DIR%
echo.

:: ============================================
:: ШАГ 1: Остановка процессов (БЕЗОПАСНАЯ)
:: ============================================
echo [1/7] Остановка старых процессов...

echo   [1.1] Остановка nginx...
taskkill /f /im nginx.exe >nul 2>&1 || ver >nul
ping 127.0.0.1 -n 3 >nul

echo   [1.2] Остановка Node.js...
:: Запускаем taskkill в подпроцессе cmd /c, чтобы не убить этот скрипт
cmd /c taskkill /f /im node.exe >nul 2>&1 || ver >nul
ping 127.0.0.1 -n 4 >nul

echo   [1.3] Ожидание освобождения портов...
for %%p in (3000 5000 8088) do @netstat -ano | findstr ":%%p " | findstr "LISTENING" >nul && (echo Порт %%p:  ЗАНЯТ) || (echo Порт %%p:  СВОБОДЕН)
:: pause >nul
:: call :forceFreePort %FRONTEND_PORT% "frontend" || ver >nul (не работает!)
:: call :forceFreePort %BACKEND_PORT% "backend" || ver >nul (не работает!)
echo.

:: ============================================
:: ШАГ 2: Запуск бэкенда
:: ============================================
echo [2/7] Запуск бэкенда (порт %BACKEND_PORT%)...
if not exist "%BACKEND_DIR%\server.js" (
    echo   [ERROR] server.js не найден в %BACKEND_DIR%
    goto script_error
)

cd /d "%BACKEND_DIR%"
echo   [CMD] Запуск npm run dev...
start "Backend" /MIN cmd /k "cd /d %BACKEND_DIR% && npm run dev > %LOG_DIR%\backend.log 2>&1"

echo   [INFO] Ожидание готовности бэкенда (до 45 сек)...
call :waitForService "http://127.0.0.1:%BACKEND_PORT%/api/health" "backend" 45
if errorlevel 1 (
    echo   [ERROR] Бэкенд не ответил за 45 сек!
    echo   [LOG] Последние строки лога:
    if exist "%LOG_DIR%\backend.log" type "%LOG_DIR%\backend.log" | more +0
    goto script_error
)
echo   [OK] Бэкенд запущен
echo.

:: ============================================
:: ШАГ 3: Запуск фронтенда
:: ============================================
echo [3/7] Запуск фронтенда (порт %FRONTEND_PORT%)...
if not exist "%PROJECT_ROOT%\package.json" (
    echo   [ERROR] package.json не найден
    goto script_error
)

cd /d "%PROJECT_ROOT%"

::  Запрещаем React открывать браузер
set "BROWSER=none"

echo   [CMD] Запуск npm start...
start "Frontend" /MIN cmd /k "cd /d %PROJECT_ROOT% && npm start > %LOG_DIR%\frontend.log 2>&1"

echo   [INFO] Ожидание сборки фронтенда (до 90 сек)...
call :waitForService "http://127.0.0.1:%FRONTEND_PORT%" "frontend" 90
if errorlevel 1 (
    echo   [WARN] Фронтенд не ответил сразу (возможно, еще компилируется)
    echo   [LOG] Проверьте: %LOG_DIR%\frontend.log
) else (
    echo   [OK] Фронтенд запущен
)
echo.

:: ============================================
:: ШАГ 4: Запуск nginx
:: ============================================
echo [4/7] Запуск nginx (порт %NGINX_PORT%)...
cd /d "%NGINX_DIR%"

nginx -t > "%LOG_DIR%\nginx-test.log" 2>&1
if errorlevel 1 (
    echo   [ERROR] Ошибка конфигурации nginx!
    type "%LOG_DIR%\nginx-test.log"
    goto script_error
)
echo   [OK] Конфигурация валидна

start "Nginx" /MIN nginx -c conf/nginx.conf
ping 127.0.0.1 -n 4 >nul

tasklist /fi "imagename eq nginx.exe" | findstr /i nginx >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Nginx не запустился!
    goto script_error
)
echo   [OK] Nginx запущен
echo.

:: ============================================
:: ШАГ 5: Проверка сервисов
:: ============================================
echo [5/7] Проверка сервисов...
if "!HAS_CURL!"=="1" (
    call :checkService "http://127.0.0.1:%BACKEND_PORT%/api/health" "Backend API"
    call :checkService "http://127.0.0.1:%FRONTEND_PORT%" "Frontend"
    call :checkService "http://127.0.0.1:%NGINX_PORT%" "Nginx proxy"
) else (
    echo   [INFO] curl не найден, проверка пропущена
)
echo.

:: ============================================
:: ШАГ 6: Готово
:: ============================================
echo [6/7] Готово!
echo.
echo =====================================================
echo    Приложение запущено!
echo =====================================================
echo    http://%SERVER_IP%:%NGINX_PORT%
echo    Порты: :%FRONTEND_PORT% / :%BACKEND_PORT% / :%NGINX_PORT%
echo    Логи: %LOG_DIR%
echo    Стоп:   taskkill /f /im node.exe ^& taskkill /f /im nginx.exe
echo.

:: Опционально: открыть браузер
:ask_browser
set /p "OPEN_BROWSER= Открыть в браузере (Y/N): "
set "OPEN_BROWSER=!OPEN_BROWSER:~0,1!"
if /i "!OPEN_BROWSER!"=="Y" (
    echo   [OK] Открываю браузер...
    start "" "http://%SERVER_IP%:%NGINX_PORT%"
) else (
    echo   [INFO] Браузер не открываем
)

:: ============================================
::  ФИНАЛЬНАЯ ПАУЗА (ОКНО НЕ ЗАКРОЕТСЯ)
:: ============================================
:script_end
echo.
echo =====================================================
echo    СКРИПТ ЗАВЕРШЁН
echo   Окно останется открытым. Нажмите любую клавишу для выхода.
echo =====================================================
pause >nul
exit /b 0

:script_error
echo.
echo =====================================================
echo    ПРОИЗОШЛА ОШИБКА
echo   Прокрутите вывод вверх, чтобы увидеть детали.
echo =====================================================
pause >nul
exit /b 0

:: ============================================
::  ФУНКЦИИ (УПРОЩЕННЫЕ И СТАБИЛЬНЫЕ)
:: ============================================

:forceFreePort
:: Просто ждет, пока порт освободится (taskkill уже отработал на шаге 1)
set "P_PORT=%~1"
set "P_NAME=%~2"
set "P_TRY=0"

:p_wait
set /a P_TRY+=1
if !P_TRY! gtr 10 (
    echo   [WARN] Порт !P_PORT! всё ещё занят, продолжаем...
    goto :eof
)

:: Проверяем, занят ли порт. Если netstat НЕ нашел LISTENING (errorlevel 1), значит порт свободен
netstat -ano | findstr /c:":!P_PORT! " | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    echo   [OK] Порт !P_PORT! (!P_NAME!) свободен
    goto :eof
)

echo   [INFO] Ожидание освобождения порта !P_PORT!...
ping 127.0.0.1 -n 2 >nul
goto p_wait

:waitForService
set "W_URL=%~1"
set "W_NAME=%~2"
set "W_MAX=%~3"
set "W_TRY=0"

:w_loop
set /a W_TRY+=1
if !W_TRY! gtr !W_MAX! exit /b 1

if "!HAS_CURL!"=="1" (
    curl -s -o nul -w "%%{http_code}" "!W_URL!" | findstr "200 301 302 401" >nul 2>&1
) else (
    powershell -Command "try { Invoke-WebRequest -Uri '!W_URL!' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
)
if errorlevel 0 exit /b 0

ping 127.0.0.1 -n 2 >nul
goto w_loop

:checkService
set "C_URL=%~1"
set "C_NAME=%~2"

if "!HAS_CURL!"=="1" (
    curl -s -o nul -w "%%{http_code}" "!C_URL!" | findstr "200 301 302 401" >nul 2>&1
    if errorlevel 0 (echo   [OK] !C_NAME! работает) else (echo   [WARN] !C_NAME! не отвечает)
) else (
    echo   [SKIP] !C_NAME! (curl не установлен)
)
goto :eof