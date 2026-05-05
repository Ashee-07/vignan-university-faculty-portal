import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { API } from "../../lib";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!adminId.trim()) {
      setMessage("Please enter your Admin ID");
      return;
    }
    if (!password.trim()) {
      setMessage("Please enter your Password");
      return;
    }
    if (!department) {
      setMessage("Please select your Department");
      return;
    }

    try {
      const response = await fetch(API("/api/admins"));
      const allAdmins = await response.json();

      const admin = allAdmins.find(a =>
        a.adminId === adminId.trim() &&
        a.department === department &&
        a.password === password
      );

      if (!admin) {
        setMessage("Invalid Admin credentials or department selection.");
        return;
      }

      // Store admin credentials in localStorage
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("loginTime", Date.now().toString());
      localStorage.setItem("adminName", admin.name || adminId);
      localStorage.setItem("adminDepartment", department);
      navigate("/admin-dashboard");
    } catch (err) {
      setMessage("Connection error. Is the backend running?");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-overlay"></div>

      <div className="login-container">
        <img src="/logo.png" alt="Vignan University" className="login-logo" />
        <h1 className="portal-title">VIGNAN UNIVERSITY</h1>
        <h2 className="login-heading">Admin Portal</h2>
        <p className="admin-subtitle">Secure access to administrative controls</p>

        <div className="input-wrapper">
          <i className="fas fa-user-shield input-icon"></i>
          <input
            type="text"
            placeholder="Admin Identifier"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="input-wrapper">
          <i className="fas fa-lock input-icon"></i>
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

        <div className="input-wrapper">
          <i className="fas fa-building input-icon"></i>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="login-input"
          >
            <option value="">Select Department</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="EEE">Electrical & Electronics</option>
            <option value="MECH">Mechanical Engineering</option>
            <option value="CIVIL">Civil Engineering</option>
            <option value="MBA">Business Administration</option>
          </select>
        </div>

        <button
          onClick={handleLogin}
          className="login-btn"
        >
          <span>Login to Panel</span>
          <i className="fas fa-arrow-right"></i>
        </button>

        {message && <div className="message"><i className="fas fa-exclamation-circle"></i> {message}</div>}
      </div>

      <footer className="login-footer">
        &copy; 2026 Vignan University | Secure Administrative Gateway
      </footer>
    </div>
  );
}
