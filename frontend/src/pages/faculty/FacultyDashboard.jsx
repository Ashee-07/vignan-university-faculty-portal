import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacultyDashboard.css';
import API from '../../lib/api';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const facultyOid = localStorage.getItem('facultyOid');
        if (facultyOid) {
          const res = await API.get(`/faculty/${facultyOid}`);
          setFacultyProfile(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch faculty profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const facultyName = localStorage.getItem("facultyName") || "Faculty Member";
  const department = localStorage.getItem("facultyDepartment") || "IT";

  const stats = [
    { label: "Today's Classes", value: "4", icon: "fas fa-chalkboard-teacher", color: "#4cc9f0" },
    { label: "Pending Leave", value: "0", icon: "fas fa-calendar-minus", color: "#f72585" },
    { label: "Active Assignments", value: "12", icon: "fas fa-tasks", color: "#4361ee" },
    { label: "Dept. Rank", value: "#3", icon: "fas fa-trophy", color: "#7209b7" },
  ];

  if (loading) return <div className="loading">Loading Portal...</div>;

  return (
    <div className="faculty-dashboard">
      <header className="dashboard-header-section">
        <div className="welcome-msg">
          <h1>Welcome back, {facultyName}! <span>👋</span></h1>
          <p>You have 3 classes and 1 department meeting today.</p>
        </div>
        <div className="current-date">
          <i className="far fa-calendar-alt"></i>
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-layout-grid">
        {/* Profile Card */}
        <section className="dashboard-card profile-summary">
          <div className="profile-header">
            <div className="avatar-circle">
              {facultyName.charAt(0)}
            </div>
            <div className="profile-details">
              <h3>{facultyName}</h3>
              <p>{department} Department</p>
              <span className="badge-faculty">Senior Faculty</span>
            </div>
          </div>

          <div className="teaching-assignments-section">
            <h4><i className="fas fa-book"></i> Teaching Assignments</h4>
            <div className="subject-list">
              {facultyProfile?.assignedSubjects && facultyProfile.assignedSubjects.length > 0 ? (
                facultyProfile.assignedSubjects.map((sub, idx) => (
                  <div key={idx} className="subject-item">
                    <div className="subject-icon">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                    <div className="subject-info">
                      <span className="subject-name">{sub.subject}</span>
                      <span className="subject-year">{sub.year} Year</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-assignments">No subjects assigned yet.</p>
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-card quick-actions-section">
          <h3>Quick Access</h3>
          <div className="actions-grid-premium">
            <button className="q-action-card" onClick={() => navigate('/faculty/attendance')}>
              <i className="fas fa-user-check"></i>
              <span>Post Attendance</span>
            </button>
            <button className="q-action-card" onClick={() => navigate('/faculty/grades')}>
              <i className="fas fa-file-invoice"></i>
              <span>Grade Entry</span>
            </button>
            <button className="q-action-card" onClick={() => navigate('/faculty/assignments')}>
              <i className="fas fa-edit"></i>
              <span>Assignments</span>
            </button>
            <button className="q-action-card" onClick={() => navigate('/faculty/leave')}>
              <i className="fas fa-calendar-plus"></i>
              <span>Leave Request</span>
            </button>
          </div>
        </section>

        {/* Today's Schedule Preview */}
        <section className="dashboard-card schedule-preview">
          <div className="card-header">
            <h3>Today's Schedule</h3>
            <button className="link-btn" onClick={() => navigate('/faculty/timetable')}>View Full</button>
          </div>
          <div className="schedule-timeline">
            <div className="timeline-item active">
              <span className="time">09:00 AM</span>
              <div className="event-info">
                <h4>Java Programming</h4>
                <p>3rd Year • LH-302</p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="time">11:00 AM</span>
              <div className="event-info">
                <h4>Data Structures</h4>
                <p>2nd Year • LH-201</p>
              </div>
            </div>
            <div className="timeline-item">
              <span className="time">02:00 PM</span>
              <div className="event-info">
                <h4>Lab: Web Design</h4>
                <p>3rd Year • IT Lab 5</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
