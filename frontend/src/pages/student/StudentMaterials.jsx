import React, { useState, useEffect } from 'react';
import './StudentMaterials.css';
import courseMaterialService from '../../services/courseMaterialService';
import studentService from '../../services/studentService';

export default function StudentMaterials() {
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [studentProfile, setStudentProfile] = useState({ year: '1st', department: 'IT' });

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            setIsLoading(true);
            const registerId = localStorage.getItem("registerId");
            if (!registerId) throw new Error("Student ID found in local storage. Please login again.");

            const profile = await studentService.getStudentByRegNo(registerId);
            setStudentProfile(profile);

            // Fetch materials matching student's year and department
            const data = await courseMaterialService.getMaterials({
                year: profile.year,
                department: profile.department
            });
            setMaterials(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getFileIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'pdf': return <i className="fas fa-file-pdf"></i>;
            case 'ppt': return <i className="fas fa-file-powerpoint"></i>;
            case 'doc': return <i className="fas fa-file-word"></i>;
            case 'video': return <i className="fas fa-file-video"></i>;
            default: return <i className="fas fa-file"></i>;
        }
    };

    const filteredMaterials = materials.filter(m =>
        m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.facultyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="materials-container">
                <main className="materials-main-content">
                    <div className="loading-state">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading course resources...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="materials-container">
            <main className="materials-main-content">
                <header className="page-header">
                    <div className="header-info">
                        <h2>Course Materials <i className="fas fa-book-reader"></i></h2>
                        <p>Study materials for {studentProfile.year} Year - {studentProfile.department}</p>
                    </div>
                </header>

                <div className="materials-action-bar">
                    <div className="materials-search">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by title, subject or faculty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredMaterials.length === 0 ? (
                    <div className="empty-state-premium">
                        <i className="fas fa-folder-open"></i>
                        <p>No materials found for your year and department.</p>
                    </div>
                ) : (
                    <div className="materials-bento-grid">
                        {filteredMaterials.map((material, idx) => (
                            <div key={material._id} className="material-premium-card" style={{ '--i': idx }}>
                                <div className="material-icon-header">
                                    <div className={`type-icon-box type-${material.type?.toLowerCase()}`}>
                                        {getFileIcon(material.type)}
                                    </div>
                                    <span className="course-tag">{material.subject}</span>
                                </div>
                                <div className="material-info">
                                    <h3>{material.title}</h3>
                                    <div className="material-stats">
                                        <span><i className="fas fa-user-tie"></i> {material.facultyName || 'Faculty'}</span>
                                        <span><i className="fas fa-eye"></i> {material.downloads || 0} views</span>
                                    </div>
                                </div>
                                <div className="material-actions">
                                    <a
                                        href={material.url.startsWith('http') ? material.url : `http://localhost:5000${material.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn-p"
                                        style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
                                    >
                                        <i className="fas fa-external-link-alt"></i> Access Resource
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
