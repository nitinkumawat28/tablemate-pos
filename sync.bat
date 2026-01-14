@echo off
echo Syncing changes to GitHub...
git add .
set /p commit_msg="Enter commit message (default: 'Auto sync'): "
if "%commit_msg%"=="" set commit_msg="Auto sync"
git commit -m "%commit_msg%"
git push origin master
echo Sync complete!
pause
