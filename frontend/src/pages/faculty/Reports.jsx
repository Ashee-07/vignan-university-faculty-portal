import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Reports.css';
import reportService from '../../services/reportService';

export default function Reports() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("3rd");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await reportService.getReportCourses();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0].name);
          setSelectedYear(data[0].year);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const reportTypes = [
    { id: 'attendance', icon: "fas fa-user-check", title: "Attendance Report", desc: "Detailed breakdown of student attendance percentages and thresholds." },
    { id: 'performance', icon: "fas fa-chart-line", title: "Performance Analysis", desc: "Comparative analytical report on student academic performance trends." },
    { id: 'assignments', icon: "fas fa-tasks", title: "Assignment Completion", desc: "Summary of submission rates across all active and past assignments." },
    { id: 'grades', icon: "fas fa-graduation-cap", title: "Grade Distribution", desc: "Visual distribution of grades across the entire class cohort." },
    { id: 'at-risk', icon: "fas fa-exclamation-triangle", title: "At-Risk Students", desc: "Identification of students performing below the minimum threshold." },
    { id: 'course-summary', icon: "fas fa-file-invoice", title: "Course Summary", desc: "Aggregated overview of course metrics and student engagement." }
  ];

  const handleGenerate = async (reportTitle) => {
    try {
      setIsGenerating(true);
      const response = await reportService.generateReport(reportTitle, selectedCourse, selectedYear);

      // In mock mode, we just show an alert
      if (response.mockUrl) {
        alert(`${reportTitle} generated for course ${selectedCourse}! (Mock Mode)`);
      } else {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        const extension = reportTitle === "Attendance Report" ? "pdf" : "xlsx";
        a.href = url;
        a.download = `${selectedCourse}-${reportTitle.replace(/\s/g, "_")}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert("Failed to generate report: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="reports-container">
        <main className="reports-main-content">
          <div className="loading-state" style={{ textAlign: 'center', padding: '5rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#b8235a' }}></i>
            <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Preparing data engine...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <main className="reports-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Reports & Analytics <i className="fas fa-chart-pie"></i></h2>
            <p>Generate high-quality academic reports and deep-dive analytics for your courses</p>
          </div>
        </header>

        <section className="reports-selection-bar">
          <div className="course-select-group">
            <label>Target Course</label>
            <select
              className="premium-select-p"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                const courseObj = courses.find(c => c.name === e.target.value);
                if (courseObj) setSelectedYear(courseObj.year);
              }}
            >
              {courses.map((course, idx) => (
                <option key={idx} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="course-select-group" style={{ marginLeft: '15px' }}>
            <label>Assigned Year</label>
            <select
              className="premium-select-p"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {/* Only show years assigned to this course */}
              {courses.filter(c => c.name === selectedCourse).map((course, idx) => (
                <option key={idx} value={course.year}>{course.year} Year</option>
              ))}
            </select>
          </div>
          <div className="selection-info">
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
              <i className="fas fa-info-circle"></i> Reports will be generated using the latest synchronized data for the selected academic period.
            </p>
          </div>
        </section>

        <div className="reports-bento-grid">
          {reportTypes.map((report, index) => (
            <div key={index} className="report-premium-card" style={{ '--i': index }}>
              <div className="report-icon-wrapper">
                <i className={report.icon}></i>
              </div>
              <div className="report-card-info">
                <h3>{report.title}</h3>
                <p>{report.desc}</p>
              </div>
              <button
                className="btn-generate-p"
                onClick={() => handleGenerate(report.title)}
                disabled={isGenerating}
              >
                {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-export"></i>}
                {isGenerating ? "Processing..." : "Export Data"}
              </button>
            </div>
          ))}
        </div>

        <div className="reports-footer">
          <button
            className="btn-download-all-p"
            onClick={() => handleGenerate("Full Package")}
            disabled={isGenerating}
          >
            <i className="fas fa-file-archive"></i>
            {isGenerating ? "Preparing Archive..." : "Download Consolidated Report Package"}
          </button>
        </div>
      </main>
    </div>
  );
}
