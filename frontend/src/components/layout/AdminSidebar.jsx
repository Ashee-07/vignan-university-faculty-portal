import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        return saved === 'true';
    });

    const adminName = localStorage.getItem("adminName") || "Administrator";

    useEffect(() => {
        localStorage.setItem('admin-sidebar-collapsed', isCollapsed);
    }, [isCollapsed]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const menuItems = [
        { id: 'dashboard', path: '/admin-dashboard', icon: 'fas fa-shield-alt', label: 'Admin Panel' },
        { id: 'faculty', path: '/admin/faculty', icon: 'fas fa-user-tie', label: 'Manage Faculty' },
        { id: 'students', path: '/admin/students', icon: 'fas fa-user-graduate', label: 'Manage Students' },
        { id: 'timetable', path: '/admin/timetable', icon: 'fas fa-calendar-alt', label: 'University Timetable' },
        { id: 'announcements', path: '/admin/announcements', icon: 'fas fa-bullhorn', label: 'Broadcasts' },
        { id: 'leave', path: '/admin/leave', icon: 'fas fa-calendar-check', label: 'Leave Approvals' },
        { id: 'reports', path: '/admin/reports', icon: 'fas fa-file-invoice', label: 'Admin Reports' },
        { id: 'settings', path: '/admin/settings', icon: 'fas fa-user-cog', label: 'System Settings' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/home", { replace: true });
    };

    return (
        <aside className={`flexible-sidebar admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            </div>

            <div className="sidebar-header">
                <img src="/logo.png" alt="Vignan Logo" className="sidebar-logo" />
                {!isCollapsed && (
                    <div className="sidebar-title">
                        Vignan University<br />
                        <span className="admin-badge">Admin Portal</span>
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
                        <span className="welcome-text">System ID,</span>
                        <span className="user-name">{adminName}</span>
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

export default AdminSidebar;
