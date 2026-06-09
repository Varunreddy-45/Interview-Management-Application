const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- POST: Schedule Interview ---------------- */
app.post("/api/interviews", (req, res) => {
  const { candidateName, email, role, interviewDate } = req.body;

  const sql =
    "INSERT INTO interviews(candidateName, email, role, interviewDate) VALUES (?, ?, ?, ?)";

  db.query(sql, [candidateName, email, role, interviewDate], (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).send(err);
    }
    res.send("Interview Scheduled");
  });
});

/* ---------------- GET: Fetch Interviews ---------------- */
app.get("/api/interviews", (req, res) => {
  db.query("SELECT * FROM interviews", (err, result) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Interview Management API is running 🚀");
});

/* ---------------- FIX FOR RENDER PORT ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});