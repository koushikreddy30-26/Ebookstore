@echo off
echo ========================================
echo   eBook Store Development Server
echo ========================================
echo.

echo Checking if MongoDB is configured...
if not exist "server\.env" (
    echo ERROR: server\.env file not found!
    echo Please create server\.env file first.
    echo See server\.env.example for template.
    echo.
    pause
    exit /b 1
)

echo Starting server in new window...
start "eBook Store - Server" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo Starting client in new window...
start "eBook Store - Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo   Server: http://localhost:5000
echo   Client: http://localhost:3000
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /FI "WindowTitle eq eBook Store - Server*" /T /F
taskkill /FI "WindowTitle eq eBook Store - Client*" /T /F

echo Servers stopped.
pause
