const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// ✅ PostgreSQL connection (Render)
const pool = new Pool({
  connectionString: "postgresql://portfolio_db_new_user:ISMPfC9E5uH0ehq4YKhsFP3nYjrQwMWb@dpg-d7348okr85hc73eigbi0-a.oregon-postgres.render.com/portfolio_db_new",
  ssl: {
    rejectUnauthorized: false
  }
});

// 👉 Test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Save message (Contact Form)
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.json({ success: true, message: "Message saved!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving message" });
  }
});

// ✅ Get messages (optional)
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});