import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

const API_BASE = process.env.REACT_APP_API_URL || "https://interview-management-application.onrender.com/api";

function InterviewForm({ token }) {
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    role: "",
    interviewDate: ""
  });

  const [interviews, setInterviews] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [fitForm, setFitForm] = useState({
    experience: "0.8",
    communication: "0.7",
    technical: "0.6"
  });
  const [scheduleMessage, setScheduleMessage] = useState(null);

  const API_URL = `${API_BASE}/interviews`;
  const MODEL_URL = `${API_BASE}/predict-fit`;
  const EMAILJS_PUBLIC_KEY = "ZumjmtnJzIR1-ugVq";

  const EMAILJS_SERVICE_ID = "service_iccw53r";
  const EMAILJS_TEMPLATE_ID = "template_n36zluo";

  const STATUS_EMAILJS_SERVICE_ID = "service_gbuyvhq";
  const STATUS_EMAILJS_TEMPLATE_ID = "template_cwehn62";

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    if (token) {
      fetchInterviews();
    }
  }, [token]);

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviews(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFitChange = (e) => {
    setFitForm({
      ...fitForm,
      [e.target.name]: e.target.value
    });
  };

  const predictFitScore = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(MODEL_URL, fitForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrediction(res.data);
    } catch (error) {
      console.error(error);
      alert("Unable to predict candidate fit");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          candidate_name: formData.candidateName,
          name: formData.candidateName,
          to_email: formData.email,
          email: formData.email,
          candidateEmail: formData.email,
          role: formData.role,
          interview_date: formData.interviewDate,
          date: formData.interviewDate,
          status: "Scheduled",
          message: `Interview scheduled for ${formData.role}`
        },
        "ZumjmtnJzIR1-ugVq"
      );

      setScheduleMessage("Interview has been scheduled successfully!");
      setTimeout(() => {
        setScheduleMessage(null);
      }, 5000);

      setFormData({
        candidateName: "",
        email: "",
        role: "",
        interviewDate: ""
      });

      fetchInterviews();
    } catch (error) {
      console.error(error);
      alert("Error scheduling interview");
    }
  };

  const updateStatus = async (id, status, candidate) => {
    try {
      await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (["Selected", "Rejected", "Completed"].includes(status)) {
        await emailjs.send(
          STATUS_EMAILJS_SERVICE_ID,
          STATUS_EMAILJS_TEMPLATE_ID,
          {
            candidate_name: candidate.candidateName,
            name: candidate.candidateName,
            to_email: candidate.email,
            email: candidate.email,
            candidateEmail: candidate.email,
            role: candidate.role,
            status,
            interview_date: candidate.interviewDate,
            date: candidate.interviewDate,
            message: `Your interview status has been updated to ${status}`
          },
          "ZumjmtnJzIR1-ugVq"
        );
      }

      fetchInterviews();
      alert(`Candidate ${status}`);
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const deleteInterview = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInterviews();
    } catch (error) {
      console.error(error);
      alert("Error deleting interview");
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="container">
      {scheduleMessage && (
        <div className="auth-status-message success" style={{ maxWidth: "600px", margin: "0 auto 24px auto" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{scheduleMessage}</span>
        </div>
      )}

      <div className="dashboard-stack">
          
          {/* Schedule Form Card */}
          <div className="form-card">
            <h2>Schedule New Interview</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label>Candidate Name</label>
                <input
                  type="text"
                  name="candidateName"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.candidateName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Candidate Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Role</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Interview Date & Time</label>
                <input
                  type="datetime-local"
                  name="interviewDate"
                  className="form-control"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Schedule Interview
              </button>
            </form>
          </div>

          {/* Fit Score Predictor Card */}
          <div className="form-card">
            <h2>AI Candidate Fit Predictor</h2>
            <p style={{ marginTop: "-8px", marginBottom: "20px", color: "#cbd5e1", fontSize: "0.85rem", lineHeight: "1.4" }}>
              Evaluate suitability based on custom metric weights (Experience, Communication, and Technical Skill).
            </p>
            <form onSubmit={predictFitScore} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label>Experience Score (0 to 1.0)</label>
                <input
                  type="number"
                  name="experience"
                  className="form-control"
                  min="0"
                  max="1"
                  step="0.1"
                  value={fitForm.experience}
                  onChange={handleFitChange}
                  placeholder="0.0 to 1.0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Communication Score (0 to 1.0)</label>
                <input
                  type="number"
                  name="communication"
                  className="form-control"
                  min="0"
                  max="1"
                  step="0.1"
                  value={fitForm.communication}
                  onChange={handleFitChange}
                  placeholder="0.0 to 1.0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Technical Skills Score (0 to 1.0)</label>
                <input
                  type="number"
                  name="technical"
                  className="form-control"
                  min="0"
                  max="1"
                  step="0.1"
                  value={fitForm.technical}
                  onChange={handleFitChange}
                  placeholder="0.0 to 1.0"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Predict Fit</button>
            </form>

            {prediction && (
               <div className="ai-result-box">
                 <div className="ai-result-header">
                   <span className="ai-score-label">Predicted Match Score</span>
                   <span className="ai-score-badge">{prediction.score}%</span>
                 </div>
                 <div className="ai-fit-gauge">
                   <div className="ai-fit-fill" style={{ width: `${prediction.score}%` }}></div>
                 </div>
                 <div className="ai-fit-status">
                   {prediction.label}
                 </div>
               </div>
            )}
          </div>

        {/* Main Content Right: Interview List */}
        <div className="table-card" style={{ alignSelf: "stretch" }}>
          <h2>Scheduled Interviews</h2>
          
          {interviews.length === 0 ? (
            <p style={{ color: "#cbd5e1", textAlign: "center", padding: "40px 0" }}>No interviews scheduled yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "#ffffff" }}>{item.candidateName}</div>
                        <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginTop: "2px" }}>{item.email}</div>
                      </td>
                      <td>{item.role}</td>
                      <td>{formatDate(item.interviewDate)}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          {item.status !== "Completed" && item.status !== "Selected" && item.status !== "Rejected" && (
                            <button
                              className="action-btn complete"
                              onClick={() => updateStatus(item.id, "Completed", item)}
                            >
                              Complete
                            </button>
                          )}
                          {item.status !== "Selected" && (
                            <button
                              className="action-btn select"
                              onClick={() => updateStatus(item.id, "Selected", item)}
                            >
                              Select
                            </button>
                          )}
                          {item.status !== "Rejected" && (
                            <button
                              className="action-btn reject"
                              onClick={() => updateStatus(item.id, "Rejected", item)}
                            >
                              Reject
                            </button>
                          )}
                          <button
                            className="action-btn delete"
                            onClick={() => deleteInterview(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default InterviewForm;