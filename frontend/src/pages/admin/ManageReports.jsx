import React, { useState, useEffect } from "react";
import API from "../../lib/api";
import reportService from "../../services/reportService";
import studentService from "../../services/studentService";
import "./AdminDashboard.css";

export default function ManageReports() {
    const [analytics, setAnalytics] = useState(null);
    const [courses, setCourses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [selectedYear, setSelectedYear] = useState("3rd");
    const [selectedFaculty, setSelectedFaculty] = useState("all");
    const [reportFormat, setReportFormat] = useState("subjectwise");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [stats, courseList, students, facultyList] = await Promise.all([
                reportService.getDeptAnalytics(),
                reportService.getReportCourses(),
                studentService.getStudents(),
                API.get("/faculty")
            ]);

            // Sync counts with real student data
            setAnalytics({
                ...stats,
                totalStudents: students.length
            });
            setCourses(courseList);
            setFaculties(facultyList.data);
            if (courseList.length > 0) setSelectedCourse("all");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            const reportTitle = type === 'PDF' ? "Attendance Report" : "Marks Report";
            const response = await reportService.generateReport(reportTitle, "all", selectedYear, selectedFaculty, reportFormat);
            
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            const extension = type === 'PDF' ? "pdf" : "xlsx";
            a.href = url;
            a.download = `Admin-${selectedCourse}-${type}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Export failed: " + error.message);
        }
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
                        <label>Academic Year</label>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                            <option value="4th">4th Year</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Faculty Member</label>
                        <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
                            <option value="all">All Faculty</option>
                            {faculties.map(f => <option key={f._id} value={f.facultyId}>{f.name} ({f.facultyId})</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Report Type</label>
                        <select value={reportFormat} onChange={(e) => setReportFormat(e.target.value)}>
                            <option value="subjectwise">Sub-wise Report</option>
                            <option value="consolidated">Whole Subjects (Total %)</option>
                        </select>
                    </div>
                    <div className="btn-group">
                        <button className="primary-btn" onClick={() => handleExport('PDF')}>
                            <i className="fas fa-calendar-check"></i> Download Attendance Report (PDF)
                        </button>
                        <button className="secondary-btn" onClick={() => handleExport('Excel')}>
                            <i className="fas fa-file-invoice"></i> Download Student Marks Report (Excel)
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
