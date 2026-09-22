const { execSync } = require('child_process');

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch (e) {
    if (e.stdout) console.log(e.stdout.toString().trim());
    if (e.stderr) console.error(e.stderr.toString().trim());
    return null;
  }
}

console.log('\n🔄 [TWS Auto-Sync] Syncing session state with GitHub...');

// 1. If local modifications exist, commit them first
const status = run('git status --porcelain');
if (status) {
  console.log('📦 Local changes detected. Staging and committing...');
  run('git add .');
  const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  run(`git commit -m "sync: update session state (${now} WIB)"`);
}

// 2. Pull remote changes with rebase
const pullRes = run('git pull --rebase origin main');
if (pullRes) console.log(pullRes);

// 3. Push to GitHub
const pushRes = run('git push origin main');
if (pushRes) console.log(pushRes);

console.log('✅ [TWS Auto-Sync] Successfully synchronized PC & Mac state!\n');
