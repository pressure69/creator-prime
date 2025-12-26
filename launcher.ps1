param([string]$Action = "start")

$ProjectPath = Get-Location
$Port = 3000
$ServerURL = "http://localhost:$Port/live"
$PidFile = Join-Path $ProjectPath "server.pid"
$LogFile = Join-Path $ProjectPath "server.log"

function Start-Server {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║ 🚀 STARTING PRESSURE69 SERVER" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    if (Test-Path $PidFile) {
        $pid = Get-Content $PidFile
        try {
            $proc = Get-Process -Id $pid -ErrorAction Stop
            Write-Host "⚠️  Already running (PID: $pid)" -ForegroundColor Yellow
            Write-Host "📍 $ServerURL" -ForegroundColor Green
            return
        } catch {
            Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        }
    }

    Write-Host "🔧 Starting npm run dev..." -ForegroundColor Cyan
    $process = Start-Process -FilePath "npm" -ArgumentList "run dev" `
        -WorkingDirectory $ProjectPath `
        -RedirectStandardOutput $LogFile `
        -RedirectStandardError "$LogFile.err" `
        -WindowStyle Hidden `
        -PassThru

    if ($process) {
        $process.Id | Out-File $PidFile -Force
        Start-Sleep -Seconds 3
        
        Write-Host "✅ Server started!" -ForegroundColor Green
        Write-Host "🔹 PID: $($process.Id)" -ForegroundColor Cyan
        Write-Host "📍 URL: $ServerURL" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opening browser..." -ForegroundColor Yellow
        Start-Process $ServerURL -ErrorAction SilentlyContinue
    }
}

function Stop-Server {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║ 🛑 STOPPING SERVER" -ForegroundColor Red
    Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    
    if (-not (Test-Path $PidFile)) {
        Write-Host "❌ Server not running" -ForegroundColor Yellow
        return
    }

    $pid = Get-Content $PidFile
    try {
        $proc = Get-Process -Id $pid -ErrorAction Stop
        Write-Host "⏸️  Stopping PID $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force
        Start-Sleep -Seconds 1
        Remove-Item $PidFile -Force
        Write-Host "✅ Stopped!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Already stopped" -ForegroundColor Yellow
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    }
    Write-Host ""
}

function Restart-Server {
    Stop-Server
    Start-Sleep -Seconds 2
    Start-Server
}

function Get-Status {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ 📊 SERVER STATUS" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $PidFile)) {
        Write-Host "❌ Status: STOPPED" -ForegroundColor Red
        return
    }

    $pid = Get-Content $PidFile
    try {
        $proc = Get-Process -Id $pid -ErrorAction Stop
        Write-Host "✅ Status: RUNNING" -ForegroundColor Green
        Write-Host "🔹 PID: $pid" -ForegroundColor Cyan
        Write-Host "💾 Memory: $([math]::Round($proc.WorkingSet / 1MB, 2)) MB" -ForegroundColor Cyan
        Write-Host "🔗 $ServerURL" -ForegroundColor Green
    } catch {
        Write-Host "❌ Status: STOPPED (orphaned)" -ForegroundColor Red
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    }
    Write-Host ""
}

switch ($Action.ToLower()) {
    "start" { Start-Server }
    "stop" { Stop-Server }
    "restart" { Restart-Server }
    "status" { Get-Status }
    default { Start-Server }
}
