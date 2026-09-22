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

console.log('\n🔄 [TWS Auto-Sync] Checking updates from GitHub...');

// 1. Pull latest from remote
const pullRes = run('git pull --rebase origin main');
if (pullRes) console.log(pullRes);

// 2. Check if there are local modifications
const status = run('git status --porcelain');
if (status) {
  console.log('📦 Local changes detected. Staging and pushing...');
  run('git add .');
  const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  run(`git commit -m "sync: auto-sync session state (${now} WIB)"`);
  const pushRes = run('git push origin main');
  if (pushRes) console.log(pushRes);
  console.log('✅ [TWS Auto-Sync] Successfully synced state to GitHub!\n');
} else {
  console.log('✅ [TWS Auto-Sync] Everything is already up to date with GitHub!\n');
}
