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

// Lấy hồ sơ người dùng
app.post('/get-profile', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT name, bio FROM profiles WHERE username = $1', [req.username]);
    if (result.rows.length === 0) {
      res.json(null);
    } else {
      res.json(result.rows[0]);
    }
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// Cập nhật hồ sơ người dùng
app.post('/update-profile', authenticate, async (req, res) => {
  console.log('Request body:', req.body);

  const { name, bio } = req.body;
  try {
    await pool.query(`
      INSERT INTO profiles (username, name, bio)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO UPDATE
      SET name = EXCLUDED.name, bio = EXCLUDED.bio
    `, [req.username, name, bio]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.listen(4003, () => {
  console.log('Profile service listening on port 4003');
});
