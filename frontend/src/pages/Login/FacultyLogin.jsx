import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../lib/api';
import "./FacultyLogin.css";
import usePageTitle from "../../hooks/usePageTitle";

export default function FacultyLogin() {
  usePageTitle("Faculty Login");
  const [facultyId, setFacultyId] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!facultyId.trim()) {
      setMessage("Please enter your Faculty ID");
      return;
    }
    if (!department) {
      setMessage("Please select your Department");
      return;
    }
    if (!password.trim()) {
      setMessage("Please enter your Password");
      return;
    }

    try {
      setLoading(true);
      // Fetch real faculty data from backend
      const res = await API.get('/faculty');
      const allFaculty = res.data;

      const facultyMember = allFaculty.find(
        f => f.facultyId === facultyId && f.department === department
      );

      if (!facultyMember) {
        setMessage("Invalid credentials. Faculty ID not found in backend records for this department.");
        return;
      }

      // Verify password
      if (facultyMember.password && password !== facultyMember.password) {
        setMessage("Incorrect password. Please try again.");
        return;
      }

      // Store faculty details
      localStorage.setItem("userRole", "faculty");
      localStorage.setItem("facultyOid", facultyMember._id); // MongoDB Unique ID
      localStorage.setItem("facultyId", facultyId);
      localStorage.setItem("facultyName", facultyMember.name);
      localStorage.setItem("facultyDepartment", department);
      localStorage.setItem("loginTime", Date.now().toString());

      navigate("/faculty-dashboard");

    } catch (err) {
      console.error(err);
      setMessage("Connection Error: Is the backend running?");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="faculty-login-container">
      {/* Background Blobs */}
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Login Form Container */}
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo"></div>
            <h1 className="login-title">VIGNAN UNIVERSITY</h1>
            <h2 className="login-subtitle">Faculty Portal</h2>
          </div>

          <div className="login-form">
            <div className="input-group">
              <div className="input-icon-wrapper">
                <i className="fas fa-user"></i>
              </div>
              <input
                type="text"
                placeholder="Faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="login-input"
              />
            </div>



            <div className="input-group">
              <div className="input-icon-wrapper">
                <i className="fas fa-building"></i>
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="login-input"
              >
                <option value="">Select Department</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="input-group">
              <div className="input-icon-wrapper">
                <i className="fas fa-lock"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <button onClick={handleLogin} className="login-btn">
              <span>LOGIN</span>
              <i className="fas fa-arrow-right"></i>
            </button>

            {message && <p className="error-message">{message}</p>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>© 2025 Vignan University | Faculty Portal & Administration System</p>
      </footer>
    </div>
  );
}