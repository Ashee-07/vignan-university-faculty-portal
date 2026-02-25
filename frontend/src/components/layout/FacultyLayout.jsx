import React from 'react';
import Sidebar from './Sidebar';
import './FacultyLayout.css';

const FacultyLayout = ({ children }) => {
    return (
        <div className="faculty-portal-layout">
            <Sidebar />
            <main className="portal-content">
                {children}
            </main>
        </div>
    );
};

export default FacultyLayout;
