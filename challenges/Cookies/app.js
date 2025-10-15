const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// helpers
function xorBuffer(buf, key) {
  const out = Buffer.alloc(buf.length);
  for (let i = 0; i < buf.length; i++) out[i] = buf[i] ^ key.charCodeAt(i % key.length);
  return out;
}
function toHex(buf) { return buf.toString('hex'); }
function fromHex(hex) { return Buffer.from(hex, 'hex'); }
function toB64(buf) { return buf.toString('base64'); }
function fromB64(b64) { return Buffer.from(b64, 'base64'); }

// configure flag parts and key
const FLAG_PART_A = 'FLAG{c00k1e_';          // left half
const FLAG_PART_B = 'hunt_mastery}';         // right half
const XOR_KEY = 'splitkey42';               // keep secret in challenge metadata/hints

app.get('/set', (req, res) => {
  // Obfuscate part A -> hex (set HttpOnly)
  const aBuf = Buffer.from(FLAG_PART_A, 'utf8');
  const aXor = xorBuffer(aBuf, XOR_KEY);
  const ck1 = toHex(aXor);

  // Obfuscate part B -> base64 (not HttpOnly so accessible to JS)
  const bBuf = Buffer.from(FLAG_PART_B, 'utf8');
  const bXor = xorBuffer(bBuf, XOR_KEY);
  const ck2 = toB64(bXor);

  // Set cookies: ck1 is HttpOnly (hidden from document.cookie), ck2 is accessible
  res.cookie('ck1', ck1, { httpOnly: true, maxAge: 10 * 60 * 1000, sameSite: 'Lax' });
  res.cookie('ck2', ck2, { httpOnly: false, maxAge: 10 * 60 * 1000, sameSite: 'Lax' });

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', (req, res) => {
  const submitted = (req.body.flag || '').trim();
  const ck1 = req.cookies.ck1;
  const ck2 = req.cookies.ck2;

  if (!ck1 || !ck2) return res.send('<h3>Missing cookies. Hit <a href="/set">/set</a> first.</h3>');

  try {
    const partABuf = xorBuffer(fromHex(ck1), XOR_KEY);
    const partBBuf = xorBuffer(fromB64(ck2), XOR_KEY);
    const flag = partABuf.toString('utf8') + partBBuf.toString('utf8');

    if (submitted === flag) return res.send('<h2>Correct! Flag accepted.</h2>');
    return res.send(`<h3>Wrong flag. (expected length ${flag.length})</h3>`);
  } catch (e) {
    return res.send('<h3>Error processing cookies.</h3>');
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Challenge running on http://localhost:${PORT}`));
