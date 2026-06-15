# Interview Management Application

A simple full-stack interview scheduling and candidate fit evaluation app built with React, Express, and PostgreSQL.

## Features
- Schedule interviews and store them in the backend
- View, update, and delete interview records
- Estimate candidate fit with a lightweight AI-style scoring model
- Send status emails using EmailJS

## Tech Stack
- Frontend: React + React Scripts
- Backend: Express + Node.js
- Database: PostgreSQL (with an in-memory fallback when `DATABASE_URL` is not set)

## Project Structure
- `frontend/` — React UI for scheduling interviews and viewing records
- `backend/` — Express API, database access, and fit prediction logic

## Getting Started

### 1. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Start the backend
```bash
cd backend
npm start
```
The API will run on `http://localhost:5000`.

### 3. Start the frontend
```bash
cd frontend
npm start
```
The React app will open in your browser on the default CRA port.

## Environment Variables
For PostgreSQL storage, set:
```bash
DATABASE_URL=your_postgresql_connection_string
```

If this is not set, the backend will use an in-memory interview store for local testing.

## Notes
- The candidate fit prediction uses a simple weighted score model in `backend/mlModel.js`.
- EmailJS is configured in the frontend form for interview notifications.
