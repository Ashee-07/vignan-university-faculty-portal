import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ModulePage.css';
import './StudentProgress.css';
import progressService from '../../services/progressService';

export default function StudentProgress() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const fetchedCourses = await progressService.getTrackedCourses();
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          const defaultCourse = fetchedCourses[0].name;
          setSelectedCourse(defaultCourse);
          const data = await progressService.getCourseProgress(defaultCourse);
          setStudents(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Handle course change
  const handleCourseChange = async (courseName) => {
    try {
      setSelectedCourse(courseName);
      setIsLoading(true);
      const data = await progressService.getCourseProgress(courseName);
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (score) => {
    if (score >= 90) return 'high';
    if (score >= 75) return 'mid';
    if (score >= 60) return 'low';
    return 'critical';
  };



  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: students.length,
    avgAttendance: students.length > 0 ? (students.reduce((a, b) => a + b.attendance, 0) / students.length).toFixed(1) : 0,
    avgOverall: students.length > 0 ? (students.reduce((a, b) => a + b.overall, 0) / students.length).toFixed(1) : 0,
    highPerformers: students.filter(s => s.overall >= 85).length
  };

  if (isLoading && students.length === 0) {
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
        <header className="page-header">
          <div className="header-info">
            <h2>Student Progress <i className="fas fa-chart-line"></i></h2>
            <p>Monitor individual performance, metrics, and academic growth</p>
          </div>
        </header>

        {/* Stats Bento Grid */}
        <div className="progress-stats-grid">
          <div className="stat-card-premium">
            <span className="stat-label">Enrolled Students</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card-premium">
            <span className="stat-label">Avg. Attendance</span>
            <span className="stat-value">{stats.avgAttendance}%</span>
          </div>
          <div className="stat-card-premium">
            <span className="stat-label">Class Average</span>
            <span className="stat-value">{stats.avgOverall}%</span>
          </div>
          <div className="stat-card-premium">
            <span className="stat-label">High Performers</span>
            <span className="stat-value">{stats.highPerformers}</span>
          </div>
        </div>

        <div className="progress-action-bar">
          <div className="course-selector">
            <select
              className="premium-select"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              {courses.map(course => (
                <option key={course.id} value={course.name}>{course.id} - {course.name}</option>
              ))}
            </select>
          </div>
          <div className="progress-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container-premium">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Attendance</th>
                <th>Assignments</th>
                <th>Exams</th>
                <th>Overall</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr key={student.id} style={{ '--i': idx }}>
                  <td className="student-id">{student.id}</td>
                  <td className="student-name">{student.name}</td>
                  <td>
                    <span className={`percentage-chip ${getStatusClass(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td>
                    <span className="assignments-pill">{student.assignments}/50</span>
                  </td>
                  <td>
                    <span className={`percentage-chip ${getStatusClass(student.exams)}`}>
                      {student.exams}%
                    </span>
                  </td>
                  <td>
                    <span className="overall-score-txt" style={{ fontWeight: 800 }}>{student.overall}%</span>
                  </td>
                  <td>
                    <span className={`overall-score ${student.grade.toLowerCase()}`}>
                      {student.grade}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-btn-premium"
                      onClick={() => navigate('/student-performance', { state: { search: student.id } })}
                    >
                      Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}