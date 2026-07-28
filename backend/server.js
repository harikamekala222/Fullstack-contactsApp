// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2"); // updated to create connection here

const app = express();
app.use(cors());
app.use(express.json());

// ========================
// DATABASE CONNECTION
// ========================
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // from EB Environment Properties
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to DB");
  }
});

// ========================
// ROUTES
// ========================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Add a contact
app.post("/contacts", (req, res) => {
  const { name, phone, email } = req.body;
  db.query(
    "INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)",
    [name, phone, email],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Added" });
    }
  );
});

// Get all contacts
app.get("/contacts", (req, res) => {
  db.query("SELECT * FROM contacts", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Update a contact
app.put("/contacts/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;

  db.query(
    "UPDATE contacts SET name=?, phone=?, email=? WHERE id=?",
    [name, phone, email, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Updated" });
    }
  );
});

// Delete a contact
app.delete("/contacts/:id", (req, res) => {
  db.query("DELETE FROM contacts WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Deleted" });
  });
});

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000; // dynamic port for EB
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});