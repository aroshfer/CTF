<<<<<<< HEAD
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = path.join(__dirname, 'ctf.db');
if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE); // reset each run (for CTF testing)
const db = new sqlite3.Database(DB_FILE);

// create schema & seed
db.serialize(() => {
  db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, secret TEXT)`);
  db.run(`CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, body TEXT)`);

  // seed some users; the real flag is in the 'admin' record
  db.run(`INSERT INTO users (username, secret) VALUES (?,?)`, ['alice', 'no-flag-here']);
  db.run(`INSERT INTO users (username, secret) VALUES (?,?)`, ['bob', 'nothing-to-see']);
  db.run(`INSERT INTO users (username, secret) VALUES (?,?)`, ['admin', 'FLAG{sql_injection_deep_dive}']);

  // add a harmless comment
  db.run(`INSERT INTO comments (username, body) VALUES (?,?)`, ['alice', 'Hello world']);
});

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// helper WAF-ish filter used ONLY on /search to make it harder
function naiveWAF(q) {
  // very small toy filter — blocks obvious keywords and characters
  // (challenge: bypass this by encoding, comment tricks, or using other vectors)
  const banned = [/\bselect\b/i, /\bunion\b/i, /--/, /\bwhere\b/i, /\bexec\b/i, /\bdelete\b/i];
  for (const r of banned) if (r.test(q)) return { blocked: true, reason: 'waf_block' };
  if (q.length > 60) return { blocked: true, reason: 'too_long' };
  return { blocked: false };
}

// ---------- Routes ----------

// Home page + form (public/index.html should guide players)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// 1) /search?q=   => demonstrates naive WAF + vulnerable LIKE-based SQL (error/union harder)
//    Intent: user searches for username. WAF blocks obvious keywords so player must bypass.
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const wf = naiveWAF(q);
  if (wf.blocked) return res.status(406).send(`<h3>Input blocked by filter (${wf.reason}). Try another input.</h3>`);

  // VERY IMPORTANT: this query is intentionally unsafe for the challenge
  // It uses direct string concatenation, but it also interacts with LIKE patterns
  const sql = `SELECT id, username FROM users WHERE username LIKE '%${q}%' LIMIT 5`;
  console.log('[search] SQL:', sql);
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    res.send(`<h3>Search results for: ${q}</h3><pre>${JSON.stringify(rows, null, 2)}</pre>`);
  });
});

// 2) /comment (POST) => stores user input safely (prepared statement)
//    But comments are later used unsafely (second-order SQLi) in /recent
app.post('/comment', (req, res) => {
  const user = (req.body.username || 'guest').slice(0, 50);
  const body = (req.body.body || '').slice(0, 300);
  db.run(`INSERT INTO comments (username, body) VALUES (?,?)`, [user, body], function(err) {
    if (err) return res.status(500).send('<h3>DB insert failed</h3>');
    res.send('<h3>Comment stored. Thanks.</h3>');
  });
});

// 3) /recent => displays recent comments BUT constructs a query that uses stored username unsafely
//    This is the second-order vector — attacker can store data via /comment then trigger /recent
app.get('/recent', (req, res) => {
  // show last 10 comments but _also_ try to join with users using the stored username UNSAFELY
  // vulnerable: we embed comment.username into an inner SELECT
  const sql = `SELECT c.id, c.username, c.body, (SELECT secret FROM users WHERE username='` +
              `'||c.username||'') as leaked FROM comments c ORDER BY c.id DESC LIMIT 10`;
  // Note: the concatenation is intentional to simulate a developer mistake when building a SQL string
  console.log('[recent] SQL:', sql);
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    res.send(`<h3>Recent comments</h3><pre>${JSON.stringify(rows, null, 2)}</pre>`);
  });
});

