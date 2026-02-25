import React from 'react';
import AdminSidebar from './AdminSidebar';
import './FacultyLayout.css'; // Reuse layout structure

const AdminLayout = ({ children }) => {
    return (
        <div className="faculty-portal-layout admin-portal-layout">
            <AdminSidebar />
            <main className="portal-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
