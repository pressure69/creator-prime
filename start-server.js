const { spawn } = require('child_process');
const path = require('path');

const projectPath = process.cwd();
const logFile = path.join(projectPath, 'server.log');
const pidFile = path.join(projectPath, 'server.pid');
const fs = require('fs');

// Start Next.js dev server
const child = spawn('node', [
  path.join(projectPath, 'node_modules', '.bin', 'next'),
  'dev',
  '-p', '3000'
], {
  cwd: projectPath,
  stdio: 'pipe',
  detached: true
});

// Write PID
fs.writeFileSync(pidFile, child.pid.toString());

// Log output
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
child.stdout.pipe(logStream);
child.stderr.pipe(logStream);

// Detach and exit
child.unref();

console.log(`✅ Server started (PID: ${child.pid})`);
console.log(`📝 Logs: ${logFile}`);
console.log(`🔗 Visit: http://localhost:3000/live`);

process.exit(0);
