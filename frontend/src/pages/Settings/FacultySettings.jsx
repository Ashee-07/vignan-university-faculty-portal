import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultySettings.css";

export default function FacultySettings() {
    const navigate = useNavigate();
    const facultyName = localStorage.getItem("facultyName") || "Faculty Member";

    const [formData, setFormData] = useState({
        email: "faculty@vignan.ac.in",
        phone: "+91 9876543210",
        notifications: true,
        theme: "light",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        alert("Settings saved successfully!");
    };

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("facultyId");
        localStorage.removeItem("facultyName");
        navigate("/faculty-login");
    };

    return (
        <div className="faculty-settings-container">
            <main className="settings-main-content">
                <div className="settings-card">
                    <div className="settings-header">
                        <h2>Faculty Settings</h2>
                        <p>Manage your account preferences and security details</p>
                    </div>

                    <div className="settings-grid">
                        {/* Profile Section */}
                        <section className="settings-section">
                            <h3><i className="fas fa-user-circle"></i> Profile Details</h3>
                            <div className="input-group">
                                <label>Official Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Preferences */}
                        <section className="settings-section">
                            <h3><i className="fas fa-sliders-h"></i> Preferences</h3>
                            <div className="toggle-group">
                                <label>Email Notifications</label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="notifications"
                                        checked={formData.notifications}
                                        onChange={handleChange}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="settings-section">
                            <h3><i className="fas fa-lock"></i> Security</h3>
                            <div className="input-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Leave empty to keep current"
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter new password"
                                />
                            </div>
                        </section>
                    </div>

                    <div className="settings-actions">
                        <button className="save-btn" onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
