// Retakes the MixVault screenshot for the site.
//
//   cd ../mixvault && npm run build && cd ../portfolio-site
//   node scripts/screenshots/mixvault.js
//
// Launches the built app as an isolated instance (its own MIXVAULT_USER_DATA,
// so nothing in the real settings or keychain is touched) pointed at the DJ
// crate, turns the window vibrancy off so the sidebar reads on a flat
// screenshot, and saves 1600x1000 PNGs of the Inbox, Library and Playlists
// into scripts/screenshots/out/. Convert the one you want with
//   ffmpeg -i scripts/screenshots/out/mixvault-library.png -q:v 3 src/assets/img/mixvault.jpg
const path = require('path'); const fs = require('fs'); const os = require('os');
const MV = path.resolve(__dirname, '../../../mixvault');
const OUT = path.join(__dirname, 'out');
const { _electron: electron } = require(MV + '/node_modules/playwright');
(async () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'mixvault-shot-'));
  const userData = path.join(base, 'userData'); fs.mkdirSync(userData);
  const APP = path.join(MV, 'release', 'app');
  const dll = path.join(APP, '.erb', 'dll', 'preload.js');
  if (!fs.existsSync(dll)) { fs.mkdirSync(path.dirname(dll), { recursive: true }); fs.copyFileSync(path.join(APP, 'dist/main/preload.js'), dll); }
  fs.writeFileSync(path.join(userData, 'mixvault.json'), JSON.stringify({
    inboxFolder: process.env.CRATE || path.join(os.homedir(), 'Music', 'DJ music'),
    updateSettings: { autoCheck: false }, toolsSettings: { keepYtDlpUpdated: false },
  }));
  const app = await electron.launch({
    executablePath: require(MV + '/node_modules/electron'), args: [APP],
    env: { ...process.env, NODE_ENV: 'production', MIXVAULT_USER_DATA: userData, MIXVAULT_SPOTIFY_LOGIN: '0' },
  });
  fs.mkdirSync(OUT, { recursive: true });
  const page = await app.firstWindow();
  await page.waitForSelector('.app-shell', { timeout: 60000 });
  await page.setViewportSize({ width: 1600, height: 1000 });
  await app.evaluate(({ BrowserWindow }) => { const w = BrowserWindow.getAllWindows()[0]; w.setSize(1600, 1000); w.center(); try { w.setVibrancy(null); } catch {} w.setBackgroundColor('#141418'); });
  await page.waitForTimeout(9000);
  await page.screenshot({ path: path.join(OUT, 'mixvault-inbox.png') });
  for (const [label, file] of [['Library', 'mixvault-library.png'], ['Playlists', 'mixvault-playlists.png']]) {
    const item = page.locator('.sidebar__item', { hasText: label }).first();
    if (await item.count()) { await item.click(); await page.waitForTimeout(2500); await page.screenshot({ path: path.join(OUT, file) }); }
  }
  await app.close();
  console.log('ok', base);
})().catch((e) => { console.error(e); process.exit(1); });
