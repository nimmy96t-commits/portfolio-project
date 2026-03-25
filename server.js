const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// PostgreSQL connection (Render DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Create table (runs automatically)
pool.query(`
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    message TEXT
  )
`).then(() => console.log("Table ready"))
  .catch(err => console.error(err));

// 👉 SEND MESSAGE
app.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    console.log("New Message:", name, email, message);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// 👉 GET MESSAGES
app.get('/messages', async (req, res) => {
  const result = await pool.query('SELECT * FROM messages');
  res.json(result.rows);
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});