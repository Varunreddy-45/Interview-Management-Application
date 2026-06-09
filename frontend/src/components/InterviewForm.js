import React, { useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

function InterviewForm() {
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    role: "",
    interviewDate: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save data to MySQL through backend API
      await axios.post(
        "http://localhost:5000/api/interviews",
        formData
      );

      // Send confirmation email
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

    } catch (error) {
      console.error(error);
      alert("Error scheduling interview");
    }
  };

  return (
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
  );
}

export default InterviewForm;