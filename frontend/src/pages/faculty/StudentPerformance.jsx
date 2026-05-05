import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../services/api";
import "../ModulePage.css";
import "./StudentProgress.css"; // Reuse the premium CSS from Student Progress

export default function StudentPerformance() {
    const location = useLocation();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(location.state?.search || "");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const facultyId = localStorage.getItem("facultyId");
            const response = await apiClient.get(`/analytics/faculty/${facultyId}/students`);
            setStudents(response.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s => {
        return s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getAttendanceColor = (percentage) => {
        if (percentage >= 75) return "#4cc9f0";
        if (percentage >= 60) return "#f77f00";
        return "#ef233c";
    };

    const getCGPAColor = (cgpa) => {
        if (cgpa >= 8.5) return "#4cc9f0";
        if (cgpa >= 7.0) return "#f77f00";
        return "#ef233c";
    };

    const getStatusClass = (percentage) => {
        if (percentage >= 75) return "high";
        if (percentage >= 60) return "mid";
        return "critical";
    };

    const stats = {
        total: filteredStudents.length,
        avgAttendance: filteredStudents.length > 0 
            ? (filteredStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / filteredStudents.length).toFixed(1)
            : 0,
        avgCGPA: filteredStudents.filter(s => s.cgpa > 0).length > 0
            ? (filteredStudents.filter(s => s.cgpa > 0).reduce((sum, s) => sum + s.cgpa, 0) / filteredStudents.filter(s => s.cgpa > 0).length).toFixed(2)
            : "N/A",
        lowAttendance: filteredStudents.filter(s => s.attendancePercentage < 75).length
    };

    if (loading && students.length === 0) {
        return (
            <div className="progress-container">
                <main className="progress-main-content">
                    <div className="loading-state" style={{ textAlign: 'center', padding: '5rem' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#b8235a' }}></i>
                        <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Analyzing performance data...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="progress-container">
            <main className="progress-main-content">
                <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="header-info">
                        <h2>Student Performance Analytics <i className="fas fa-chart-pie"></i></h2>
                        <p>View attendance and academic performance of students you teach</p>
                    </div>
                    <button 
                        className="view-btn-premium"
                        onClick={() => navigate('/student-progress')} 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Progress
                    </button>
                </header>

                {/* Stats Bento Grid */}
                <div className="progress-stats-grid">
                    <div className="stat-card-premium">
                        <span className="stat-label">Total Students</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-card-premium">
                        <span className="stat-label">Avg. Attendance</span>
                        <span className="stat-value">{stats.avgAttendance}%</span>
                    </div>
                    <div className="stat-card-premium">
                        <span className="stat-label">Avg. CGPA</span>
                        <span className="stat-value">{stats.avgCGPA}</span>
                    </div>
                    <div className="stat-card-premium">
                        <span className="stat-label" style={{ color: '#ef233c' }}>Low Attendance</span>
                        <span className="stat-value" style={{ color: '#ef233c' }}>{stats.lowAttendance}</span>
                    </div>
                </div>

                <div className="progress-action-bar">
                    <div className="progress-search">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search by name or reg no..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container-premium">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Reg No</th>
                                <th>Name</th>
                                <th>Year</th>
                                <th>Section</th>
                                <th>Classes</th>
                                <th>Attendance %</th>
                                <th>CGPA</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, idx) => (
                                    <tr key={student.regNo} style={{ '--i': idx }}>
                                        <td className="student-id">{student.regNo}</td>
                                        <td className="student-name">{student.name}</td>
                                        <td>{student.year}</td>
                                        <td>{student.section}</td>
                                        <td>
                                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                                {student.presentClasses} / {student.totalClasses}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`percentage-chip ${getStatusClass(student.attendancePercentage)}`}>
                                                {student.attendancePercentage.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                color: getCGPAColor(student.cgpa),
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem'
                                            }}>
                                                {student.cgpa > 0 ? student.cgpa.toFixed(2) : 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            {student.attendancePercentage >= 75 ? (
                                                <span className="overall-score a" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Good</span>
                                            ) : student.attendancePercentage >= 60 ? (
                                                <span className="overall-score c" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Warning</span>
                                            ) : (
                                                <span className="overall-score f" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Critical</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                        <i className="fas fa-inbox" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
