import React, { useState, useEffect } from "react";
import "./StudentAttendance.css";
import attendanceService from "../../services/attendanceService";

export default function StudentAttendance() {
    const [subjects, setSubjects] = useState([]);
    const [attendancePercent, setAttendancePercent] = useState(0);
    const registerId = localStorage.getItem("registerId") || "";

    useEffect(() => {
        calculateAttendance();
    }, []);

    const calculateAttendance = async () => {
        console.log("Register ID from localStorage:", registerId);
        if (!registerId) {
            console.warn("No Register ID found!");
            return;
        }

        try {
            const history = await attendanceService.getStudentAttendance(registerId);
            console.log("Fetched Attendance History:", history);

            // Group by subject
            const subjectStats = {};

            history.forEach(record => {
                if (!subjectStats[record.subject]) {
                    subjectStats[record.subject] = { present: 0, total: 0 };
                }

                subjectStats[record.subject].total++;

                const studentRecord = record.students.find(s => s.regNo === registerId);
                if (studentRecord && studentRecord.status === 'Present') {
                    subjectStats[record.subject].present++;
                }
            });

            console.log("Calculated Subject Stats:", subjectStats);

            // Convert to array
            const finalSubjects = Object.keys(subjectStats).map(subject => {
                const { present, total } = subjectStats[subject];
                return {
                    name: subject,
                    attended: present,
                    total: total,
                    percent: total > 0 ? Math.round((present / total) * 100) : 0
                };
            });

            console.log("Final Subjects Data:", finalSubjects);

            setSubjects(finalSubjects);

            const overall = finalSubjects.length > 0
                ? Math.round(finalSubjects.reduce((acc, curr) => acc + curr.percent, 0) / finalSubjects.length)
                : 0;
            setAttendancePercent(overall);

        } catch (err) {
            console.error("Failed to fetch student attendance:", err);
        }
    };

    return (
        <div className="student-attendance-container">
            <header className="attendance-header">
                <div className="header-info">
                    <h2>Overall Attendance: <span className="overall-percent">{attendancePercent}%</span></h2>
                    <p>Attendance records are managed by the University Administration.</p>
                </div>
            </header>

            <div className="attendance-overview-card glass-card">
                <div className="progress-circle-container">
                    <svg className="progress-svg" viewBox="0 0 100 100">
                        <circle className="bg-circle" cx="50" cy="50" r="45"></circle>
                        <circle
                            className="fg-circle"
                            cx="50"
                            cy="50"
                            r="45"
                            style={{ strokeDasharray: `${attendancePercent * 2.82} 282` }}
                        ></circle>
                    </svg>
                    <div className="percent-label">{attendancePercent}%</div>
                </div>
                <div className="attendance-stats">
                    <div className="stat-row">
                        <span>Status:</span>
                        <span className="status-badge good">Eligible for Exams</span>
                    </div>
                    <div className="stat-row">
                        <span>Last Updated:</span>
                        <span>Today, 10:30 AM</span>
                    </div>
                </div>
            </div>

            <h3 className="section-title">Subject-wise Analytics</h3>
            <div className="subject-attendance-grid">
                {subjects.map((sub, idx) => (
                    <div key={idx} className="subject-att-card">
                        <div className="sub-header">
                            <h4>{sub.name}</h4>
                            <span className="sub-percent">{sub.percent}%</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${sub.percent}%` }}></div>
                        </div>
                        <div className="att-counts">
                            {sub.attended} out of {sub.total} classes attended
                        </div>
                    </div>
                ))}
            </div>

            <div className="attendance-guidelines">
                <h4><i className="fas fa-exclamation-triangle"></i> Important Note</h4>
                <p>A minimum of 75% overall attendance is mandatory to appear for external examinations. For any corrections, please submit a written request at the student service center.</p>
            </div>
        </div>
    );
}
