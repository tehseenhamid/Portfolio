// Portfolio server: serves the website and a tiny reviews API backed by a local SQLite database.
//   node server/server.js   ->  http://localhost:3000     (needs Node.js 22.13+, no packages to install)
const http = require('http');
const fs = require('fs');
const path = require('path');
let DatabaseSync;
try { ({ DatabaseSync } = require('node:sqlite')); }
catch (e) { console.error('This needs Node.js 22.13 or newer (built-in SQLite). Your version: ' + process.version); process.exit(1); }

const PORT = +process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');            // the website files (index.html, assets/) live one level up
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'reviews.db');
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';          // set to your site URL if the site is hosted elsewhere
const AUTO_PUBLISH = (process.env.AUTO_PUBLISH || 'true') !== 'false'; // false = you approve each review first

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');
db.exec(fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8'));

const listStmt = db.prepare("SELECT id, name, business, rating, review, created_at FROM portfolio_reviews WHERE approved = 1 ORDER BY created_at DESC, id DESC LIMIT 50");
const insertStmt = db.prepare("INSERT INTO portfolio_reviews (name, business, rating, review, approved, ip) VALUES (@name, @business, @rating, @review, @approved, @ip)");
const recentAll = db.prepare("SELECT COUNT(*) c FROM portfolio_reviews WHERE created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-10 minutes')");
const recentIp = db.prepare("SELECT COUNT(*) c FROM portfolio_reviews WHERE ip = ? AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')");

const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ico':'image/x-icon' };

const cors = { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors }); res.end(JSON.stringify(obj)); };
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > 10_000) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handleApi(req, res) {
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (req.method === 'GET') return json(res, 200, listStmt.all());
  if (req.method === 'POST') {
    let data; try { data = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: 'Invalid request' }); }
    if (data.website) return json(res, 201, { ok: true });                 // honeypot: pretend success to bots
    const row = { name: clean(data.name, 80), business: clean(data.business, 120) || null, rating: Math.round(+data.rating), review: clean(data.review, 1000), approved: AUTO_PUBLISH ? 1 : 0,
      ip: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim() };
    if (row.name.length < 2) return json(res, 422, { error: 'Please enter your name.' });
    if (!(row.rating >= 1 && row.rating <= 5)) return json(res, 422, { error: 'Please choose a rating from 1 to 5.' });
    if (row.review.length < 10) return json(res, 422, { error: 'Please write a little more.' });
    if (recentAll.get().c >= 10 || recentIp.get(row.ip).c >= 3) return json(res, 429, { error: 'Too many reviews right now, please try again later.' });
    insertStmt.run(row);
    return json(res, 201, { ok: true, published: AUTO_PUBLISH });
  }
  json(res, 405, { error: 'Method not allowed' });
}

function serveStatic(req, res) {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  const allowed = file === path.join(ROOT, 'index.html') || file === path.join(ROOT, 'studio.html') || file.startsWith(path.join(ROOT, 'assets') + path.sep);
  if (!allowed) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'public, max-age=300' });
    res.end(buf);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/reviews') return handleApi(req, res).catch(() => json(res, 500, { error: 'Server error' }));
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  serveStatic(req, res);
}).listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}   (database: ${DB_PATH})`));
