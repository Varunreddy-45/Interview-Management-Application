const express = require("express");
const cors = require("cors");
const pool = require("./db");

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
    const result = await pool.query("SELECT * FROM interviews");
    res.json(result.rows);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});