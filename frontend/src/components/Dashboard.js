import React from "react";
import InterviewForm from "./InterviewForm";

function Dashboard({ token, onLogout, email }) {
  return (
    <div>
      <div className="header-bar">
        <div>
          <h1>Interview Management Application</h1>
          <p>Admin: {email}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
      <InterviewForm token={token} />
    </div>
  );
}

export default Dashboard;
