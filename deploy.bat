@echo off
echo Installing dependencies...
npm install

echo Running gbuild...
npm run gbuild

echo Building...
npm run build

echo ✅ Build complete. You can now check the 'dist' folder.
pause
