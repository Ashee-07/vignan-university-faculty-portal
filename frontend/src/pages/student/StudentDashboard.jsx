import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import studentService from "../../services/studentService";
import progressService from "../../services/progressService";
import assessmentService from "../../services/assessmentService";
import attendanceService from "../../services/attendanceService";
import apiClient from "../../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState(null);
  const [academicRecords, setAcademicRecords] = useState([]);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendancePercent, setAttendancePercent] = useState("0.0");
  const [gradesData, setGradesData] = useState(null);

  const registerId = localStorage.getItem("registerId") || "221FA04xxx";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch student profile first
        const profile = await studentService.getStudentByRegNo(registerId);
        setStudentProfile(profile);
        const currentYear = profile.year || "3rd";

        // Fetch attendance using attendanceService
        try {
          const history = await attendanceService.getStudentAttendance(registerId);
          // Calculate percentage manually to match StudentAttendance.jsx
          let totalClasses = 0;
          let attendedClasses = 0;

          // Group by unique class sessions to ensure accurate counting
          history.forEach(record => {
            totalClasses++;
            const studentRecord = record.students.find(s => s.regNo === registerId);
            if (studentRecord && studentRecord.status === 'Present') {
              attendedClasses++;
            }
          });

          const percent = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
          setAttendancePercent(percent.toFixed(1));
        } catch (err) {
          console.error("Failed to fetch attendance:", err);
        }

        // Fetch grades and CGPA from grades API
        try {
          const gradesResponse = await apiClient.get(`/grades/${registerId}`);
          setGradesData(gradesResponse.data);
        } catch (err) {
          console.error("Failed to fetch grades:", err);
        }

        // Fetch academic records (from Faculty's progress data)
        const courses = await progressService.getTrackedCourses();
        let allMyRecords = [];

        for (const course of courses) {
          const records = await progressService.getCourseProgress(course.id);
          const myRecord = records.find(r => r.id === registerId || r.id?.replace('FA', '') === registerId?.replace('FA', ''));
          if (myRecord) {
            allMyRecords.push({ ...myRecord, courseName: course.name });
          }
        }
        setAcademicRecords(allMyRecords);

        // Fetch upcoming assessments
        const assessments = await assessmentService.getAssessmentsByYear(studentYear);
        setUpcomingAssessments(assessments);

        // Fetch today's schedule for student's year
        const allTimetable = JSON.parse(localStorage.getItem('timetables') || '[]');
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const mySchedule = allTimetable.filter(slot => slot.year === studentYear && slot.day === today);
        setTodaySchedule(mySchedule);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [registerId]);

  // Use real data from profile or fallback to placeholders while loading
  const studentName = studentProfile?.name || "Student";
  const studentYear = studentProfile?.year || "3rd";
  const studentDept = studentProfile?.department || "IT";
  const cgpa = gradesData?.cgpa || 0;

  // Combined real and stored data for widgets
  const stats = [
    { label: "Overall Attendance", value: `${attendancePercent}%`, icon: "fas fa-user-check", color: "#00f2fe" },
    { label: "Current CGPA", value: cgpa > 0 ? cgpa.toFixed(2) : "N/A", icon: "fas fa-graduation-cap", color: "#4facfe" },
    { label: "Year of Study", value: `${studentYear} Year`, icon: "fas fa-book-reader", color: "#6366f1" },
    { label: "Total Subjects", value: gradesData?.grades?.length?.toString() || "0", icon: "fas fa-book", color: "#10b981" },
  ];

  if (loading) return <div className="loading-portal">Loading Portal...</div>;

  return (
    <div className="student-dashboard">
      <header className="dashboard-header-section">
        <div className="welcome-msg">
          <h1>Welcome back, {studentName}! 🎓</h1>
          <p>Here's what's happening with your academics today.</p>
        </div>
        <div className="current-date">
          <i className="far fa-calendar-alt"></i>
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student Info Card */}
      <div className="student-info-card">
        <div className="info-header">
          <div className="student-avatar">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="student-details">
            <h3>{studentName}</h3>
            <p className="student-id">Registration ID: {registerId}</p>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <i className="fas fa-calendar-alt"></i>
            <div>
              <span className="info-label">Year of Study</span>
              <span className="info-value">{studentYear} Year</span>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-building"></i>
            <div>
              <span className="info-label">Department</span>
              <span className="info-value">{studentDept}</span>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-user-check"></i>
            <div>
              <span className="info-label">Overall Attendance</span>
              <span className="info-value" style={{ color: parseFloat(attendancePercent) >= 75 ? '#4cc9f0' : '#ef233c' }}>
                {attendancePercent}%
              </span>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-graduation-cap"></i>
            <div>
              <span className="info-label">Academic Status</span>
              <span className="info-value status-active">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Performance */}
        <section className="dashboard-card performance-card">
          <div className="card-header">
            <h3>Recent Performance</h3>
            <button className="text-btn" onClick={() => navigate('/student/grades')}>View All</button>
          </div>
          <div className="grades-list">
            {academicRecords.length > 0 ? (
              academicRecords.map((record, idx) => (
                <div key={idx} className="grade-item">
                  <div className="grade-info">
                    <h4>{record.courseName}</h4>
                    <span>Score: {record.overall}%</span>
                  </div>
                  <div className="grade-score">
                    <span className="score-val">Att: {record.attendance}%</span>
                    <span className={`status-badge ${record.overall >= 80 ? 'excellent' : 'good'}`}>
                      {record.overall >= 80 ? 'Excellent' : 'Good'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No academic records found for your Reg ID.</p>
            )}
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="dashboard-card schedule-card">
          <div className="card-header">
            <h3>Today's Classes</h3>
            <button className="text-btn" onClick={() => navigate('/student/timetable')}>View Timetable</button>
          </div>
          <div className="schedule-list">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((slot, idx) => (
                <div key={idx} className={`schedule-item ${idx === 0 ? 'active' : ''}`}>
                  <div className="time">{slot.time}</div>
                  <div className="class-info">
                    <h4>{slot.subject}</h4>
                    <p>Room: {slot.room} • {slot.faculty}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No classes scheduled for today ({new Date().toLocaleDateString('en-US', { weekday: 'long' })}).</p>
            )}
          </div>
        </section>

        {/* Upcoming Assessments */}
        <section className="dashboard-card assessments-card">
          <div className="card-header">
            <h3>Upcoming Assessments</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="assessments-list">
            {upcomingAssessments.length > 0 ? (
              upcomingAssessments.map((item, idx) => (
                <div key={idx} className="assessment-item">
                  <div className="date-badge">
                    <span className="month">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="day">{new Date(item.date).getDate()}</span>
                  </div>
                  <div className="assessment-info">
                    <h4>{item.title}</h4>
                    <p>{item.course} • {item.type}</p>
                  </div>
                  <div className="assessment-meta">
                    <span className="marks">{item.totalMarks}M</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No upcoming assessments found for your year.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
