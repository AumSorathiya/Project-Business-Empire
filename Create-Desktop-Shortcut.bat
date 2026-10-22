@echo off
setlocal
title Empire Architect - Desktop Shortcut Installer
cd /d "%~dp0"

echo ======================================================================
echo   [EMPIRE ARCHITECT] Desktop Shortcut Creator
echo ======================================================================
echo.

set "TARGET=%~dp0Play-Game.bat"
set "SHORTCUT=%USERPROFILE%\Desktop\Empire Architect.lnk"
set "WORKDIR=%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%WORKDIR%'; $s.Description = 'Play Empire Architect - Idle Business Tycoon Game'; $s.Save()"

if exist "%USERPROFILE%\Desktop\Empire Architect.lnk" (
    echo [*] Success! Desktop shortcut created at:
    echo     "%USERPROFILE%\Desktop\Empire Architect.lnk"
    echo.
    echo [*] You can now double-click the "Empire Architect" icon on your Desktop
    echo     anytime to play the game in one click!
) else (
    echo [!] Could not create shortcut automatically.
    echo     You can right-click 'Play-Game.bat' and select:
    echo     'Show more options' -> 'Send to' -> 'Desktop (create shortcut)'
)

echo.
echo Press any key to close this installer.
pause >nul
endlocal
