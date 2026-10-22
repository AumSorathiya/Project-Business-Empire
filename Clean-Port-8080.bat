@echo off
setlocal
title Empire Architect - Port 8080 Cleanup Utility
cd /d "%~dp0"

echo ======================================================================
echo   [PORT CLEANUP] Checking and Freeing Port 8080...
echo ======================================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$conns = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue; " ^
  "if ($conns) { " ^
  "  $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique | Where-Object { $_ -gt 0 }; " ^
  "  if ($pids) { " ^
  "    foreach ($pidToKill in $pids) { " ^
  "      try { " ^
  "        $proc = Get-Process -Id $pidToKill -ErrorAction SilentlyContinue; " ^
  "        if ($proc) { " ^
  "          Write-Host \"[*] Terminating process holding port 8080: $($proc.ProcessName) (PID: $pidToKill)...\"; " ^
  "          Stop-Process -Id $pidToKill -Force; " ^
  "          Write-Host \"[+] Successfully terminated PID $pidToKill.\"; " ^
  "        } " ^
  "      } catch { " ^
  "        Write-Host \"[!] Warning: Could not terminate PID $pidToKill : $_ \"; " ^
  "      } " ^
  "    } " ^
  "  } else { " ^
  "    Write-Host \"[*] Port 8080 is currently in TIME_WAIT or closing. No active process is bound.\"; " ^
  "  } " ^
  "} else { " ^
  "  Write-Host \"[+] Port 8080 is completely free!\"; " ^
  "}"

echo.
echo ======================================================================
echo   Port 8080 is ready. You can now run Play-Game.bat
echo ======================================================================
echo.
pause
endlocal
