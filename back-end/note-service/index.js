const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware xác thực
function authenticate(req, res, next) {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.username = decoded.username;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Lưu note
app.post('/notes', authenticate, async (req, res) => {
  const { content } = req.body;
  try {
    await pool.query('INSERT INTO notes (username, content) VALUES ($1, $2)', [req.username, content]);
    res.json({ message: 'Note saved' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Lấy danh sách note
app.post('/my-notes', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, content, created_at FROM notes WHERE username = $1 ORDER BY created_at DESC',
      [req.username]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(4002, () => {
  console.log('Note service listening on port 4002');
});
