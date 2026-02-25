import React, { useState, useEffect } from "react";
import reportService from "../../services/reportService";
import studentService from "../../services/studentService";
import "./AdminDashboard.css";

export default function ManageReports() {
    const [analytics, setAnalytics] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [stats, courseList, students] = await Promise.all([
                reportService.getDeptAnalytics(),
                reportService.getReportCourses(),
                studentService.getStudents()
            ]);

            // Sync counts with real student data
            setAnalytics({
                ...stats,
                totalStudents: students.length
            });
            setCourses(courseList);
            if (courseList.length > 0) setSelectedCourse(courseList[0].id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type) => {
        alert(`Generating Department-wide ${type} Report for ${selectedCourse}...`);
    };

    if (loading) return <div className="admin-module-page">Loading Analytics...</div>;

    return (
        <div className="admin-module-page">
            <section className="dean-banner-section">
                <div className="banner-content">
                    <img src="/images/analytics_3d.png" alt="Analytics" className="dean-banner-img" />
                    <div className="banner-overlay">
                        <div className="banner-text">
                            <h1>Department Reports & Analytics</h1>
                            <p>Strategic data overview and export tools for administrative decision making</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-info">
                        <p>Avg Attendance</p>
                        <h3 style={{ color: '#4cc9f0' }}>{analytics.avgAttendance}%</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <p>Course Completion</p>
                        <h3 style={{ color: '#4361ee' }}>{analytics.completionRate}%</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <p>Total Students</p>
                        <h3 style={{ color: '#7209b7' }}>{analytics.totalStudents}</h3>
                    </div>
                </div>
            </section>

            <section className="report-config glass-card">
                <h3><i className="fas fa-file-download"></i> Custom Report Generation</h3>
                <div className="config-row">
                    <div className="input-group">
                        <label>Select Course Scope</label>
                        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                            <option value="all">All IT Courses</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
                        </select>
                    </div>
                    <div className="btn-group">
                        <button className="primary-btn" onClick={() => handleExport('PDF')}>Download PDF Summary</button>
                        <button className="secondary-btn" onClick={() => handleExport('Excel')}>Export Full Excel</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
