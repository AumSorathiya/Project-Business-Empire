@echo off
setlocal EnableDelayedExpansion
title Empire Architect - Business Tycoon Simulator
cd /d "%~dp0"

echo ======================================================================
echo   [EMPIRE ARCHITECT] Business Tycoon ^& Simulation
echo ======================================================================
echo   Starting local server and launching game in your default browser...
echo.

:: Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [*] Node.js runtime detected.
    echo [*] Initializing server.js...
    node server.js
    goto end
)

:: Fallback: Check for Python
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [*] Node.js not found, but Python was detected.
    echo [*] Launching Python static server on port 8080...
    start "" "http://localhost:8080"
    python -m http.server 8080
    goto end
)

:: Neither runtime found
echo [!] ERROR: Neither Node.js nor Python is available in your PATH.
echo.
echo     Empire Architect runs locally in any web browser, but requires
echo     a simple local runner (Node.js or Python) for ES module support.
echo.
echo     Please install Node.js (recommended) from:
echo     https://nodejs.org/
echo.
pause

:end
endlocal
