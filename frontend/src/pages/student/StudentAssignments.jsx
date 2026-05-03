import React, { useState, useEffect } from 'react';
import '../faculty/Assignments.css'; // Reusing faculty CSS for now, will refine if needed
import assignmentService from '../../services/assignmentService';
import studentService from '../../services/studentService';
import { BASE_URL } from '../../services/api';

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setIsLoading(true);

            // Fetch student profile from MongoDB via API
            const registerId = localStorage.getItem("registerId");
            if (!registerId) throw new Error("Student ID found in local storage. Please login again.");

            const profile = await studentService.getStudentByRegNo(registerId);
            const targetYear = profile.year || "3rd";

            // Fetch assignments targeted for this student's year
            const data = await assignmentService.getAssignments({ targetYear });
            setAssignments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleDownload = (assignment) => {
        if (assignment.fileUrl) {
            const fileUrl = assignment.fileUrl.startsWith('http') ? assignment.fileUrl : `${BASE_URL}${assignment.fileUrl}`;
            window.open(fileUrl, '_blank');
        } else {
            alert('No file attached to this assignment.');
        }
    };

    const filteredAssignments = assignments.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="loading-state"><p>Loading Assignments...</p></div>;
    if (error) return <div className="error-state"><p>Error: {error}</p></div>;

    return (
        <div className="assignments-container">
            <main className="assignments-main-content">
                <header className="page-header">
                    <div className="header-info">
                        <h2>My Assignments <i className="fas fa-book-open"></i></h2>
                        <p>View and download assignments for your academic year</p>
                    </div>
                </header>

                <div className="assignments-action-bar">
                    <div className="assignments-search">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="assignments-bento-grid">
                    {filteredAssignments.map((assignment, idx) => (
                        <div key={assignment._id} className="assignment-premium-card" style={{ '--i': idx }}>
                            <div className="assignment-card-header">
                                <h3>{assignment.title}</h3>
                                <span className="course-badge">{assignment.subject}</span>
                            </div>
                            <div className="assignment-card-body">
                                <div className="meta-info">
                                    <span className="meta-item"><i className="fas fa-calendar-alt"></i> Due: {assignment.deadline}</span>
                                    <span className="meta-item"><i className="fas fa-star"></i> Marks: {assignment.totalMarks || 'N/A'}</span>
                                </div>
                                <p className="description-text">{assignment.description}</p>
                            </div>
                            <div className="assignment-card-footer">
                                <button className="paper-footer-btn download" onClick={() => handleDownload(assignment)}>
                                    <i className="fas fa-download"></i> Download File
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredAssignments.length === 0 && (
                        <div className="no-data-message">No assignments found for your year.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
