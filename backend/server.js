require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { predictFit } = require("./mlModel");

const app = express();

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Timeout fix
app.use((req, res, next) => {
  req.setTimeout(15000);
  res.setTimeout(15000);
  next();
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Interview Management API is running 🚀");
});

app.post("/api/predict-fit", (req, res) => {
  try {
    const result = predictFit(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- TEST DB ---------------- */
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- POST: Schedule Interview ---------------- */
app.post("/api/interviews", async (req, res) => {
  const { candidateName, email, role, interviewDate } = req.body;

  try {
    await pool.query(
      "INSERT INTO interviews(candidateName, email, role, interviewDate) VALUES ($1,$2,$3,$4)",
      [candidateName, email, role, interviewDate]
    );

    res.json({ message: "Interview Scheduled Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET: Fetch Interviews ---------------- */
app.get("/api/interviews", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        candidatename AS "candidateName",
        email,
        role,
        interviewdate AS "interviewDate",
        status
      FROM interviews
      ORDER BY id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- PUT: Update Interview Status ---------------- */
app.put("/api/interviews/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      "UPDATE interviews SET status = $1 WHERE id = $2",
      [status, id]
    );

    res.json({ message: "Status Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE: Delete Interview ---------------- */
app.delete("/api/interviews/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM interviews WHERE id = $1",
      [id]
    );

    res.json({ message: "Interview Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        candidateName VARCHAR(255),
        email VARCHAR(255),
        role VARCHAR(255),
        interviewDate VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Scheduled'
      )
    `);
    console.log("Database ready");
  } catch (err) {
    console.error("Database init failed:", err.message);
  }
}

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});