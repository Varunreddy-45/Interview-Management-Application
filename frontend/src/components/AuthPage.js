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
    <div className="auth-container">
      <div className="auth-wrapper">
        
        {/* Left Side: Brand Panel */}
        <div className="auth-brand">
          <div className="brand-logo-section">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="brand-name">Interview Scheduler</div>
          </div>
          
          <div className="brand-content">
            <h1 className="brand-title">Interview Management</h1>
            <p className="brand-subtitle">
              A premium admin portal to evaluate candidate fit, schedule technical interviews, and streamline your recruitment workflow.
            </p>
            
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="feature-text">Automated Candidate Fit Evaluation</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="feature-text">Instant Email Notifications via EmailJS</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="feature-text">Secure PostgreSQL / Local Data Store</div>
              </div>
            </div>
          </div>
          
          <div className="brand-footer">
            © {new Date().getFullYear()} Interview Management. All rights reserved.
          </div>
        </div>
        
        {/* Right Side: Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2>Admin Portal</h2>
            <p>Access the candidate scheduling system</p>
          </div>
          
          <div className="auth-toggle-container">
            <button
              type="button"
              className={`auth-toggle-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                resetMessages();
                setMode("login");
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-toggle-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => {
                resetMessages();
                setMode("register");
              }}
            >
              Sign Up
            </button>
          </div>

          {message && (
            <div className="auth-status-message success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{message}</span>
            </div>
          )}
          
          {error && (
            <div className="auth-status-message error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="auth-input-group">
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
            </div>
            
            <div className="auth-input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            </div>
            
            <button type="submit" className="auth-submit-btn">
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default AuthPage;
