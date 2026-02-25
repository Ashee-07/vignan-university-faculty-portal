import React, { useState } from "react";
import "./AdminDashboard.css";

export default function SystemMessages() {
    const [messages, setMessages] = useState([
        { id: 1, type: 'Alert', text: 'Server maintenance scheduled for next Sunday.', date: '2025-11-05', priority: 'High' },
        { id: 2, type: 'Info', text: 'New grading policy uploaded to the handbook.', date: '2025-11-04', priority: 'Medium' },
    ]);

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>System Messages & Alerts</h2>
                    <p>Manage direct communications and system-wide notifications</p>
                </div>
                <button className="primary-btn"><i className="fas fa-comment-medical"></i> Compose New</button>
            </header>

            <div className="messages-container glass-card">
                <div className="message-list">
                    {messages.map(m => (
                        <div key={m.id} className={`message-pill priority-${m.priority.toLowerCase()}`}>
                            <div className="pill-type">{m.type}</div>
                            <div className="pill-content">
                                <p>{m.text}</p>
                                <span>{m.date}</span>
                            </div>
                            <div className="pill-priority">{m.priority} Priority</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
