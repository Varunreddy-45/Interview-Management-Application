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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, {
        status
      });

      fetchInterviews();
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
    <div>
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
          placeholder="Email"
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

        <button type="submit">
          Schedule Interview
        </button>
      </form>

      <br />

      <h2>Interview List</h2>

      <table border="1" cellPadding="10">
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
                  onClick={() =>
                    updateStatus(item.id, "Completed")
                  }
                >
                  Complete
                </button>

                <button
                  onClick={() =>
                    updateStatus(item.id, "Selected")
                  }
                >
                  Select
                </button>

                <button
                  onClick={() =>
                    updateStatus(item.id, "Rejected")
                  }
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    deleteInterview(item.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterviewForm;