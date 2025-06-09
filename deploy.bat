@echo off
setlocal

echo Installing dependencies...
npm install || goto :error

echo Running gbuild...
npm run gbuild || goto :error

echo Building...
npm run build || goto :error

echo Starting dev server in new window...
start cmd /k "npm run dev"

timeout /t 3 > nul

echo Opening browser to http://localhost:5173 ...
start "" http://localhost:5173/

echo ✅ Dev server running. Browser should be open.
goto :eof

:error
echo ❌ Error occurred. Stopping script.
pause
exit /b 1
