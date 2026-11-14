// Tests DOM React (JSDOM) terhadap API Express + SQLite nyata.
// JSDOM tidak menguji rendering piksel, focus trap, atau layout browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'product-component-'));
process.env.DATABASE_URL = `file:${path.join(temp, 'test.db').replaceAll('\\', '/')}`;
const prisma = require('../config/prisma');
let child, cleanup, dom;
const results = [];
const snapshots = {};
const all = () => prisma.product.findMany({ orderBy: { id: 'asc' } });
function pass(name) { results.push({ name, passed: true }); console.log(`PASS ${name}`); }
function run(args) {
  const r = spawnSync(process.execPath, args, { cwd: root, env: process.env, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
}
async function main() {
  run(['scripts/init-db.js']); run(['node_modules/prisma/build/index.js', 'migrate', 'deploy']); run(['prisma/seed.js']);
  child = spawn(process.execPath, ['app.js'], { cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  const baseUrl = await new Promise((resolve, reject) => {
    let log = '';
    const timer = setTimeout(() => reject(new Error('Startup timeout')), 15000);
    child.stdout.on('data', (data) => { log += data; const m = log.match(/http:\/\/localhost:\d+/); if (m) { clearTimeout(timer); resolve(m[0]); } });
    child.once('error', (e) => { clearTimeout(timer); reject(e); });
  });
  const { JSDOM } = require('jsdom');
  dom = new JSDOM('<!doctype html><html><body></body></html>', { url: baseUrl, pretendToBeVisual: true });
  for (const key of ['window', 'document', 'HTMLElement', 'HTMLDialogElement', 'MutationObserver', 'Node', 'Event', 'KeyboardEvent', 'getComputedStyle']) {
    global[key] = key === 'window' ? dom.window : key === 'document' ? dom.window.document : dom.window[key];
  }
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
  // Native dialog lifecycle is not implemented by JSDOM. Only open state is shimmed.
  global.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  global.HTMLDialogElement.prototype.close = function () { this.open = false; };
  const realFetch = global.fetch;
  let simulateSaveFailure = false, simulateLoadFailure = false, slowSave = false;
  global.fetch = async (url, options = {}) => {
    if ((simulateSaveFailure && options.method === 'POST') || (simulateLoadFailure && !options.method)) {
      return new Response(JSON.stringify({ message: 'Gangguan server yang disimulasikan untuk pengujian.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }
    if (slowSave && options.method === 'POST') await new Promise((r) => setTimeout(r, 150));
    return realFetch(new URL(url, baseUrl), options);
  };
  const React = require('react');
  const testing = require('@testing-library/react');
  const { render, screen, within, waitFor } = testing;
  cleanup = testing.cleanup;
  const user = require('@testing-library/user-event').default.setup();
  const bundled = require('esbuild').buildSync({ entryPoints: [path.join(root, 'client/src/App.jsx')], bundle: true, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic', write: false });
  const loaded = new Module(path.join(root, 'tests/App.bundle.cjs'));
  loaded.paths = Module._nodeModulePaths(root);
  loaded._compile(bundled.outputFiles[0].text, path.join(root, 'tests/App.bundle.cjs'));
  const App = loaded.exports.default;
  const mount = () => render(React.createElement(App));
  mount();
  await screen.findByRole('article', { name: 'Produk Buku' });
  assert.equal(screen.getAllByRole('article').length, 5); pass('GET: komponen menampilkan 5 produk dari API');
  const search = screen.getByRole('textbox', { name: 'Cari nama produk' });
  await user.type(search, '  pULpEn  ');
  assert.equal(screen.getAllByRole('article').length, 1); pass('Pencarian nama tidak peka huruf besar/kecil');
  await user.clear(search); await user.type(search, 'zzzzzz');
  screen.getByRole('heading', { name: 'Produk tidak ditemukan' }); pass('Pencarian tanpa hasil menampilkan empty state');
  await user.click(screen.getByRole('button', { name: 'Hapus Pencarian', exact: true }));
  const before = await all();
  await user.click(screen.getByRole('button', { name: 'Tambah Produk', exact: true }));
  await user.click(screen.getByRole('button', { name: 'Simpan Produk', exact: true }));
  screen.getByText('Nama produk wajib diisi.'); screen.getByText('Harga harus berupa angka lebih dari 0.');
  assert.deepEqual(await all(), before); pass('Form kosong ditolak tanpa menulis database');
  await user.type(screen.getByLabelText('Nama Produk', { exact: true }), 'Stabilo Uji');
  const price = screen.getByLabelText('Harga (Rp)', { exact: true });
  await user.type(price, '0'); await user.click(screen.getByRole('button', { name: 'Simpan Produk', exact: true }));
  screen.getByText('Harga harus berupa angka lebih dari 0.'); assert.deepEqual(await all(), before); pass('Harga nol ditolak pada form');
  await user.clear(price); await user.type(price, '-100'); await user.click(screen.getByRole('button', { name: 'Simpan Produk', exact: true }));
  screen.getByText('Harga harus berupa angka lebih dari 0.'); assert.deepEqual(await all(), before); pass('Harga negatif ditolak pada form');
  await user.click(screen.getByRole('button', { name: 'Batal', exact: true }));
  assert.ok(screen.queryByRole('dialog') === null, 'Dialog harus sudah tertutup'); assert.deepEqual(await all(), before); pass('Batal tambah menutup dialog tanpa menyimpan');
  await user.click(screen.getByRole('button', { name: 'Tambah Produk', exact: true }));
  await user.type(screen.getByLabelText('Nama Produk', { exact: true }), 'Stabilo Uji');
  await user.type(screen.getByLabelText('Harga (Rp)', { exact: true }), '9000');
  simulateSaveFailure = true;
  await user.click(screen.getByRole('button', { name: 'Simpan Produk', exact: true }));
  await screen.findByRole('alert');
  assert.equal(screen.getByLabelText('Nama Produk', { exact: true }).value, 'Stabilo Uji');
  assert.deepEqual(await all(), before); pass('API gagal: pesan tampil, input tetap, database tidak berubah (simulasi respons)');
  simulateSaveFailure = false; slowSave = true;
  snapshots.post = { before: await all() };
  await user.click(screen.getByRole('button', { name: 'Simpan Produk', exact: true }));
  assert.equal(screen.getByRole('button', { name: 'Menyimpan…', exact: true }).disabled, true); pass('Tombol simpan dinonaktifkan selama request berjalan');
  await waitFor(() => assert.ok(screen.queryByRole('dialog') === null, 'Dialog harus sudah tertutup'));
  snapshots.post.after = await all();
  const created = snapshots.post.after.find((p) => p.name === 'Stabilo Uji');
  assert.ok(created); assert.equal(created.price, 9000); pass('POST lewat handler React menyimpan produk ke SQLite');
  let card = screen.getByRole('article', { name: 'Produk Stabilo Uji', exact: true });
  await user.click(within(card).getByRole('button', { name: 'Edit', exact: true }));
  assert.equal(screen.getByLabelText('Nama Produk', { exact: true }).value, 'Stabilo Uji');
  assert.equal(screen.getByLabelText('Harga (Rp)', { exact: true }).value, '9000'); pass('Edit membuka data produk yang dipilih melalui props');
  await user.clear(screen.getByLabelText('Nama Produk', { exact: true }));
  await user.type(screen.getByLabelText('Nama Produk', { exact: true }), 'Tidak Disimpan');
  await user.click(screen.getByRole('button', { name: 'Batal', exact: true }));
  assert.equal((await prisma.product.findUnique({ where: { id: created.id } })).name, 'Stabilo Uji'); pass('Batal edit tidak mengubah database');
  await user.click(within(card).getByRole('button', { name: 'Edit', exact: true }));
  await user.clear(screen.getByLabelText('Nama Produk', { exact: true }));
  await user.type(screen.getByLabelText('Nama Produk', { exact: true }), 'Stabilo Premium');
  await user.clear(screen.getByLabelText('Harga (Rp)', { exact: true }));
  await user.type(screen.getByLabelText('Harga (Rp)', { exact: true }), '12000');
  snapshots.put = { before: await all() };
  await user.click(screen.getByRole('button', { name: 'Simpan Perubahan', exact: true }));
  await waitFor(() => assert.ok(screen.queryByRole('dialog') === null, 'Dialog harus sudah tertutup'));
  snapshots.put.after = await all();
  assert.deepEqual(snapshots.put.after.find((p) => p.id === created.id), { id: created.id, name: 'Stabilo Premium', price: 12000 });
  pass('PUT melalui handler memperbarui nama/harga tanpa mengganti ID');
  cleanup(); mount();
  card = await screen.findByRole('article', { name: 'Produk Stabilo Premium', exact: true }); pass('Muat ulang komponen membaca perubahan yang tersimpan');
  await user.click(within(card).getByRole('button', { name: 'Hapus', exact: true }));
  screen.getByRole('dialog', { name: 'Hapus Produk?' });
  await user.click(screen.getByRole('button', { name: 'Batal', exact: true }));
  assert.ok(await prisma.product.findUnique({ where: { id: created.id } })); pass('Batal hapus mempertahankan produk');
  snapshots.delete = { before: await all() };
  await user.click(within(card).getByRole('button', { name: 'Hapus', exact: true }));
  await user.click(screen.getByRole('button', { name: 'Hapus Produk', exact: true }));
  await waitFor(() => assert.ok(screen.queryByRole('dialog') === null, 'Dialog harus sudah tertutup'));
  snapshots.delete.after = await all();
  assert.equal(await prisma.product.findUnique({ where: { id: created.id } }), null); pass('DELETE setelah konfirmasi menghapus record dari SQLite');
  cleanup(); simulateLoadFailure = true; mount(); await screen.findByRole('alert');
  simulateLoadFailure = false; await user.click(screen.getByRole('button', { name: 'Coba Lagi' }));
  await screen.findByRole('article', { name: 'Produk Buku' }); pass('Gagal memuat dapat dicoba ulang (simulasi respons)');
  await prisma.product.deleteMany(); cleanup(); mount();
  await screen.findByRole('heading', { name: 'Belum ada produk' }); pass('Database kosong menampilkan empty state');
  const dir = path.join(root, 'docs/evidence');
  fs.writeFileSync(path.join(dir, 'component-test-results.json'), JSON.stringify({ executedAt: new Date().toISOString(), environment: 'JSDOM + React Testing Library + Express HTTP + SQLite sementara', total: results.length, passed: results.length, results, limitations: 'Bukan browser visual; native dialog showModal/close dipolyfill. Screenshot, layout, focus trap, dan Escape browser belum diverifikasi.' }, null, 2)+'\n');
  fs.writeFileSync(path.join(dir, 'component-database-before-after.json'), JSON.stringify(snapshots,null,2)+'\n');
  console.log(`\n${results.length}/${results.length} pemeriksaan komponen lulus.`);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => {
  cleanup?.(); dom?.window.close();
  if (child && child.exitCode === null) { const done = once(child, 'exit'); child.kill(); await done; }
  await prisma.$disconnect(); fs.rmSync(temp, { recursive: true, force: true });
});
