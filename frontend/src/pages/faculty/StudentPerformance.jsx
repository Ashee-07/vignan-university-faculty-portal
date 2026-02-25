import React, { useState, useEffect } from "react";
import apiClient from "../../services/api";
import "../ModulePage.css";

export default function StudentPerformance() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterYear, setFilterYear] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

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
            alert("Error fetching student performance data");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesYear = filterYear === "all" || s.year === filterYear;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.regNo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesYear && matchesSearch;
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

    return (
        <div className="module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>Student Performance Analytics</h2>
                    <p>View attendance and academic performance of students you teach</p>
                </div>
            </header>

            <section className="controls-section glass-card">
                <div className="controls-grid">
                    <div className="input-group">
                        <label>Filter by Year</label>
                        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                            <option value="all">All Years</option>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                            <option value="4th">4th Year</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Search Student</label>
                        <input
                            type="text"
                            placeholder="Search by name or reg no..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="loading-state">
                    <i className="fas fa-spinner fa-spin"></i> Loading student data...
                </div>
            ) : (
                <section className="table-container glass-card">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Reg No</th>
                                <th>Name</th>
                                <th>Year</th>
                                <th>Section</th>
                                <th>Attendance %</th>
                                <th>Classes</th>
                                <th>CGPA</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.regNo}>
                                    <td className="bold-text">{student.regNo}</td>
                                    <td>{student.name}</td>
                                    <td>{student.year}</td>
                                    <td>{student.section}</td>
                                    <td>
                                        <span style={{
                                            color: getAttendanceColor(student.attendancePercentage),
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem'
                                        }}>
                                            {student.attendancePercentage.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                            {student.presentClasses}/{student.totalClasses}
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
                                            <span className="status-badge active">Good</span>
                                        ) : student.attendancePercentage >= 60 ? (
                                            <span className="status-badge warning">Warning</span>
                                        ) : (
                                            <span className="status-badge inactive">Critical</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
                            <p>No students found matching your criteria</p>
                        </div>
                    )}
                </section>
            )}

            <section className="stats-summary glass-card" style={{ marginTop: '20px', padding: '20px' }}>
                <h3 style={{ marginBottom: '15px', color: '#4cc9f0' }}>
                    <i className="fas fa-chart-bar"></i> Summary Statistics
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div className="stat-card">
                        <p>Total Students</p>
                        <h3 style={{ color: '#4cc9f0' }}>{filteredStudents.length}</h3>
                    </div>
                    <div className="stat-card">
                        <p>Avg Attendance</p>
                        <h3 style={{ color: '#4361ee' }}>
                            {filteredStudents.length > 0
                                ? (filteredStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / filteredStudents.length).toFixed(1)
                                : 0}%
                        </h3>
                    </div>
                    <div className="stat-card">
                        <p>Avg CGPA</p>
                        <h3 style={{ color: '#7209b7' }}>
                            {filteredStudents.filter(s => s.cgpa > 0).length > 0
                                ? (filteredStudents.filter(s => s.cgpa > 0).reduce((sum, s) => sum + s.cgpa, 0) / filteredStudents.filter(s => s.cgpa > 0).length).toFixed(2)
                                : 'N/A'}
                        </h3>
                    </div>
                    <div className="stat-card">
                        <p>Low Attendance</p>
                        <h3 style={{ color: '#ef233c' }}>
                            {filteredStudents.filter(s => s.attendancePercentage < 75).length}
                        </h3>
                    </div>
                </div>
            </section>
        </div>
    );
}
