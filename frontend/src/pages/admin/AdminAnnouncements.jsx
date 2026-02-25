import React, { useState, useEffect } from "react";
import announcementService from "../../services/announcementService";
import "./AdminDashboard.css";

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await announcementService.getAnnouncements();
                // Map fields if necessary (service uses 'title', 'content', 'date')
                const formatted = data.map(a => ({
                    _id: a.id,
                    title: a.title,
                    message: a.content || a.message,
                    date: a.date
                }));
                setAnnouncements(formatted);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>Department Broadcasts</h2>
                    <p>Post university-wide announcements and faculty notices</p>
                </div>
                <button className="primary-btn"><i className="fas fa-plus"></i> New Announcement</button>
            </header>

            <div className="announcements-list">
                {announcements.map(a => (
                    <div key={a._id} className="announcement-card glass-card">
                        <div className="card-header">
                            <h3>{a.title}</h3>
                            <span className="date">{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        <p>{a.message}</p>
                        <div className="card-footer">
                            <button className="text-btn"><i className="fas fa-edit"></i> Edit</button>
                            <button className="text-btn delete"><i className="fas fa-trash"></i> Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
