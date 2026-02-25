import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Attendance.css";
import attendanceService from "../../../services/attendanceService";
import usePageTitle from "../../../hooks/usePageTitle";

export default function Attendance() {
  usePageTitle("Attendance Management");
  const navigate = useNavigate();
  const facultyName = localStorage.getItem("facultyName") || "Faculty Member";

  // State Management
  const [viewMode, setViewMode] = useState('mark');
  const [todayDate, setTodayDate] = useState("");
  const [currentDayName, setCurrentDayName] = useState("");
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Attendance State
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Session Details State
  const [selectedDate, setSelectedDate] = useState("");
  const [period, setPeriod] = useState("");
  const [sessionType, setSessionType] = useState("Theory");
  const [topic, setTopic] = useState("");
  const [remarks, setRemarks] = useState("");

  // History State
  const [historyData, setHistoryData] = useState([]);

  // Initialize Data
  useEffect(() => {
    const date = new Date();
    const formattedToday = date.toISOString().split('T')[0];

    setSelectedDate(formattedToday);
    setTodayDate(formattedToday);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setCurrentDayName(dayNames[date.getDay()]);

    fetchInitialData();
  }, [viewMode]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const classes = await attendanceService.getClasses();
      console.log(`[Attendance] Loaded ${classes.length} classes:`, classes);
      setClassesList(classes);
    } catch (err) {
      setError("Failed to load classes: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Restrict Date Change → Only Today's Date Allowed
  const handleDateChange = (e) => {
    const today = todayDate;
    const selected = e.target.value;

    if (selected === today) {
      setSelectedDate(selected);
    } else {
      setSelectedDate(today);
      alert(`Attendance can only be marked for today's date: ${today}`);
    }
  };

  // Fetch Students or History Data
  useEffect(() => {
    if (selectedClass) {
      if (viewMode === 'mark') {
        const fetchStudents = async () => {
          try {
            // Fetch students from the unified master list via attendanceService
            const studentList = await attendanceService.getStudentsForClass(selectedClass);
            console.log(`[Attendance] Loaded ${studentList.length} students for class:`, selectedClass);

            // Sort by ID
            studentList.sort((a, b) => a.id.localeCompare(b.id));

            setStudents(studentList);

            // Initialize all students as Present by default
            const initialStatus = {};
            studentList.forEach(s => initialStatus[s.id] = 'Present');
            setAttendance(initialStatus);
          } catch (err) {
            console.error('Failed to fetch students:', err);
            setStudents([]);
          }
        };
        fetchStudents();
      } else {
        const fetchHistory = async () => {
          try {
            setIsLoading(true);
            const history = await attendanceService.getAttendanceHistory(selectedClass.id || selectedClass.course);
            setHistoryData(history);
          } catch (err) {
            setError("Failed to load history: " + err.message);
          } finally {
            setIsLoading(false);
          }
        };
        fetchHistory();
      }
    }
  }, [selectedClass, viewMode]);

  const toggleStatus = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const markAll = (status) => {
    const newStatus = {};
    students.forEach(s => newStatus[s.id] = status);
    setAttendance(newStatus);
  };

  const submitAttendance = async () => {
    try {
      if (!period) {
        alert("Please select a period before submitting.");
        return;
      }
      const attendanceData = {
        date: selectedDate,
        classId: selectedClass.course, // Using course name as ID for filtering
        year: selectedClass.year,
        period,
        sessionType,
        topic,
        remarks,
        records: attendance
      };

      await attendanceService.saveAttendance(attendanceData);

      const present = Object.values(attendance).filter(s => s === 'Present').length;
      const total = students.length;
      alert(`Attendance Saved to MongoDB Successfully!\nStats: ${present}/${total} Present`);
    } catch (err) {
      // Check if it's a duplicate attendance error
      if (err.response?.status === 409 || err.response?.data?.duplicate) {
        alert("⚠️ Duplicate Attendance Detected!\n\nYou have already marked attendance for this class, period, and date.\n\nPlease check your records or select a different period/date.");
      } else {
        alert("Submission failed: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="attendance-container">
      <main className="attendance-main-content">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Attendance Management <i className="fas fa-clipboard-check"></i></h2>
            <p>{viewMode === 'mark' ? "Mark attendance, select period, and log topics." : "View attendance history and analytics"}</p>
          </div>

          <div className="view-toggle">
            <button className={`toggle-btn ${viewMode === 'mark' ? 'active' : ''}`} onClick={() => { setViewMode('mark'); setSelectedClass(null); }}>
              Mark Today
            </button>
            <button className={`toggle-btn ${viewMode === 'history' ? 'active' : ''}`} onClick={() => { setViewMode('history'); setSelectedClass(null); }}>
              View History
            </button>
          </div>
        </header>

        <div className="controls-panel">
          <div className="control-group">
            <label>Select Class</label>
            <select className="class-select" onChange={(e) => {
              const cls = classesList.find(c => c.id === Number(e.target.value) || c.course === e.target.value);
              setSelectedClass(cls);
            }} value={selectedClass?.id || selectedClass?.course || ""}>
              <option value="">-- Choose a Class --</option>
              {classesList.map((cls, idx) => (
                <option key={idx} value={cls.id || cls.course}>
                  {viewMode === 'mark' ? `[${cls.year}] ${cls.time} | ${cls.course} (${cls.room})` : `[${cls.year}] ${cls.course} (${cls.type})`}
                </option>
              ))}
            </select>
          </div>

          {viewMode === 'mark' && (
            <>
              <div className="control-group">
                <label>Date</label>
                <div className="date-display">
                  <input
                    type="date"
                    className="date-selector"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={todayDate}
                    max={todayDate}
                    title="Only today's date is allowed"
                  />
                  <span className="date-info">Today ({currentDayName})</span>
                </div>
              </div>

              <div className="control-group">
                <label>Period</label>
                <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option value="" disabled>Select Period</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => <option key={p} value={p}>Period {p}</option>)}
                </select>
              </div>

              <div className="control-group">
                <label>Type</label>
                <div className="type-toggle">
                  <button className={`type-btn ${sessionType === 'Theory' ? 'active' : ''}`} onClick={() => setSessionType('Theory')}>Theory</button>
                  <button className={`type-btn ${sessionType === 'Lab' ? 'active' : ''}`} onClick={() => setSessionType('Lab')}>Lab</button>
                </div>
              </div>

              <div className="fee-legend">
                <span className="dot full"></span> Full Fee
                <span className="dot partial"></span> Partial
                <span className="dot none"></span> Due
              </div>
            </>
          )}
        </div>

        {selectedClass ? (
          viewMode === 'mark' ? (
            <>
              <div className="session-details">
                <div className="detail-row">
                  <div className="detail-field">
                    <label>Topic Covered</label>
                    <input
                      type="text"
                      placeholder="Enter topic covered in this session"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  <div className="detail-field">
                    <label>Remarks (Optional)</label>
                    <input
                      type="text"
                      placeholder="Any special remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="attendance-header">
                <div className="header-left">
                  <h3>Students List</h3>
                  <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="header-right">
                  <div className="mark-all-buttons">
                    <button className="mark-all-btn present" onClick={() => markAll('Present')}>
                      Mark All Present
                    </button>
                    <button className="mark-all-btn absent" onClick={() => markAll('Absent')}>
                      Mark All Absent
                    </button>
                  </div>
                  <div className="stats">
                    <span className="stat-item">
                      <i className="fas fa-user-check"></i>
                      Present: {Object.values(attendance).filter(s => s === 'Present').length}
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-user-times"></i>
                      Absent: {Object.values(attendance).filter(s => s === 'Absent').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="students-grid">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="student-card">
                    <div className="student-info">
                      <div className="student-id">{student.id}</div>
                      <div className="student-name">{student.name}</div>
                      <div className={`fee-status ${student.feeStatus}`}>
                        {student.feeStatus === 'full' ? 'Paid' :
                          student.feeStatus === 'partial' ? 'Partial' : 'Due'}
                      </div>
                    </div>
                    <div className="attendance-toggle">
                      <button
                        className={`status-btn ${attendance[student.id] === 'Present' ? 'present active' : ''}`}
                        onClick={() => toggleStatus(student.id)}
                      >
                        <i className="fas fa-check"></i> Present
                      </button>
                      <button
                        className={`status-btn ${attendance[student.id] === 'Absent' ? 'absent active' : ''}`}
                        onClick={() => toggleStatus(student.id)}
                      >
                        <i className="fas fa-times"></i> Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="submit-section">
                <button className="submit-btn" onClick={submitAttendance}>
                  <i className="fas fa-save"></i> Submit Attendance
                </button>
                <p className="submit-note">
                  <i className="fas fa-info-circle"></i>
                  Attendance will be saved for {selectedDate}, Period {period} ({sessionType})
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="history-header">
                <h3>Attendance History - {selectedClass.course}</h3>
                <div className="history-stats">
                  <div className="stat-card">
                    <div className="stat-value">85%</div>
                    <div className="stat-label">Average Attendance</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">42/60</div>
                    <div className="stat-label">Last Session</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">18</div>
                    <div className="stat-label">Sessions Taken</div>
                  </div>
                </div>
              </div>

              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Present</th>
                      <th>Total</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((record, idx) => (
                      <tr key={idx}>
                        <td>{record.date}</td>
                        <td>{record.present}</td>
                        <td>{record.total}</td>
                        <td>
                          <div className="percentage-bar">
                            <div className="bar-container">
                              <div
                                className={`bar-fill ${record.percentage >= 75 ? 'high' : record.percentage >= 60 ? 'medium' : 'low'}`}
                                style={{ width: `${record.percentage}%` }}
                              ></div>
                            </div>
                            <span>{record.percentage}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`attendance-status ${record.percentage >= 75 ? 'good' : record.percentage >= 60 ? 'average' : 'poor'}`}>
                            {record.percentage >= 75 ? 'Good' : record.percentage >= 60 ? 'Average' : 'Poor'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="analytics-section">
                <h4>Attendance Trend</h4>
                <div className="trend-chart">
                  {historyData.map((record, idx) => (
                    <div key={idx} className="chart-bar">
                      <div
                        className={`bar ${record.percentage >= 75 ? 'high' : record.percentage >= 60 ? 'medium' : 'low'}`}
                        style={{ height: `${record.percentage}%` }}
                        title={`${record.date}: ${record.percentage}%`}
                      ></div>
                      <div className="bar-label">{record.date}</div>
                    </div>
                  ))}                </div>
              </div>
            </>
          )
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <h3>No Class Selected</h3>
            <p>Please select a class from the dropdown above to {viewMode === 'mark' ? 'mark attendance' : 'view history'}</p>
          </div>
        )}
      </main>
    </div>
  );
}