import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Announcements.css';
import announcementService from '../../services/announcementService';

export default function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'Medium',
    targetYear: 'All'
  });

  // Load announcements on mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      try {
        const payload = {
          ...newAnnouncement,
          facultyId: localStorage.getItem('facultyId') || 'FAC001',
          facultyName: localStorage.getItem('facultyName') || 'Faculty Member',
          date: new Date().toISOString().split('T')[0]
        };
        const created = await announcementService.postAnnouncement(payload);
        setAnnouncements([created, ...announcements]);
        setNewAnnouncement({ title: '', content: '', priority: 'Medium', targetYear: 'All' });
        setShowCreateForm(false);
        alert('Announcement posted successfully!');
      } catch (err) {
        alert('Post failed: ' + err.message);
      }
    } else {
      alert('Please fill in both title and content');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.deleteAnnouncement(id);
        setAnnouncements(announcements.filter(a => a._id !== id));
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  if (isLoading && announcements.length === 0) {
    return (
      <div className="announcements-container">
        <main className="announcements-main-content">
          <div className="loading-state" style={{ textAlign: 'center', padding: '5rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#b8235a' }}></i>
            <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Fetching latest updates...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="announcements-container">
      <main className="announcements-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Announcements <i className="fas fa-bullhorn"></i></h2>
            <p>Broadcast information, alerts, and updates to students and staff</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="premium-primary-btn"
          >
            <i className="fas fa-plus-circle"></i> Create Announcement
          </button>
        </header>

        {showCreateForm && (
          <div className="announcement-form-premium fadeUp">
            <h3>New Broadcast</h3>
            <div className="form-row-p">
              <div className="form-group">
                <label>Announcement Title</label>
                <input
                  className="form-input-p"
                  type="text"
                  placeholder="Enter a descriptive title..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Priority Level</label>
                <select
                  className="form-select-p"
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div className="form-group">
                <label>Target Year</label>
                <select
                  className="form-select-p"
                  value={newAnnouncement.targetYear}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetYear: e.target.value })}
                >
                  <option value="All">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Message Content</label>
              <textarea
                className="form-textarea-p"
                placeholder="Write your announcement details here..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              />
            </div>
            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleCreate} className="premium-primary-btn">Post to Timeline</button>
              <button onClick={() => setShowCreateForm(false)} className="cancel-btn-premium" style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="announcements-timeline">
          {announcements.map((anniversary, idx) => (
            <div key={anniversary._id} className="announcement-premium-card" style={{ '--i': idx }}>
              <div className={`priority-bar priority-${(anniversary.priority || 'Medium').toLowerCase()}`}></div>
              <div className="announcement-header">
                <h3>{anniversary.title}</h3>
                <span className={`priority-tag ${(anniversary.priority || 'Medium').toLowerCase()}`}>
                  {anniversary.priority || 'Medium'}
                </span>
              </div>
              <div className="announcement-body">
                <p>{anniversary.content}</p>
              </div>
              <div className="announcement-meta">
                <div className="meta-info">
                  <span><i className="fas fa-user-circle"></i> {anniversary.author}</span>
                  <span><i className="fas fa-calendar-alt"></i> {anniversary.date}</span>
                </div>
                <div className="announcement-actions">
                  <button className="btn-icon-p"><i className="fas fa-edit"></i></button>
                  <button className="btn-icon-p danger" onClick={() => handleDelete(anniversary._id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}