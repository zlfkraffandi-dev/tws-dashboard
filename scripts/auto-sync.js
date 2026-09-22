const { execSync } = require('child_process');
const path = require('path');

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', cwd: path.join(__dirname, '..') }).trim();
  } catch (e) {
    return null;
  }
}

let isSyncing = false;

function performSync() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    // 1. Check if there are local uncommitted changes
    const status = run('git status --porcelain');
    if (status) {
      console.log(`[Auto-Sync] Local changes detected at ${new Date().toLocaleTimeString('id-ID')}. Staging & committing...`);
      run('git add .');
      const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      run(`git commit -m "sync: live state auto-save (${now} WIB)"`);
    }

    // 2. Fetch remote to see if remote has new commits
    run('git fetch origin main');
    const behind = run('git rev-list HEAD..origin/main --count');
    
    if (behind && parseInt(behind) > 0) {
      console.log(`[Auto-Sync] Remote has ${behind} new commit(s). Pulling updates...`);
      run('git pull --rebase origin main');
      console.log(`[Auto-Sync] ✅ Synced latest changes from other device!`);
    }

    // 3. Push if local is ahead of remote
    const ahead = run('git rev-list origin/main..HEAD --count');
    if (ahead && parseInt(ahead) > 0) {
      console.log(`[Auto-Sync] Pushing ${ahead} local commit(s) to GitHub...`);
      run('git push origin main');
      console.log(`[Auto-Sync] ✅ Successfully pushed state to GitHub!`);
    }
  } catch (err) {
    console.error('[Auto-Sync Error]:', err.message);
  } finally {
    isSyncing = false;
  }
}

console.log('🚀 [TWS Auto-Sync Engine] Started! Polling and auto-syncing every 20s in the background...');
// Run immediately on start
performSync();

// Poll every 20 seconds
setInterval(performSync, 20000);
