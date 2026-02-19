@echo off
echo Starting Stock Trading Web Application...

:: Start Backend
echo Starting Backend...
start "Backend Server" cmd /k "cd backend && npm run dev"

:: Start Frontend
echo Starting Frontend...
start "Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo Application components are starting in new windows.
echo Backend will be on http://localhost:5000
echo Frontend will be on http://localhost:5173 (or similar)
echo.
pause
