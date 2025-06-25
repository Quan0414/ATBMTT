// server-attacker.js
const express = require('express');
const path = require('path');

const app = express();

// Serve tĩnh folder public/attacker chứa attacker.html
app.use(express.static(path.join(__dirname, 'public/attacker')));

const PORT = 8081;
app.listen(PORT, 'attacker.local', () => {
  console.log(`→ Attacker server is running at http://attacker.local:${PORT}/attacker.html`);
});
