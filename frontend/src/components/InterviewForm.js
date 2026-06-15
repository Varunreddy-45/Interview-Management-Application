import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

function InterviewForm() {
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

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/interviews";
  const MODEL_URL =
    process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace(/\/api\/interviews$/, "") + "/api/predict-fit"
      : "http://localhost:5000/api/predict-fit";

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(API_URL);
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
      const res = await axios.post(MODEL_URL, fitForm);
      setPrediction(res.data);
    } catch (error) {
      console.error(error);
      alert("Unable to predict candidate fit");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, formData);

      await emailjs.send(
        "service_iccw53r",
        "template_n36zluo",
        {
          candidate_name: formData.candidateName,
          role: formData.role,
          interview_date: formData.interviewDate,
          status: "Scheduled",
          email: formData.email
        },
        "ZumjmtnJzIR1-ugVq"
      );

      alert("Interview Scheduled Successfully");

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
      await axios.put(`${API_URL}/${id}/status`, {
        status
      });

      if (status === "Selected" || status === "Rejected") {
        await emailjs.send(
           "service_gbuyvhq",
    "template_cwehn62",
          {
            candidate_name: candidate.candidatename,
            role: candidate.role,
            status: status,
            email: candidate.email
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
      await axios.delete(`${API_URL}/${id}`);
      fetchInterviews();
    } catch (error) {
      console.error(error);
      alert("Error deleting interview");
    }
  };

  return (
  <div className="container">
    <h1 className="title">Interview Management System</h1>

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
        <input
          type="number"
          name="experience"
          min="0"
          max="1"
          step="0.1"
          value={fitForm.experience}
          onChange={handleFitChange}
          placeholder="Experience (0 to 1)"
          required
        />
        <input
          type="number"
          name="communication"
          min="0"
          max="1"
          step="0.1"
          value={fitForm.communication}
          onChange={handleFitChange}
          placeholder="Communication (0 to 1)"
          required
        />
        <input
          type="number"
          name="technical"
          min="0"
          max="1"
          step="0.1"
          value={fitForm.technical}
          onChange={handleFitChange}
          placeholder="Technical Skills (0 to 1)"
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
              <td>{item.candidatename}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>{item.interviewdate}</td>
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