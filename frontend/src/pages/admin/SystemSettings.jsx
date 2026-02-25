import React, { useState } from "react";
import "./AdminDashboard.css";

export default function SystemSettings() {
    const [settings, setSettings] = useState({
        academicYear: "2024-25",
        currentSemester: "Semester 5 (Odd)",
        attendanceThreshold: 75,
        maxLeaveDays: 12,
        maintenanceMode: false
    });

    const handleSave = () => {
        alert("System settings updated successfully!");
    };

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>System Configuration</h2>
                    <p>Global administrative settings for the Faculty Portal engine</p>
                </div>
                <button className="primary-btn" onClick={handleSave}>Save Changes</button>
            </header>

            <div className="settings-grid glass-card">
                <div className="settings-section">
                    <h3>Academic Configuration</h3>
                    <div className="input-group">
                        <label>Active Academic Year</label>
                        <input type="text" value={settings.academicYear} onChange={e => setSettings({ ...settings, academicYear: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Current Semester</label>
                        <select value={settings.currentSemester} onChange={e => setSettings({ ...settings, currentSemester: e.target.value })}>
                            <option>Semester 1</option>
                            <option>Semester 3</option>
                            <option>Semester 5 (Odd)</option>
                            <option>Semester 7</option>
                        </select>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Policy Controls</h3>
                    <div className="input-group">
                        <label>Attendance Warning Threshold (%)</label>
                        <input type="number" value={settings.attendanceThreshold} onChange={e => setSettings({ ...settings, attendanceThreshold: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Max Leave Entitlement (Annual)</label>
                        <input type="number" value={settings.maxLeaveDays} onChange={e => setSettings({ ...settings, maxLeaveDays: e.target.value })} />
                    </div>
                </div>

                <div className="settings-section full-width">
                    <h3>System Status</h3>
                    <div className="toggle-group">
                        <div className="toggle-info">
                            <strong>Maintenance Mode</strong>
                            <p>Enable to restrict faculty access during system updates</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
