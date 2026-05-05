import React from 'react';
import Sidebar from './Sidebar';
import SessionTimer from './SessionTimer';
import './FacultyLayout.css';

const FacultyLayout = ({ children }) => {
    return (
        <div className="faculty-portal-layout">
            <Sidebar />
            <SessionTimer />
            <main className="portal-content">
                {children}
            </main>
        </div>
    );
};

export default FacultyLayout;
