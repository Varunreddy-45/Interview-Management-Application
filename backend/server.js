const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/interviews", (req, res) => {

  const {
    candidateName,
    email,
    role,
    interviewDate
  } = req.body;

  const sql =
    "INSERT INTO interviews(candidateName, email, role, interviewDate) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [candidateName, email, role, interviewDate],
    (err, result) => {

      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Interview Scheduled");
      }

    }
  );

});

app.get("/api/interviews", (req, res) => {

  db.query(
    "SELECT * FROM interviews",
    (err, result) => {

      if (err) {
        res.status(500).send(err);
      } else {
        res.json(result);
      }

    }
  );

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});