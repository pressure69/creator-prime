const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectPath = process.cwd();
const logFile = path.join(projectPath, 'server.log');
const pidFile = path.join(projectPath, 'server.pid');

console.log('[CREATOR-PRIME] Starting Next.js dev server...');

// Start Next.js using npx (cross-platform)
const proc = spawn('npx', [
  'next',
  'dev',
  '--port', '3000'
], {
  cwd: projectPath,
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true
});

// Write PID
fs.writeFileSync(pidFile, proc.pid.toString());
console.log(`[CREATOR-PRIME] Server PID: ${proc.pid}`);

// Capture output
const logStream = fs.createWriteStream(logFile, { flags: 'w' });

proc.stdout.on('data', (data) => {
  const msg = data.toString();
  logStream.write(msg);
  console.log(msg.trim());
});

proc.stderr.on('data', (data) => {
  const msg = data.toString();
  logStream.write(msg);
  console.error(msg.trim());
});

proc.on('close', (code) => {
  console.log(`[CREATOR-PRIME] Server exited with code ${code}`);
  logStream.end();
  if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
  process.exit(code);
});

console.log('[CREATOR-PRIME] Server running on http://localhost:3000/live');
