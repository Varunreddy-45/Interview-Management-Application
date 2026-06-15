# Interview Management Application

This project is a simple interview scheduling and management app with:
- a React frontend for the user interface
- an Express/Node backend for API routes
- PostgreSQL support via the backend

## Project Structure

- `frontend/` – React app built with Create React App
- `backend/` – Express API server

## Prerequisites

Make sure you have the following installed:
- Node.js (v18 or newer recommended)
- npm
- PostgreSQL database and a valid `DATABASE_URL`

## Setup Instructions

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 3. Configure the database

Create a PostgreSQL database and set the environment variable before starting the backend:

```bash
export DATABASE_URL=postgres://username:password@host:port/database
```

On Windows PowerShell, use:

```powershell
$env:DATABASE_URL="postgres://username:password@host:port/database"
```

### 4. Run the backend

```bash
cd backend
npm start
```

The API will run on:
- http://localhost:5000

### 5. Run the frontend

```bash
cd frontend
npm start
```

The app will open on:
- http://localhost:3000

## Main API Endpoints

- `GET /` – health check
- `GET /test-db` – test database connection
- `GET /api/interviews` – fetch interviews
- `POST /api/interviews` – create an interview
- `PUT /api/interviews/:id/status` – update interview status
- `DELETE /api/interviews/:id` – delete an interview

## Notes

- The backend uses CORS and expects JSON requests.
- The frontend is configured to talk to the backend through the app logic in the React components.
- If the database connection fails, verify your `DATABASE_URL` value and PostgreSQL server availability.