// 4) /profile?id=  => vulnerable to error-based boolean blind SQLi
//    The code uses the id param directly inside WHERE and also allows crafted boolean expressions
app.get('/profile', (req, res) => {
  let id = req.query.id || '1';

  // naive sanitization keep digits only — but you can bypass via clever payloads in some DBs.
  // For the challenge we intentionally allow the parameter directly so advanced payloads can be used.

  const sql = `SELECT id, username FROM users WHERE id = ${id}`; // vulnerable
  console.log('[profile] SQL:', sql);
  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    if (!row) return res.send('<h3>No such user</h3>');
    res.send(`<h3>Profile: ${row.username}</h3><p>id=${row.id}</p>`);
  });
});

// 5) /leak-cookie => demonstrates cookie-based vector. server reads cookie 'uid' and uses it unsafely
app.get('/leak-cookie', (req, res) => {
  // If user sets a cookie 'uid', it will be embedded unsafely into SQL below
  // This is an optional vector players can abuse if they can control their cookies in the browser
  const uid = req.cookies.uid || '1';
  const sql = `SELECT id, username FROM users WHERE id = ${uid}`; // unsafe
  console.log('[leak-cookie] SQL:', sql);
  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    res.send(`<h3>Cookie-based lookup</h3><pre>${JSON.stringify(row,null,2)}</pre>`);
  });
});

// 6) /hint  -> gives graded hints to help players if stuck (not too revealing)
app.get('/hint', (req, res) => {
  const level = parseInt(req.query.level || '1');
  if (level <= 1) return res.send('<h3>Hint 1:</h3><p>Try both stored comments and direct parameters. One cookie is also used in a SQL expression.</p>');
  if (level === 2) return res.send('<h3>Hint 2:</h3><p>The flag is in users.secret (admin). Think about error-based boolean or second-order injections.</p>');
  return res.send('<h3>Hint 3:</h3><p>Use an intercepted Set-Cookie header, a comment you control, or craft a boolean that triggers a SQL error when true.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SQLi CTF running at http://localhost:${PORT}`));
=======
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = path.join(__dirname, 'ctf.db');
if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE); // reset each run (for CTF testing)
const db = new sqlite3.Database(DB_FILE);

// create schema & seed
db.serialize(() => {
  db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, secret TEXT)`);
  db.run(`CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, body TEXT)`);

  // seed some users; the real flag is in the 'admin' record
  db.run(`INSERT INTO users (username, secret) VALUES (?,?)`, ['alice', 'no-flag-here']);
  db.run(`INSERT INTO users (username, secret) VALUES (?,?)`, ['bob', 'nothing-to-see']);
  db.run(`INSERT INTO users (username, secret) VALUES (?,?)`, ['admin', 'FLAG{sql_injection_deep_dive}']);

  // add a harmless comment
  db.run(`INSERT INTO comments (username, body) VALUES (?,?)`, ['alice', 'Hello world']);
});

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// helper WAF-ish filter used ONLY on /search to make it harder
function naiveWAF(q) {
  // very small toy filter — blocks obvious keywords and characters
  // (challenge: bypass this by encoding, comment tricks, or using other vectors)
  const banned = [/\bselect\b/i, /\bunion\b/i, /--/, /\bwhere\b/i, /\bexec\b/i, /\bdelete\b/i];
  for (const r of banned) if (r.test(q)) return { blocked: true, reason: 'waf_block' };
  if (q.length > 60) return { blocked: true, reason: 'too_long' };
  return { blocked: false };
}

// ---------- Routes ----------

// Home page + form (public/index.html should guide players)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// 1) /search?q=   => demonstrates naive WAF + vulnerable LIKE-based SQL (error/union harder)
//    Intent: user searches for username. WAF blocks obvious keywords so player must bypass.
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const wf = naiveWAF(q);
  if (wf.blocked) return res.status(406).send(`<h3>Input blocked by filter (${wf.reason}). Try another input.</h3>`);

  // VERY IMPORTANT: this query is intentionally unsafe for the challenge
  // It uses direct string concatenation, but it also interacts with LIKE patterns
  const sql = `SELECT id, username FROM users WHERE username LIKE '%${q}%' LIMIT 5`;
  console.log('[search] SQL:', sql);
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    res.send(`<h3>Search results for: ${q}</h3><pre>${JSON.stringify(rows, null, 2)}</pre>`);
  });
});

// 2) /comment (POST) => stores user input safely (prepared statement)
//    But comments are later used unsafely (second-order SQLi) in /recent
app.post('/comment', (req, res) => {
  const user = (req.body.username || 'guest').slice(0, 50);
  const body = (req.body.body || '').slice(0, 300);
  db.run(`INSERT INTO comments (username, body) VALUES (?,?)`, [user, body], function(err) {
    if (err) return res.status(500).send('<h3>DB insert failed</h3>');
    res.send('<h3>Comment stored. Thanks.</h3>');
  });
});

// 3) /recent => displays recent comments BUT constructs a query that uses stored username unsafely
//    This is the second-order vector — attacker can store data via /comment then trigger /recent
app.get('/recent', (req, res) => {
  // show last 10 comments but _also_ try to join with users using the stored username UNSAFELY
  // vulnerable: we embed comment.username into an inner SELECT
  const sql = `SELECT c.id, c.username, c.body, (SELECT secret FROM users WHERE username='` +
              `'||c.username||'') as leaked FROM comments c ORDER BY c.id DESC LIMIT 10`;
  // Note: the concatenation is intentional to simulate a developer mistake when building a SQL string
  console.log('[recent] SQL:', sql);
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    res.send(`<h3>Recent comments</h3><pre>${JSON.stringify(rows, null, 2)}</pre>`);
  });
});

