@echo off
echo Installing dependencies...
npm install

echo Running gbuild...
npm run gbuild

echo Building...
npm run build

echo Deploying to local server folder...
rmdir /s /q "C:\path\to\your\www\UOK"
mkdir "C:\path\to\your\www\UOK"
xcopy /E /I /Y .\dist\* "C:\path\to\your\www\UOK"

echo ✅ Deployment complete.
pause