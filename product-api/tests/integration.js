// Integration test dengan database sementara; tidak menghapus dev.db milik pengguna.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'product-api-test-'));
process.env.DATABASE_URL = 'file:' + path.join(temp, 'test.db').replaceAll('\\', '/');
const prisma = require('../config/prisma');
const cases = require('./scenarios.json');
const variables = {};
const results = [];
const snapshots = {};
let child;
let baseUrl;
function runNode(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, env: process.env, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || String(result.error));
}
async function start() {
  child = spawn(process.execPath, ['app.js'], { cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Server startup timeout')), 15000);
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.once('exit', (code) => { clearTimeout(timer); reject(new Error(`Server berhenti: ${code}; ${output}`)); });
    child.stderr.on('data', (data) => { output += data; });
    child.stdout.on('data', (data) => {
      output += data;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { baseUrl = `http://127.0.0.1:${match[1]}`; clearTimeout(timer); resolve(); }
    });
  });
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const closed = once(child, 'exit');
  child.kill();
  await closed;
}
const all = () => prisma.product.findMany({ orderBy: { id: 'asc' } });
const render = (text) => text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
  assert.notEqual(variables[key], undefined, `Variabel ${key} belum tersedia`);
  return variables[key];
});
async function main() {
  runNode(['scripts/init-db.js']);
  runNode([path.join(path.dirname(require.resolve('prisma/package.json')), 'build/index.js'), 'migrate', 'deploy']);
  runNode(['prisma/seed.js']);
  await start();
  assert.deepEqual(await all(), require('../data/products'));
  for (const c of cases) {
    const before = await all();
    const raw = c.raw ?? (c.body ? render(JSON.stringify(c.body).replace(/"(\{\{\w+\}\})"/g, '$1')) : undefined);
    const response = await fetch(baseUrl + render(c.path), {
      method: c.method,
      headers: raw === undefined ? {} : { 'Content-Type': 'application/json' },
      body: raw,
    });
    const body = await response.json();
    assert.equal(response.status, c.status, `${c.name}: ${JSON.stringify(body)}`);
    assert.match(response.headers.get('content-type'), /application\/json/);
    if (c.capture) {
      assert.ok(Number.isInteger(body.id) && body.id > 0);
      variables[c.capture] = body.id;
    }
    for (const [key, value] of Object.entries(c.expected || {})) assert.deepEqual(body[key], value, c.name);
    const after = await all();
    if (c.method === 'GET' || c.status >= 400) assert.deepEqual(after, before, 'Request gagal/GET tidak boleh mengubah database');
    if (c.path === '/products' && c.method === 'GET') assert.deepEqual(body, after);
    if (c.method === 'POST' && c.status === 201) {
      assert.equal(after.length, before.length + 1);
      assert.deepEqual(await prisma.product.findUnique({ where: { id: body.id } }), body);
    }
    if (c.method === 'PUT' && c.status === 200) {
      assert.equal(after.length, before.length);
      assert.deepEqual(await prisma.product.findUnique({ where: { id: body.id } }), body);
    }
    if (c.method === 'DELETE' && c.status === 200) {
      assert.equal(after.length, before.length - 1);
      assert.equal(await prisma.product.findUnique({ where: { id: body.data.id } }), null);
    }
    if (c.snapshot) snapshots[c.snapshot] = { before, after };
    results.push({ name: c.name, method: c.method, path: render(c.path), requestBody: raw, expectedStatus: c.status, actualStatus: response.status, response: body, passed: true });
    console.log(`PASS ${c.name} (${response.status})`);
    // Restart proses Node sesudah PUT, sebelum GET berikutnya.
    if (c.snapshot === 'put') {
      await stop();
      await start();
      const persisted = await (await fetch(baseUrl + `/products/${variables.productId}`)).json();
      assert.equal(persisted.name, 'Penghapus Premium');
      assert.equal(persisted.price, 3500);
      results.push({ name: 'Persistensi setelah restart proses server', passed: true });
      console.log('PASS Persistensi setelah restart proses server');
      runNode(['prisma/seed.js']);
      assert.deepEqual(await all(), after, 'Seed kedua tidak menimpa/menggandakan data');
      results.push({ name: 'Seed ulang tidak mengubah data', passed: true });
      console.log('PASS Seed ulang tidak mengubah data');
    }
  }
  assert.deepEqual(await all(), require('../data/products'));
  const out = path.join(root, 'docs', 'evidence', 'tugas-4');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'automated-test-results.json'), JSON.stringify({ executedAt: new Date().toISOString(), node: process.version, prisma: require('@prisma/client/package.json').version, total: results.length, passed: results.length, results }, null, 2) + '\n');
  fs.writeFileSync(path.join(out, 'database-before-after.json'), JSON.stringify(snapshots, null, 2) + '\n');
  console.log(`\n${results.length}/${results.length} pengujian lulus. Hasil tersimpan di docs/evidence/tugas-4/.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  await stop();
  await prisma.$disconnect();
  fs.rmSync(temp, { recursive: true, force: true });
});
