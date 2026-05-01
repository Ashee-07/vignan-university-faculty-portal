import React, { useState, useEffect } from 'react';
import '../faculty/InternalAssessment.css'; 
import assessmentService from '../../services/assessmentService';
import studentService from '../../services/studentService';

export default function StudentAssessments() {
    const [assessments, setAssessments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            setIsLoading(true);
            const registerId = localStorage.getItem("registerId");
            if (!registerId) throw new Error("Student ID missing. Please login again.");

            const profile = await studentService.getStudentByRegNo(registerId);
            const targetYear = profile.year || "3rd";

            // We filter assessments for this student's year
            const allAssessments = await assessmentService.getAssessments();
            const filtered = allAssessments.filter(a => a.year === targetYear);
            setAssessments(filtered);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAssessments = assessments.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="loading-state"><p>Loading Assessments...</p></div>;
    if (error) return <div className="error-state"><p>Error: {error}</p></div>;

    return (
        <div className="assessment-container" style={{ padding: '2rem' }}>
            <header className="page-header">
                <div className="header-info">
                    <h2>Internal Assessments <i className="fas fa-clipboard-check"></i></h2>
                    <p>View your scheduled exams, quizzes and evaluations</p>
                </div>
            </header>

            <div className="assessment-action-bar" style={{ marginBottom: '2rem' }}>
                <div className="assessment-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search assessments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="assessment-bento-grid">
                {filteredAssessments.map((assessment, idx) => (
                    <div key={assessment._id} className="assessment-premium-card" style={{ '--i': idx }}>
                        <span className={`card-type-tag type-${assessment.type.toLowerCase()}`}>
                            {assessment.type}
                        </span>
                        <div className="assessment-info">
                            <h3>{assessment.title}</h3>
                            <div className="assessment-meta">
                                <span><i className="fas fa-book"></i> {assessment.course}</span>
                                <span><i className="fas fa-calendar-alt"></i> {assessment.date}</span>
                            </div>
                            <div className="assessment-meta">
                                <span style={{ color: '#b8235a', fontWeight: 800 }}>
                                    <i className="fas fa-star"></i> Max Marks: {assessment.totalMarks}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredAssessments.length === 0 && (
                    <div className="no-data-message">No assessments found for your year.</div>
                )}
            </div>
        </div>
    );
}
