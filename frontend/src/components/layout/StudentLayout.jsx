import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StudentLayout.css';

export default function StudentLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const studentName = localStorage.getItem("studentName") || "Student";
    const registerId = localStorage.getItem("registerId") || "221FA04xxx";

    const menuItems = [
        { name: 'Dashboard', path: '/student-dashboard', icon: 'fas fa-th-large' },
        { name: 'My Timetable', path: '/student/timetable', icon: 'fas fa-calendar-alt' },
        { name: 'Question Papers', path: '/student/question-papers', icon: 'fas fa-book-open' },
        { name: 'Attendance', path: '/student/attendance', icon: 'fas fa-user-check' },
        { name: 'Grades & Results', path: '/student/grades', icon: 'fas fa-graduation-cap' },
        { name: 'Assignments', path: '/student/assignments', icon: 'fas fa-tasks' },
        { name: 'Assessments', path: '/student/assessments', icon: 'fas fa-clipboard-check' },
        { name: 'Course Materials', path: '/student/course-materials', icon: 'fas fa-book-reader' },
        { name: 'Feedback', path: '/student/feedback', icon: 'fas fa-comment-dots' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/home');
    };

    return (
        <div className="student-layout">
            <aside className="student-sidebar">
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                    <h2>STUDENT PORTAL</h2>
                </div>

                <div className="student-profile-mini">
                    <div className="profile-icon">
                        <i className="fas fa-user-graduate"></i>
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">{studentName}</span>
                        <span className="profile-id">{registerId}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <i className={item.icon}></i>
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </aside>

            <main className="student-main-content">
                {children}
            </main>
        </div>
    );
}
