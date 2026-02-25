import React, { useState, useEffect } from 'react';
import './StudentQuestionPapers.css';
import apiClient from '../../services/api';
import studentService from '../../services/studentService';

export default function StudentQuestionPapers() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSubject, setFilterSubject] = useState('');
    const [studentYear, setStudentYear] = useState('');

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            setLoading(true);

            // Get registration ID for fetching profile
            const registerId = localStorage.getItem('registerId');
            if (!registerId) throw new Error("Student ID missing. Please login again.");

            // Fetch Latest Student Profile from MongoDB
            const profile = await studentService.getStudentByRegNo(registerId);
            const currentYear = profile.year || "3rd";
            setStudentYear(currentYear);

            // Fetch papers filtered by student's year (targetYear)
            const response = await apiClient.get(`/questionPapers?targetYear=${currentYear}`);
            setPapers(response.data);
        } catch (err) {
            console.error("Failed to fetch papers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (paper) => {
        const fileUrl = paper.url.startsWith('http') ? paper.url : `http://localhost:5000${paper.url}`;
        window.open(fileUrl, '_blank');
    };

    const filteredPapers = filterSubject
        ? papers.filter(p => p.subject.toLowerCase().includes(filterSubject.toLowerCase()))
        : papers;

    return (
        <div className="std-qp-container">
            <header className="page-header">
                <div className="header-info">
                    <h2>Question Papers & Resources</h2>
                    <p>Access study materials for your academic year ({studentYear})</p>
                </div>
            </header>

            <div className="qp-controls">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Filter by subject..."
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading resources...</p>
                </div>
            ) : (
                <div className="qp-grid">
                    {filteredPapers.length > 0 ? (
                        filteredPapers.map((paper) => (
                            <div key={paper._id} className="qp-card">
                                <div className="qp-card-header">
                                    <span className={`type-badge ${paper.type === 'End-Term' ? 'end' : 'mid'}`}>
                                        {paper.type}
                                    </span>
                                    <span className="date-badge">{new Date(paper.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="qp-card-body">
                                    <h3>{paper.subject}</h3>
                                    <p className="qp-title">{paper.title}</p>

                                    {(paper.module || paper.topic) && (
                                        <div className="qp-tags">
                                            {paper.module && <span className="module-tag"><i className="fas fa-bookmark"></i> {paper.module}</span>}
                                            {paper.topic && <span className="tag topic"><i className="fas fa-tag"></i> {paper.topic}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="qp-card-footer">
                                    <div className="file-info">
                                        <i className={`fas fa-file-${paper.fileType?.toLowerCase() === 'pdf' ? 'pdf' : 'alt'}`}></i>
                                        <span>{paper.fileType || 'PDF'}</span>
                                    </div>
                                    <button className="download-btn" onClick={() => handleDownload(paper)}>
                                        <i className="fas fa-download"></i> Download
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">
                            <i className="fas fa-folder-open"></i>
                            <p>No question papers found for your year.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
