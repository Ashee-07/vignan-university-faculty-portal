import React, { useState } from "react";
import "./SystemSettings.css";

export default function SystemSettings() {
    const [activeTab, setActiveTab] = useState("general");
    const [settings, setSettings] = useState({
        academicYear: "2024-25",
        semester: "Semester 5 (Odd)",
        threshold: 75,
        maxLeave: 12,
        maintenance: false,
        portalTheme: "Modern",
        adminEmail: "admin@vignan.ac.in"
    });

    const handleSave = () => {
        // Logic to save settings to backend would go here
        alert("Configuration updated successfully!");
    };

    return (
        <div className="settings-container">
            <section className="settings-header-banner">
                <h1>System Control Center</h1>
                <p>Manage global university parameters and portal security protocols.</p>
            </section>

            <div className="settings-layout">
                <aside className="settings-sidebar">
                    <button 
                        className={`nav-pill ${activeTab === "general" ? "active" : ""}`}
                        onClick={() => setActiveTab("general")}
                    >
                        <i className="fas fa-cog"></i> General Config
                    </button>
                    <button 
                        className={`nav-pill ${activeTab === "policies" ? "active" : ""}`}
                        onClick={() => setActiveTab("policies")}
                    >
                        <i className="fas fa-balance-scale"></i> University Policies
                    </button>
                    <button 
                        className={`nav-pill ${activeTab === "security" ? "active" : ""}`}
                        onClick={() => setActiveTab("security")}
                    >
                        <i className="fas fa-shield-alt"></i> Portal Security
                    </button>
                    <button 
                        className={`nav-pill ${activeTab === "appearance" ? "active" : ""}`}
                        onClick={() => setActiveTab("appearance")}
                    >
                        <i className="fas fa-paint-brush"></i> Branding & UI
                    </button>
                </aside>

                <main className="settings-content-area">
                    {activeTab === "general" && (
                        <div className="settings-fade-in">
                            <div className="section-title">
                                <i className="fas fa-university"></i>
                                <h2>Academic Core Settings</h2>
                            </div>
                            
                            <div className="settings-group">
                                <div className="grid-2">
                                    <div className="input-block">
                                        <label>Active Academic Year</label>
                                        <input 
                                            type="text" 
                                            value={settings.academicYear} 
                                            onChange={e => setSettings({...settings, academicYear: e.target.value})}
                                        />
                                    </div>
                                    <div className="input-block">
                                        <label>Current Semester Phase</label>
                                        <select 
                                            value={settings.semester}
                                            onChange={e => setSettings({...settings, semester: e.target.value})}
                                        >
                                            <option>Semester 1 (Odd)</option>
                                            <option>Semester 2 (Even)</option>
                                            <option>Semester 3 (Odd)</option>
                                            <option>Semester 4 (Even)</option>
                                            <option>Semester 5 (Odd)</option>
                                            <option>Semester 6 (Even)</option>
                                            <option>Semester 7 (Odd)</option>
                                            <option>Semester 8 (Even)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-group">
                                <div className="input-block">
                                    <label>Administrative Support Email</label>
                                    <input 
                                        type="email" 
                                        value={settings.adminEmail}
                                        onChange={e => setSettings({...settings, adminEmail: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="status-toggle-card">
                                <div className="toggle-label-area">
                                    <h4>Maintenance Protocol</h4>
                                    <p>Lock faculty/student access for scheduled technical maintenance.</p>
                                </div>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.maintenance}
                                        onChange={e => setSettings({...settings, maintenance: e.target.checked})}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === "policies" && (
                        <div className="settings-fade-in">
                            <div className="section-title">
                                <i className="fas fa-file-contract"></i>
                                <h2>Regulation Policies</h2>
                            </div>
                            
                            <div className="grid-2">
                                <div className="input-block">
                                    <label>Attendance Warning Threshold (%)</label>
                                    <input 
                                        type="number" 
                                        value={settings.threshold}
                                        onChange={e => setSettings({...settings, threshold: e.target.value})}
                                    />
                                </div>
                                <div className="input-block">
                                    <label>Maximum Faculty Leave (Annual)</label>
                                    <input 
                                        type="number" 
                                        value={settings.maxLeave}
                                        onChange={e => setSettings({...settings, maxLeave: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="settings-fade-in">
                            <div className="section-title">
                                <i className="fas fa-user-shield"></i>
                                <h2>Security Operations</h2>
                            </div>
                            <div className="settings-group">
                                <h3>Password Policy</h3>
                                <div className="status-toggle-card" style={{marginBottom: '15px'}}>
                                    <div className="toggle-label-area">
                                        <h4>Force Password Reset</h4>
                                        <p>Require all users to change passwords on next login.</p>
                                    </div>
                                    <button className="admin-btn secondary">Execute Reset</button>
                                </div>
                                <div className="status-toggle-card">
                                    <div className="toggle-label-area">
                                        <h4>Two-Factor Authentication</h4>
                                        <p>Enable OTP verification for faculty members.</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "appearance" && (
                        <div className="settings-fade-in">
                            <div className="section-title">
                                <i className="fas fa-palette"></i>
                                <h2>Visual Customization</h2>
                            </div>
                            <div className="input-block">
                                <label>Portal Visual Engine</label>
                                <select 
                                    value={settings.portalTheme}
                                    onChange={e => setSettings({...settings, portalTheme: e.target.value})}
                                >
                                    <option>Modern Vignan (Default)</option>
                                    <option>Classic Corporate</option>
                                    <option>Dark Mode Professional</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="save-bar">
                        <button className="admin-btn secondary">Discard Changes</button>
                        <button className="admin-btn primary" onClick={handleSave}>Apply Configurations</button>
                    </div>
                </main>
            </div>
        </div>
    );
}
