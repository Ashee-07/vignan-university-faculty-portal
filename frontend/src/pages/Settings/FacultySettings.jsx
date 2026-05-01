import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import facultyService from "../../services/facultyService";
import "./FacultySettings.css";

export default function FacultySettings() {
    const navigate = useNavigate();
    const facultyName = localStorage.getItem("facultyName") || "Faculty Member";

    const [formData, setFormData] = useState({
        email: localStorage.getItem("facultyEmail") || "faculty@vignan.ac.in",
        phone: localStorage.getItem("facultyPhone") || "+91 9876543210",
        notifications: true,
        theme: "light",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                setIsSaving(true);
                const facultyOid = localStorage.getItem("facultyOid");
                if (!facultyOid) throw new Error("Faculty session expired. Please login again.");

                // Use the general update route to change password
                await facultyService.updateFaculty(facultyOid, { password: formData.newPassword });
                
                alert("Password updated successfully!");
                setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
            } catch (err) {
                alert("Failed to update password: " + err.message);
            } finally {
                setIsSaving(false);
            }
        } else {
            alert("Settings saved (no password changes).");
        }
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
                            <div className="input-group password-group">
                                <label>New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Leave empty to keep current"
                                    />
                                    <i 
                                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>
                            <div className="input-group password-group">
                                <label>Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter new password"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="settings-actions">
                        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
