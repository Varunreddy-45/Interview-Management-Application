const { Pool } = require("pg");

let pool;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Using in-memory interview storage for this session.");

  const interviews = [];

  pool = {
    async query(text, params = []) {
      const normalized = text.trim().toUpperCase();

      if (normalized.startsWith("SELECT")) {
        return { rows: [...interviews].sort((a, b) => b.id - a.id) };
      }

      if (normalized.startsWith("INSERT INTO INTERVIEWS")) {
        const [candidateName, email, role, interviewDate] = params;
        const newInterview = {
          id: Date.now(),
          candidateName,
          email,
          role,
          interviewDate,
          status: "Scheduled"
        };

        interviews.unshift(newInterview);
        return { rowCount: 1, rows: [newInterview] };
      }

      if (normalized.startsWith("UPDATE INTERVIEWS")) {
        const [status, id] = params;
        const interview = interviews.find((item) => String(item.id) === String(id));

        if (!interview) {
          return { rowCount: 0, rows: [] };
        }

        interview.status = status;
        return { rowCount: 1, rows: [interview] };
      }

      if (normalized.startsWith("DELETE FROM INTERVIEWS")) {
        const [id] = params;
        const index = interviews.findIndex((item) => String(item.id) === String(id));

        if (index === -1) {
          return { rowCount: 0, rows: [] };
        }

        interviews.splice(index, 1);
        return { rowCount: 1, rows: [] };
      }

      throw new Error("Unsupported in-memory query: " + text);
    }
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

module.exports = pool;