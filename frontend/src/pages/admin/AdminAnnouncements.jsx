import React, { useState, useEffect } from "react";
import announcementService from "../../services/announcementService";
import "./AdminDashboard.css";

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        priority: "Medium",
        targetYear: "All"
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await announcementService.getAnnouncements();
            setAnnouncements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const payload = {
                ...newAnnouncement,
                facultyId: "ADMIN",
                facultyName: "System Administrator",
                date: new Date().toISOString().split('T')[0]
            };
            await announcementService.postAnnouncement(payload);
            alert("Announcement broadcasted!");
            setShowForm(false);
            setNewAnnouncement({ title: "", content: "", priority: "Medium", targetYear: "All" });
            fetchAnnouncements();
        } catch (err) {
            alert("Failed to post: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this announcement?")) {
            try {
                await announcementService.deleteAnnouncement(id);
                fetchAnnouncements();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>Department Broadcasts</h2>
                    <p>Post university-wide announcements and faculty notices</p>
                </div>
                <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
                    <i className="fas fa-plus"></i> {showForm ? "Cancel" : "New Announcement"}
                </button>
            </header>

            {showForm && (
                <div className="admin-form-card glass-card fadeUp" style={{ marginBottom: '20px', padding: '20px' }}>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={newAnnouncement.title}
                                onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                                placeholder="Announcement Title"
                            />
                        </div>
                        <div className="form-group">
                            <label>Target Year</label>
                            <select 
                                value={newAnnouncement.targetYear}
                                onChange={e => setNewAnnouncement({...newAnnouncement, targetYear: e.target.value})}
                            >
                                <option value="All">All Years</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Content</label>
                            <textarea 
                                value={newAnnouncement.content}
                                onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                                placeholder="Announcement message..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <button className="primary-btn" style={{ marginTop: '15px' }} onClick={handleCreate}>
                        Broadcast Announcement
                    </button>
                </div>
            )}

            <div className="announcements-list">
                {loading ? (
                    <p>Loading...</p>
                ) : announcements.length === 0 ? (
                    <p>No announcements found.</p>
                ) : (
                    announcements.map(a => (
                        <div key={a._id} className="announcement-card glass-card">
                            <div className="card-header">
                                <h3>{a.title}</h3>
                                <span className="date">{a.date}</span>
                            </div>
                            <p>{a.content}</p>
                            <div className="card-meta" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
                                <span><i className="fas fa-user"></i> {a.facultyName}</span>
                                <span style={{ marginLeft: '15px' }}><i className="fas fa-users"></i> Target: {a.targetYear} Year</span>
                            </div>
                            <div className="card-footer">
                                <button className="text-btn delete" onClick={() => handleDelete(a._id)}>
                                    <i className="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
