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
  "service_iccw53r",
  "template_n36zluo",
  
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

      setScheduleMessage("Interview is scheduled");
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
           "service_gbuyvhq",
         "template_cwehn62",
  
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

  return (
  <div className="container">
    <h1 className="title">Interview Management System</h1>

    {scheduleMessage && (
      <div className="auth-message success" style={{ textAlign: "center", marginBottom: "20px" }}>
        {scheduleMessage}
      </div>
    )}

    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="candidateName"
          placeholder="Candidate Name"
          value={formData.candidateName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Candidate Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="role"
          placeholder="Job Role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          name="interviewDate"
          value={formData.interviewDate}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Schedule Interview
        </button>
      </form>
    </div>

    <div className="form-card">
      <h2>AI Candidate Fit Predictor</h2>
      <p style={{ marginTop: "-8px", color: "#4b5563" }}>
        Use the model to estimate how suitable a candidate might be for the role.
      </p>
      <form onSubmit={predictFitScore}>
        <label style={{ display: "block", fontSize: "0.95rem", marginBottom: "4px", color: "#374151" }}>
          Experience score (0 to 1): how much prior relevant experience the candidate has.
        </label>
        <input
          type="number"
          name="experience"
          min="0"
          max="1"
          step="0.1"
          value={fitForm.experience}
          onChange={handleFitChange}
          placeholder="0.0 to 1.0"
          required
        />

        <label style={{ display: "block", fontSize: "0.95rem", marginTop: "10px", marginBottom: "4px", color: "#374151" }}>
          Communication score (0 to 1): how clearly the candidate communicates.
        </label>
        <input
          type="number"
          name="communication"
          min="0"
          max="1"
          step="0.1"
          value={fitForm.communication}
          onChange={handleFitChange}
          placeholder="0.0 to 1.0"
          required
        />

        <label style={{ display: "block", fontSize: "0.95rem", marginTop: "10px", marginBottom: "4px", color: "#374151" }}>
          Technical skills score (0 to 1): how strong the candidate is in technical ability.
        </label>
        <input
          type="number"
          name="technical"
          min="0"
          max="1"
          step="0.1"
          value={fitForm.technical}
          onChange={handleFitChange}
          placeholder="0.0 to 1.0"
          required
        />
        <button type="submit" className="submit-btn">Predict Fit</button>
      </form>

      {prediction && (
        <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "#eff6ff" }}>
          <strong>Predicted Fit Score:</strong> {prediction.score}%<br />
          <strong>Label:</strong> {prediction.label}
        </div>
      )}
    </div>

    <div className="table-card">
      <h2>Interview List</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {interviews.map((item) => (
            <tr key={item.id}>
              <td>{item.candidateName}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>{item.interviewDate}</td>
              <td>{item.status}</td>

              <td>
                <button
                  className="action-btn complete"
                  onClick={() =>
                    updateStatus(item.id, "Completed", item)
                  }
                >
                  Complete
                </button>

                <button
                  className="action-btn select"
                  onClick={() =>
                    updateStatus(item.id, "Selected", item)
                  }
                >
                  Select
                </button>

                <button
                  className="action-btn reject"
                  onClick={() =>
                    updateStatus(item.id, "Rejected", item)
                  }
                >
                  Reject
                </button>

                <button
                  className="action-btn delete"
                  onClick={() => deleteInterview(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
export default InterviewForm;