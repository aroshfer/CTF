// server.js — serve static files + flag checking
// Usage: npm init -y && npm i express body-parser && node server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));


// Serve challenge page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'challenge.html')));


// Simple flag check endpoint
const FLAG = 'FLAG{reflected_xss_easy}';
app.post('/submit-flag', (req, res) => {
    const flag = req.body && req.body.flag;
    if (!flag) return res.status(400).json({ ok: false, message: 'no flag submitted' });
    if (flag.trim() === FLAG) return res.json({ ok: true, message: 'Correct! 🎉' });
    return res.json({ ok: false, message: 'Incorrect flag — try again.' });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Challenge served on http://localhost:${port}`));