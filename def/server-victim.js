// server-victim.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');  

const app = express();
const DATA_FILE = path.join(__dirname, 'likeData.json');

// Middleware để parse JSON body (nếu cần)
app.use(express.json());
// Middleware để parse cookie từ request
app.use(cookieParser());

// --- CORS setup để Attacker origin (http://localhost:8081) có thể gọi API ---
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://attacker.local:8081');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// --- Middleware để set cookie với SameSite=Strict ---
app.use((req, res, next) => {
  // Nếu user chưa có cookie likeSession, gán mới
  if (!req.cookies.likeSession) {
    const sessionValue = Date.now().toString(); // hoặc uuid, tuỳ bạn
    res.cookie('likeSession', sessionValue, {
      httpOnly: true,
      sameSite: 'Strict',   // <-- chặn hoàn toàn cross-site
      // secure: true,      // <-- nếu chạy HTTPS, bật lên. Ở localhost chạy HTTP có thể bỏ dòng này
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
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
// Có thể kiểm tra cookie nếu muốn: nếu (!req.cookies.likeSession) trả 403
app.post('/api/like', (req, res) => {
  // Ví dụ kiểm tra cookie:
  if (!req.cookies.likeSession) {
    return res.status(403).json({ error: 'No valid session cookie' });
  }

  const data = readCount();
  data.count = (data.count || 0) + 1;
  writeCount(data);
  res.json({ count: data.count });
});

// --- API: POST /api/reset → đặt lại về 0, trả về 0 ---
app.post('/api/reset', (req, res) => {
  // Ví dụ kiểm tra cookie trước khi reset:
  if (!req.cookies.likeSession) {
    return res.status(403).json({ error: 'No valid session cookie' });
  }

  const data = { count: 0 };
  writeCount(data);
  res.json({ count: 0 });
});

// --- Serve tĩnh folder chứa victim.html ---
app.use(express.static(path.join(__dirname, 'public/victim')));

const PORT = 3000;
app.listen(PORT, 'victim.local', () => {
  console.log(`→ Victim server is running at http://victim.local:${PORT}/victim.html`);
});

