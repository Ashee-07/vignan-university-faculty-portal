import React, { useState } from "react";
import "./AdminDashboard.css";

export default function NotificationManager() {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    audience: "all",
    priority: "normal",
    type: "popup"
  });

  const handleBroadcast = (e) => {
    e.preventDefault();
    alert(`Broadcast Sent to ${notification.audience}!\nTitle: ${notification.title}`);
  };

  return (
    <div className="admin-module-page">
      <header className="module-header">
        <div className="module-title">
          <h2>Notification Command Center</h2>
          <p>Deploy university-wide alerts, push notifications, and administrative broadcasts</p>
        </div>
      </header>

      <div className="notification-layout">
        <section className="broadcast-form-section glass-card">
          <h3><i className="fas fa-satellite-dish"></i> Compose Broadcast</h3>
          <form className="module-form" onSubmit={handleBroadcast}>
            <div className="input-group">
              <label>Message Title</label>
              <input 
                type="text" 
                placeholder="e.g. Server Maintenance or Holiday Notice" 
                value={notification.title}
                onChange={e => setNotification({...notification, title: e.target.value})}
              />
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Target Audience</label>
                <select value={notification.audience} onChange={e => setNotification({...notification, audience: e.target.value})}>
                  <option value="all">Everyone (All Portals)</option>
                  <option value="faculty">Faculty Members Only</option>
                  <option value="students">Students Only</option>
                  <option value="admins">Administrative Staff</option>
                </select>
              </div>
              <div className="input-group">
                <label>Notification Type</label>
                <select value={notification.type} onChange={e => setNotification({...notification, type: e.target.value})}>
                  <option value="popup">Modal Pop-up</option>
                  <option value="banner">Top Slider Banner</option>
                  <option value="sidebar">Sidebar Alert</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Detailed Message Content</label>
              <textarea 
                rows="4" 
                placeholder="Type your message here..."
                value={notification.message}
                onChange={e => setNotification({...notification, message: e.target.value})}
              />
            </div>

            <button type="submit" className="primary-btn broadcast-btn">
              <i className="fas fa-paper-plane"></i> Deploy Notification Now
            </button>
          </form>
        </section>

        <section className="broadcast-preview glass-card">
          <h3><i className="fas fa-eye"></i> Live Preview</h3>
          <div className={`preview-container type-${notification.type}`}>
            <div className="preview-content">
              <h4>{notification.title || "Message Title Placeholder"}</h4>
              <p>{notification.message || "Your detailed message content will appear here for the selected audience."}</p>
              <span className="preview-badge">{notification.audience.toUpperCase()}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
