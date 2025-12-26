# PRESSURE69 PERSISTENT SERVER
# Runs in background, survives window close, only stoppable by PowerShell

$serverName = "PRESSURE69-SERVER"
$port = 3000
$logFile = "$PSScriptRoot\server.log"
$pidFile = "$PSScriptRoot\server.pid"

function Start-PressureServer {
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host "🎥 PRESSURE69 SERVER STARTUP" -ForegroundColor Magenta
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if already running
    if (Test-Path $pidFile) {
        $oldPid = Get-Content $pidFile
        try {
            $proc = Get-Process -Id $oldPid -ErrorAction Stop
            Write-Host "⚠️  Server already running (PID: $oldPid)" -ForegroundColor Yellow
            Write-Host "Visit: http://localhost:$port/live" -ForegroundColor Green
            return
        } catch {
            Remove-Item $pidFile -Force
        }
    }

    Write-Host "🚀 Starting Next.js server..." -ForegroundColor Green
    Write-Host "📍 Port: $port" -ForegroundColor Cyan
    Write-Host "📝 Logs: $logFile" -ForegroundColor Cyan
    Write-Host ""

    # Start npm dev in background
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" `
        -WorkingDirectory (Get-Location) `
        -RedirectStandardOutput $logFile `
        -RedirectStandardError "$logFile.err" `
        -WindowStyle Hidden `
        -PassThru

    $process.Id | Out-File $pidFile

    Write-Host "✅ Server started!" -ForegroundColor Green
    Write-Host "🔹 Process ID: $($process.Id)" -ForegroundColor Cyan
    Write-Host "🔗 Access at: http://localhost:$port/live" -ForegroundColor Green
    Write-Host ""
    Write-Host "Server is running in background (even if you close this window)" -ForegroundColor Yellow
    Write-Host "To stop: Run 'Stop-PressureServer' in PowerShell" -ForegroundColor Yellow
    Write-Host ""
}

function Stop-PressureServer {
    Write-Host "======================================" -ForegroundColor Red
    Write-Host "🛑 STOPPING PRESSURE69 SERVER" -ForegroundColor Red
    Write-Host "======================================" -ForegroundColor Red
    Write-Host ""

    if (-not (Test-Path $pidFile)) {
        Write-Host "❌ Server is not running" -ForegroundColor Yellow
        return
    }

    $pid = Get-Content $pidFile
    
    try {
        $proc = Get-Process -Id $pid -ErrorAction Stop
        Write-Host "Stopping process $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force
        Start-Sleep -Seconds 1
        Remove-Item $pidFile -Force
        Write-Host "✅ Server stopped!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Process not found or already stopped" -ForegroundColor Yellow
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host ""
}

function Get-PressureStatus {
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host "📊 PRESSURE69 SERVER STATUS" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""

    if (-not (Test-Path $pidFile)) {
        Write-Host "❌ Status: STOPPED" -ForegroundColor Red
        return
    }

    $pid = Get-Content $pidFile
    
    try {
        $proc = Get-Process -Id $pid -ErrorAction Stop
        Write-Host "✅ Status: RUNNING" -ForegroundColor Green
        Write-Host "🔹 Process ID: $pid" -ForegroundColor Cyan
        Write-Host "💾 Memory: $([math]::Round($proc.WorkingSet / 1MB, 2)) MB" -ForegroundColor Cyan
        Write-Host "⏱️  Uptime: $((Get-Date) - $proc.StartTime)" -ForegroundColor Cyan
        Write-Host "🔗 URL: http://localhost:$port/live" -ForegroundColor Green
    } catch {
        Write-Host "❌ Status: STOPPED (PID file orphaned)" -ForegroundColor Red
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host ""
}

function Restart-PressureServer {
    Write-Host "🔄 Restarting server..." -ForegroundColor Yellow
    Stop-PressureServer
    Start-Sleep -Seconds 2
    Start-PressureServer
}

function Watch-PressureServer {
    Write-Host "👁️  Watching server (press Ctrl+C to stop watching)..." -ForegroundColor Cyan
    Write-Host ""
    
    while ($true) {
        Clear-Host
        Get-PressureStatus
        
        if (Test-Path $pidFile) {
            $pid = Get-Content $pidFile
            try {
                $proc = Get-Process -Id $pid -ErrorAction Stop
                Write-Host "Last checked: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
            } catch {
                Write-Host "⚠️  Server crashed!" -ForegroundColor Red
                break
            }
        } else {
            Write-Host "⚠️  Server is down" -ForegroundColor Yellow
        }
        
        Start-Sleep -Seconds 5
    }
}

function View-PressureLogs {
    if (Test-Path $logFile) {
        Write-Host "📋 Server Logs:" -ForegroundColor Cyan
        Get-Content $logFile -Tail 50
    } else {
        Write-Host "❌ No logs found" -ForegroundColor Yellow
    }
}

# Auto-start if run directly
if ($MyInvocation.InvocationName -ne '.') {
    Start-PressureServer
}
