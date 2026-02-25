import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import facultyService from "../../services/facultyService";
import studentService from "../../services/studentService";
import timetableService from "../../services/timetableService";
import leaveService from "../../services/leaveService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName") || "Administrator";
  const adminDepartment = localStorage.getItem("adminDepartment") || "IT";

  const [counts, setCounts] = useState({
    faculty: 0,
    students: 0,
    courses: 0,
    leaves: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [faculty, students, timetables, leaves] = await Promise.all([
          facultyService.getFaculty(),
          studentService.getStudents(),
          timetableService.getTimetables(),
          leaveService.getAllLeaveRequests()
        ]);

        setCounts({
          faculty: faculty.length,
          students: students.length,
          courses: timetables.length,
          leaves: leaves.filter(l => l.status === 'Pending').length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    { label: "Total Faculty", value: counts.faculty.toString(), icon: "fas fa-chalkboard-teacher", color: "#4cc9f0", path: "/admin/faculty" },
    { label: "Total Students", value: counts.students.toString(), icon: "fas fa-user-graduate", color: "#4361ee", path: "/admin/students" },
    { label: "Active Courses", value: counts.courses.toString(), icon: "fas fa-book", color: "#3a0ca3", path: "/admin/timetable" },
    { label: "Pending Leaves", value: counts.leaves.toString(), icon: "fas fa-clock", color: "#7209b7", path: "/admin/leave" },
  ];

  const quickActions = [
    { label: "Issue Announcement", icon: "fas fa-bullhorn", path: "/admin/announcements" },
    { label: "Update Timetable", icon: "fas fa-calendar-alt", path: "/admin/timetable" },
    { label: "Generate Reports", icon: "fas fa-file-export", path: "/admin/reports" },
    { label: "System Settings", icon: "fas fa-cog", path: "/admin/settings" },
  ];

  return (
    <div className="admin-dashboard-overview">
      <section className="dean-banner-section">
        <div className="banner-image-container">
          <img src="/images/dean_banner.png" alt="Dean Portal" className="dean-banner-img" />
          <div className="banner-overlay">
            <div className="banner-content">
              <span className="portal-badge">Management Oversight</span>
              <h1>Executive Administrative Dashboard</h1>
              <p>Strategic control and department-wide analytics for Information Technology</p>
            </div>
          </div>
        </div>
      </section>

      <header className="overview-header">
        <div className="greeting">
          <h2>Academic Operations Control</h2>
          <p>Logged in as <strong>{adminName}</strong> (System Administrator)</p>
        </div>
        <div className="date-pill">
          <i className="fas fa-calendar-day"></i>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card glass-card clickable" onClick={() => navigate(stat.path)}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3 style={{ color: stat.color }}>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
            <div className="stat-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        ))}
      </section>

      <div className="overview-layout">
        <section className="quick-actions-section glass-card">
          <div className="section-with-vignette">
            <div className="section-text">
              <h2><i className="fas fa-bolt"></i> Quick Administrative Actions</h2>
              <p>Execute common tasks and manage department-wide operations with one click.</p>
              <div className="actions-grid">
                {quickActions.map((action, idx) => (
                  <button key={idx} className="action-tile" onClick={() => navigate(action.path)}>
                    <i className={action.icon}></i>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="section-vignette">
              <img src="/images/analytics_3d.png" alt="Analytics" className="vignette-img" />
            </div>
          </div>
        </section>

        <section className="recent-activity glass-card">
          <h2><i className="fas fa-history"></i> Recent System Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon"><i className="fas fa-plus-circle text-success"></i></div>
              <div className="activity-text">
                <strong>New Faculty Registered:</strong> Dr. Robert Downe joined IT Dept.
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><i className="fas fa-bullhorn text-warning"></i></div>
              <div className="activity-text">
                <strong>Announcement Posted:</strong> Mid-term exam schedule updated.
                <span>5 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><i className="fas fa-calendar-alt text-info"></i></div>
              <div className="activity-text">
                <strong>Timetable Changed:</strong> Room LT-101 assigned to IT201.
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
