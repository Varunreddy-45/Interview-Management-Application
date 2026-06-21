require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { predictFit } = require("./mlModel");

const app = express();

const users = [];
const useDatabase = Boolean(process.env.DATABASE_URL);
const jwtSecret = process.env.JWT_SECRET || "supersecretkey";
const tokenExpiry = "4h";

async function getAdminByEmail(email) {
  if (useDatabase) {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    return result.rows[0];
  }

  return users.find((user) => user.email === email);
}

async function createAdmin(email, passwordHash) {
  if (useDatabase) {
    await pool.query(
      "INSERT INTO admins (email, password) VALUES ($1, $2)",
      [email, passwordHash]
    );
    return await getAdminByEmail(email);
  }

  const newUser = { id: Date.now(), email, password: passwordHash };
  users.push(newUser);
  return newUser;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = payload;
    next();
  });
}

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

app.post("/api/predict-fit", authenticateToken, (req, res) => {
  try {
    const result = predictFit(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- AUTH ---------------- */
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    const existing = await getAdminByEmail(email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "Admin already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await createAdmin(email.toLowerCase(), passwordHash);

    res.json({ message: "Admin registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to register admin." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const admin = await getAdminByEmail(email.toLowerCase());
    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ email: admin.email }, jwtSecret, {
      expiresIn: tokenExpiry
    });

    res.json({ token, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to login." });
  }
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({ email: req.user.email });
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
app.post("/api/interviews", authenticateToken, async (req, res) => {
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
app.get("/api/interviews", authenticateToken, async (req, res) => {
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
app.put("/api/interviews/:id/status", authenticateToken, async (req, res) => {
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
app.delete("/api/interviews/:id", authenticateToken, async (req, res) => {
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
    if (useDatabase) {
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

      await pool.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

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