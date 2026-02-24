const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 CHANGE THE PASSWORD BELOW
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "portfolio_db",
  password: "2007nr",   // 👈 PUT YOUR POSTGRES PASSWORD HERE
  port: 5432,
});

// Home route
app.get("/", (req, res) => {
  res.send("Server connected to PostgreSQL");
});

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO public.contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.send("Message saved to database!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});