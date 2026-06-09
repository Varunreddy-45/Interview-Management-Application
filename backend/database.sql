CREATE DATABASE interview_management;

USE interview_management;

CREATE TABLE interviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidateName VARCHAR(100),
  email VARCHAR(100),
  role VARCHAR(100),
  interviewDate DATETIME
);