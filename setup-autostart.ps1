# To enable auto-start on Windows boot, run this in PowerShell as Admin:

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -WindowStyle Hidden -File 'C:\Users\DELL OPTIPLEX 5040\projects\creator-prime\server.ps1'"

$trigger = New-ScheduledTaskTrigger -AtStartup

$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -RunLevel Highest

$task = Register-ScheduledTask -TaskName "PRESSURE69-Server" `
  -Action $action `
  -Trigger $trigger `
  -Principal $principal `
  -Description "Persistent PRESSURE69 Next.js Server" `
  -Force

Write-Host "✅ Task scheduled! Server will auto-start on boot" -ForegroundColor Green
