import React, { useState, useEffect } from "react";
import "./StudentGrades.css";
import gradeService from "../../services/gradeService";
import studentService from "../../services/studentService";

export default function StudentGrades() {
    const [studentProfile, setStudentProfile] = useState(null);
    const registerId = localStorage.getItem("registerId") || "221FA04xxx";

    // All grades fetched from backend
    const [allGrades, setAllGrades] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [displayedGrade, setDisplayedGrade] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                // Fetch student profile from MongoDB
                const profile = await studentService.getStudentByRegNo(registerId);
                setStudentProfile(profile);

                // Fetch grades
                await fetchGrades();
            } catch (err) {
                console.error("Failed to load initial data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Filter displayed grade when subject changes
    useEffect(() => {
        if (selectedSubject && allGrades.length > 0) {
            const grade = allGrades.find(g => g.subject === selectedSubject);
            setDisplayedGrade(grade || null);
        } else {
            setDisplayedGrade(null);
        }
    }, [selectedSubject, allGrades]);

    const fetchGrades = async () => {
        try {
            setLoading(true);
            const myGrades = await gradeService.getStudentGrades(registerId);

            if (myGrades && myGrades.length > 0) {
                const mappedGrades = myGrades.map(g => ({
                    subject: g.subject,
                    midterm1: g.m1 || 0,
                    midterm2: g.m2 || 0,
                    semester: g.semester || 0,
                    assignment: g.assignment || 0,
                    total: g.total || 0,
                    grade: calculateGrade(g.total || 0)
                }));
                setAllGrades(mappedGrades);

                // Extract unique subjects
                const uniqueSubjects = [...new Set(mappedGrades.map(g => g.subject))];
                setSubjects(uniqueSubjects);
            } else {
                setAllGrades([]);
                setSubjects([]);
            }

        } catch (err) {
            console.error("Failed to fetch grades:", err);
            setAllGrades([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateGrade = (total) => {
        const percentage = (total / 200) * 100;
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        return "F";
    };

    const calculateCGPA = () => {
        if (allGrades.length === 0) return "0.00";

        // Convert grades to grade points (A+=10, A=9, B+=8, B=7, C=6, F=0)
        const gradePoints = {
            "A+": 10,
            "A": 9,
            "B+": 8,
            "B": 7,
            "C": 6,
            "F": 0
        };

        const totalPoints = allGrades.reduce((acc, curr) => acc + (gradePoints[curr.grade] || 0), 0);
        return (totalPoints / allGrades.length).toFixed(2);
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'A+': return '#10b981';
            case 'A': return '#22c55e';
            case 'B+': return '#3b82f6';
            case 'B': return '#6366f1';
            case 'C': return '#f59e0b';
            default: return '#ef4444';
        }
    };

    return (
        <div className="student-grades-container">
            <header className="grades-header">
                <div className="header-info">
                    <h2>Academic Results <span className="year-badge">{studentProfile?.year || '3rd'} Year</span></h2>
                    <p>Your personal academic performance from faculty grading system</p>
                </div>
                <div className="gpa-card">
                    <div className="gpa-label">Current CGPA</div>
                    <div className="gpa-value">{calculateCGPA()}</div>
                    <div className="gpa-sublabel">Out of 10.0</div>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading your academic records...</p>
                </div>
            ) : (
                <>
                    {/* Subject Selection */}
                    <div className="subject-selection-container" style={{ margin: '20px 0', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>Select Verified Subject</h3>
                        <select
                            className="subject-dropdown"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={{
                                padding: '10px 20px',
                                fontSize: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                minWidth: '300px',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">-- Choose Subject --</option>
                            {subjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    {/* Displayed Grade Card */}
                    {displayedGrade ? (
                        <div className="grades-table-container">
                            <table className="grades-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Mid-1 (25)</th>
                                        <th>Mid-2 (25)</th>
                                        <th>Sem (100)</th>
                                        <th>Asgn (50)</th>
                                        <th>Total (200)</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="subject-name">{displayedGrade.subject}</td>
                                        <td>{displayedGrade.midterm1}</td>
                                        <td>{displayedGrade.midterm2}</td>
                                        <td>{displayedGrade.semester}</td>
                                        <td>{displayedGrade.assignment}</td>
                                        <td className="overall-score">{displayedGrade.total}</td>
                                        <td>
                                            <span
                                                className="grade-badge"
                                                style={{
                                                    background: getGradeColor(displayedGrade.grade),
                                                    color: 'white'
                                                }}
                                            >
                                                {displayedGrade.grade}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="pass-status" style={{ textAlign: 'center', marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                                <strong>Status: </strong>
                                <span style={{
                                    color: displayedGrade.grade === 'F' ? '#ef4444' : '#10b981',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}>
                                    {displayedGrade.grade === 'F' ? 'FAIL' : 'PASS'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="no-selection-placeholder" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                            <i className="fas fa-arrow-up" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                            <p>Please select a subject above to view your detailed result.</p>
                        </div>
                    )}
                </>
            )}

            <div className="grades-footer">
                <p><i className="fas fa-info-circle"></i> Grades are managed by faculty members. For any discrepancies, contact your course instructor.</p>
            </div>
        </div>
    );
}
