@echo off
echo Starting Backend Debug > debug_log.txt
node -v >> debug_log.txt 2>&1
npm start >> debug_log.txt 2>&1
echo Done >> debug_log.txt
