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

  const API_URL =
    "https://interview-management-application.onrender.com/api/interviews";

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