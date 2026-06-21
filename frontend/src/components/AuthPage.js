import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://interview-management-application.onrender.com/api";

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const resetMessages = () => {
    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    try {
      if (mode === "login") {
        const response = await axios.post(`${API_BASE}/auth/login`, {
          email,
          password
        });
        onLogin({ token: response.data.token, email: response.data.email });
      } else {
        await axios.post(`${API_BASE}/auth/register`, {
          email,
          password
        });
        setMessage("Registration successful. You can now log in.");
        setMode("login");
      }
    } catch (err) {
      const text = err?.response?.data?.error || "Unable to connect to the server.";
      setError(text);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h1>Admin Access</h1>
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              resetMessages();
              setMode("login");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              resetMessages();
              setMode("register");
            }}
          >
            Register
          </button>
        </div>

        {message && <div className="auth-message success">{message}</div>}
        {error && <div className="auth-message error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <p className="auth-note">
          {mode === "login"
            ? "Only registered admins can access the interview dashboard."
            : "Create an admin account to manage interviews."}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