// 4) /profile?id=  => vulnerable to error-based boolean blind SQLi
//    The code uses the id param directly inside WHERE and also allows crafted boolean expressions
app.get('/profile', (req, res) => {
  let id = req.query.id || '1';

  // naive sanitization keep digits only — but you can bypass via clever payloads in some DBs.
  // For the challenge we intentionally allow the parameter directly so advanced payloads can be used.

  const sql = `SELECT id, username FROM users WHERE id = ${id}`; // vulnerable
  console.log('[profile] SQL:', sql);
  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    if (!row) return res.send('<h3>No such user</h3>');
    res.send(`<h3>Profile: ${row.username}</h3><p>id=${row.id}</p>`);
  });
});

// 5) /leak-cookie => demonstrates cookie-based vector. server reads cookie 'uid' and uses it unsafely
app.get('/leak-cookie', (req, res) => {
  // If user sets a cookie 'uid', it will be embedded unsafely into SQL below
  // This is an optional vector players can abuse if they can control their cookies in the browser
  const uid = req.cookies.uid || '1';
  const sql = `SELECT id, username FROM users WHERE id = ${uid}`; // unsafe
  console.log('[leak-cookie] SQL:', sql);
  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
    res.send(`<h3>Cookie-based lookup</h3><pre>${JSON.stringify(row,null,2)}</pre>`);
  });
});

// 6) /hint  -> gives graded hints to help players if stuck (not too revealing)
app.get('/hint', (req, res) => {
  const level = parseInt(req.query.level || '1');
  if (level <= 1) return res.send('<h3>Hint 1:</h3><p>Try both stored comments and direct parameters. One cookie is also used in a SQL expression.</p>');
  if (level === 2) return res.send('<h3>Hint 2:</h3><p>The flag is in users.secret (admin). Think about error-based boolean or second-order injections.</p>');
  return res.send('<h3>Hint 3:</h3><p>Use an intercepted Set-Cookie header, a comment you control, or craft a boolean that triggers a SQL error when true.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SQLi CTF running at http://localhost:${PORT}`));
>>>>>>> 6cd235d1aad7beabbda8b99226829b9b92fef45b
