@echo off
echo Installing dependencies...
npm install

echo Running gbuild...
npm run gbuild

echo Building...
npm run build

echo Starting dev server...
start cmd /k "npm run dev"

timeout /t 3 > nul

echo Opening browser to http://localhost:5173 ...
start "" http://localhost:5173/

echo ✅ Dev server running. Browser should be open.
