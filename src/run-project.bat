@echo off
setlocal

echo.
echo =================================================
echo =         eBook Store Project Launcher          =
echo =================================================
echo.

echo --- Running Pre-flight Checks ---

:: Check for server .env file
if not exist "server\.env" (
    echo [ERROR] 'server\.env' file not found.
    echo Please create it by following the SETUP_GUIDE.md before running this script.
    pause
    exit /b 1
)

:: Check for client .env file
if not exist "client\.env" (
    echo [ERROR] 'client\.env' file not found.
    echo Please create it by following the SETUP_GUIDE.md before running this script.
    pause
    exit /b 1
)

echo All checks passed. Starting setup...
echo.

echo --- [1/5] Setting up Server ---
cd server
echo Installing server dependencies...
call npm install
echo.

echo --- [2/5] Seeding Database ---
echo Populating database with sample books...
call node seedBooks.js
echo.

echo --- [3/5] Starting Server ---
echo Starting the backend server in a new window...
start "eBook Store - Server" cmd /k "npm run dev"
cd ..
echo.

echo --- [4/5] Setting up Client ---
cd client
echo Installing client dependencies...
call npm install
echo.

echo --- [5/5] Starting Client ---
echo Starting the frontend application...
call npm start

endlocal