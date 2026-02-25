import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved === 'true';
    });

    const facultyName = localStorage.getItem("facultyName") || "Faculty Member";

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', isCollapsed);
    }, [isCollapsed]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const menuItems = [
        { id: 'dashboard', path: '/faculty-dashboard', icon: 'fas fa-th-large', label: 'Dashboard' },
        { id: 'timetable', path: '/timetable', icon: 'fas fa-calendar-alt', label: 'Timetable' },
        { id: 'attendance', path: '/attendance', icon: 'fas fa-clipboard-check', label: 'Attendance' },
        { id: 'grades', path: '/grades', icon: 'fas fa-chart-line', label: 'Grades & Marks' },
        { id: 'papers', path: '/question-papers', icon: 'fas fa-book-open', label: 'Question Papers' },
        { id: 'assignments', path: '/assignments', icon: 'fas fa-file-alt', label: 'Assignments' },
        { id: 'materials', path: '/course-materials', icon: 'fas fa-layer-group', label: 'Course Materials' },
        { id: 'progress', path: '/student-progress', icon: 'fas fa-user-graduate', label: 'Student Progress' },
        { id: 'leave', path: '/leave-management', icon: 'fas fa-calendar-check', label: 'Leave Manager' },
        { id: 'internal', path: '/internal-marks', icon: 'fas fa-marker', label: 'Internal Assessment' },
        { id: 'feedback', path: '/feedback', icon: 'fas fa-comments', label: 'Student Feedback' },
        { id: 'announcements', path: '/announcements', icon: 'fas fa-bell', label: 'Announcements' },
        { id: 'reports', path: '/reports', icon: 'fas fa-file-invoice', label: 'Reports' },
        { id: 'settings', path: '/faculty-settings', icon: 'fas fa-cog', label: 'Settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("facultyId");
        localStorage.removeItem("facultyName");
        localStorage.removeItem("facultyDepartment");
        navigate("/home", { replace: true });
    };

    return (
        <aside className={`flexible-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            </div>

            <div className="sidebar-header">
                <img src="/logo.png" alt="Vignan Logo" className="sidebar-logo" />
                {!isCollapsed && (
                    <div className="sidebar-title">
                        Vignan University<br />
                        <span>Faculty Portal</span>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                        title={isCollapsed ? item.label : ''}
                    >
                        <i className={item.icon}></i>
                        {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="user-info">
                        <span className="welcome-text">Welcome,</span>
                        <span className="user-name">{facultyName}</span>
                    </div>
                )}
                <button className="logout-button" onClick={handleLogout} title={isCollapsed ? 'Logout' : ''}>
                    <i className="fas fa-sign-out-alt"></i>
                    {!isCollapsed && <span className="nav-label">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
