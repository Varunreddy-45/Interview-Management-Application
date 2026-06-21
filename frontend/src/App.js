import React, { useEffect, useState } from "react";
import axios from "axios";
import InterviewForm from "./components/InterviewForm";
import AuthPage from "./components/AuthPage";

const API_BASE = process.env.REACT_APP_API_URL || "https://interview-management-application.onrender.com/api";

function App() {
  const [auth, setAuth] = useState({ token: null, email: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("authEmail");

    if (!token) {
      setAuth({ token: null, email: null, loading: false });
      return;
    }

    axios
      .get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setAuth({ token, email: response.data.email, loading: false });
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authEmail");
        setAuth({ token: null, email: null, loading: false });
      });
  }, []);

  const handleLogin = ({ token, email }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authEmail", email);
    setAuth({ token, email, loading: false });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authEmail");
    setAuth({ token: null, email: null, loading: false });
  };

  if (auth.loading) {
    return (
      <div className="container">
        <h1>Interview Management Application</h1>
        <p>Checking admin session...</p>
      </div>
    );
  }

  if (!auth.token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <div className="header-bar">
        <div>
          <h1>Interview Management Application</h1>
          <p>Admin: {auth.email}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <InterviewForm token={auth.token} />
    </div>
  );
}

export default App;
