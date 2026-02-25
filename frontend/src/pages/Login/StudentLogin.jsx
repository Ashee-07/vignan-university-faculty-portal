import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css";
import studentService from "../../services/studentService";

export default function StudentLogin() {
    const [regNo, setRegNo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!regNo.trim()) {
            setMessage("Please enter your Registration Number");
            return;
        }
        if (!password.trim()) {
            setMessage("Please enter your Password");
            return;
        }

        try {
            // Fetch student details from Admin's registry
            const allStudents = await studentService.getStudents();
            const me = allStudents.find(s => (s.regNo || s.rollNo) === regNo.trim());

            if (!me) {
                setMessage("Student record not found. Please check your Registration Number.");
                return;
            }

            // Verify password
            if (me.password && password !== me.password) {
                setMessage("Incorrect password. Please try again.");
                return;
            }

            // Store only essential IDs
            localStorage.setItem("userRole", "student");
            localStorage.setItem("registerId", me.regNo || me.rollNo);

            navigate("/student-dashboard");
        } catch (err) {
            setMessage("Login failed. Connection error.");
        }
    };

    return (
        <div className="student-login-page">
            <div className="login-overlay"></div>

            <div className="login-container">
                <img src="/logo.png" alt="Vignan University" className="login-logo" />
                <h1 className="portal-title">VIGNAN UNIVERSITY</h1>
                <h2 className="login-heading">Student Portal</h2>
                <p className="student-subtitle">Access your academic progress & results</p>

                <div className="input-wrapper">
                    <i className="fas fa-id-card input-icon"></i>
                    <input
                        type="text"
                        placeholder="Registration Number"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
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

                <button
                    onClick={handleLogin}
                    className="login-btn"
                >
                    <span>Login to Portal</span>
                    <i className="fas fa-arrow-right"></i>
                </button>

                {message && <div className="message"><i className="fas fa-exclamation-circle"></i> {message}</div>}
            </div>

            <footer className="login-footer">
                &copy; 2026 Vignan University | Secure Student Gateway
            </footer>
        </div>
    );
}
