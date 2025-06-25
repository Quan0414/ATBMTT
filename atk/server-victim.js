// server-victim.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();
const DATA_FILE = path.join(__dirname, 'likeData.json');

// Middleware để parse JSON body
app.use(express.json());
// Middleware để parse cookie từ request
app.use(cookieParser());

// --- CORS setup cho Attacker (http://attacker.local:8081) ---
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://attacker.local:8081');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// --- Middleware để set cookie với SameSite=Strict ---
app.use((req, res, next) => {
  if (!req.cookies.likeSession) {
    const sessionValue = Date.now().toString();
    res.cookie('likeSession', sessionValue, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    console.log('Đã gán cookie likeSession =', sessionValue);
  }
  next();
});

// --- Hàm đọc/ghi file likeData.json ---
function readCount() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { count: 0 };
  }
}

function writeCount(obj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
}

// --- API: GET /api/like-count → trả về số like hiện tại ---
app.get('/api/like-count', (req, res) => {
  const data = readCount();
  res.json({ count: data.count || 0 });
});

// --- API: POST /api/like → tăng count, trả về số mới ---
app.post('/api/like', (req, res) => {
  if (!req.cookies.likeSession) {
    return res.status(403).json({ error: 'No valid session cookie' });
  }
  const data = readCount();
  data.count = (data.count || 0) + 1;
  writeCount(data);
  res.json({ count: data.count });
});

// --- API: POST /api/reset → đặt lại về 0 ---
app.post('/api/reset', (req, res) => {
  if (!req.cookies.likeSession) {
    return res.status(403).json({ error: 'No valid session cookie' });
  }
  writeCount({ count: 0 });
  res.json({ count: 0 });
});

// Serve tĩnh folder public/victim chứa victim.html
app.use(express.static(path.join(__dirname, 'public/victim')));

const PORT = 3000;
app.listen(PORT, 'localhost', () => {
  console.log(`→ Victim server is running at http://localhost:${PORT}/victim.html`);
});
