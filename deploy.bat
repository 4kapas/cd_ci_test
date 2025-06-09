@echo off
setlocal

set LOGFILE=deploy_log.txt
echo [START] %date% %time% > %LOGFILE%

echo Installing dependencies...
echo >> %LOGFILE% Installing dependencies...
npm install >> %LOGFILE% 2>&1 || goto :error

echo Running gbuild...
echo >> %LOGFILE% Running gbuild...
npm run gbuild >> %LOGFILE% 2>&1 || goto :error

echo Building...
echo >> %LOGFILE% Building...
npm run build >> %LOGFILE% 2>&1 || goto :error

echo Starting dev server in new window...
echo >> %LOGFILE% Starting dev server...
start cmd /k "npm run dev"

timeout /t 3 > nul

echo Opening browser to http://localhost:5173 ...
start "" http://localhost:5173/

echo ✅ Dev server running. Browser should be open.
echo [DONE] %date% %time% >> %LOGFILE%
goto :eof

:error
echo ❌ Error occurred. Check %LOGFILE% for details.
echo [ERROR] %date% %time% >> %LOGFILE%
pause
exit /b 1
