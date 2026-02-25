import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ModulePage.css';
import './Grades.css';
import gradeService from '../../services/gradeService';

export default function Grades() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Local state for inline editing: { studentId: { m1, m2, sem, asgn } }
  const [editedGrades, setEditedGrades] = useState({});

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await gradeService.getCourses();
        setCourses(data);

        // Extract unique years
        const uniqueYears = [...new Set(data.map(c => c.year))];
        setYears(uniqueYears);
      } catch (err) {
        setError("Failed to load courses: " + err.message);
      }
    };
    fetchCourses();
  }, []);

  // Filter subjects when year changes
  useEffect(() => {
    if (selectedYear) {
      const filteredSubjects = courses
        .filter(c => c.year === selectedYear)
        .map(c => c.subject);
      setSubjects(filteredSubjects);
      setSelectedSubject('');
    } else {
      setSubjects([]);
    }
  }, [selectedYear, courses]);

  // Fetch students when subject changes
  useEffect(() => {
    if (selectedYear && selectedSubject) {
      const fetchStudents = async () => {
        try {
          setIsLoading(true);
          const data = await gradeService.getStudents(selectedYear, selectedSubject);

          // Sort by ID
          data.sort((a, b) => a.id.localeCompare(b.id));

          setStudents(data);
          setEditedGrades({}); // Reset edits on load
        } catch (err) {
          setError("Failed to load students: " + err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedYear, selectedSubject]);

  const handleStartEdit = (student) => {
    setEditedGrades(prev => ({
      ...prev,
      [student.id]: {
        m1: student.midterm1,
        m2: student.midterm2,
        semester: student.semester,
        assignment: student.assignment
      }
    }));
  };

  const handleInputChange = (studentId, field, value) => {
    setEditedGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveRow = async (studentId) => {
    const grades = editedGrades[studentId];
    if (!grades) return;

    try {
      await gradeService.saveGrade({
        regNo: studentId,
        subject: selectedSubject,
        m1: parseInt(grades.m1) || 0,
        m2: parseInt(grades.m2) || 0,
        semester: parseInt(grades.semester) || 0,
        assignment: parseInt(grades.assignment) || 0
      });

      // Optimistic update of main student list for Total/Grade display
      const updatedStudents = students.map(s => {
        if (s.id === studentId) {
          const total = (parseInt(grades.m1) || 0) + (parseInt(grades.m2) || 0) + (parseInt(grades.semester) || 0) + (parseInt(grades.assignment) || 0);
          return {
            ...s,
            midterm1: grades.m1,
            midterm2: grades.m2,
            semester: grades.semester,
            assignment: grades.assignment,
            total: total,
            grade: calculateGrade(total)
          };
        }
        return s;
      });
      setStudents(updatedStudents);

      // Remove from edited state to exit edit mode
      const newEdits = { ...editedGrades };
      delete newEdits[studentId];
      setEditedGrades(newEdits);

      alert('Saved!');
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
  };

  const calculateGrade = (total) => {
    const percentage = (total / 200) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
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
    <div className="grades-container">
      <main className="grades-main-content">
        <header className="page-header">
          <div>
            <h2>Grades & MarksEntry <i className="fas fa-edit"></i></h2>
            <p>Select Year and Subject to enter marks for students.</p>
          </div>
        </header>

        {/* Selection Area */}
        <div className="grades-selection" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Select Year</label>
            <select
              className="form-input"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">-- Select Year --</option>
              {years.map(y => (
                <option key={y} value={y}>{y} Year</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select Subject</label>
            <select
              className="form-input"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        {students.length > 0 && (
          <div className="stats-bar">
            <div className="stats-card">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{students.length}</span>
            </div>
            <div className="stats-card">
              <span className="stat-label">Class Average</span>
              <span className="stat-value">
                {(students.reduce((acc, s) => acc + s.total, 0) / students.length).toFixed(1)} / 200
              </span>
            </div>
          </div>
        )}

        {/* Marks Entry Table */}
        {selectedSubject && (
          <div className="distribution-section">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Student ID</th>
                    <th style={{ width: '20%' }}>Name</th>
                    <th style={{ width: '10%' }}>Mid-1 (25)</th>
                    <th style={{ width: '10%' }}>Mid-2 (25)</th>
                    <th style={{ width: '10%' }}>Sem (100)</th>
                    <th style={{ width: '10%' }}>Asgn (50)</th>
                    <th style={{ width: '10%' }}>Total (200)</th>
                    <th style={{ width: '5%' }}>Grade</th>
                    <th style={{ width: '10%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? students.map(student => {
                    const isEditing = !!editedGrades[student.id];
                    return (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="inline-input"
                              value={editedGrades[student.id]?.m1}
                              onChange={(e) => handleInputChange(student.id, 'm1', e.target.value)}
                              max="25"
                            />
                          ) : (
                            student.midterm1 || '-'
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="inline-input"
                              value={editedGrades[student.id]?.m2}
                              onChange={(e) => handleInputChange(student.id, 'm2', e.target.value)}
                              max="25"
                            />
                          ) : (
                            student.midterm2 || '-'
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="inline-input"
                              value={editedGrades[student.id]?.semester}
                              onChange={(e) => handleInputChange(student.id, 'semester', e.target.value)}
                              max="100"
                            />
                          ) : (
                            student.semester || '-'
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="inline-input"
                              value={editedGrades[student.id]?.assignment}
                              onChange={(e) => handleInputChange(student.id, 'assignment', e.target.value)}
                              max="50"
                            />
                          ) : (
                            student.assignment || '-'
                          )}
                        </td>
                        <td><strong>{student.total}</strong></td>
                        <td>
                          <span style={{ color: getGradeColor(student.grade), fontWeight: 'bold' }}>
                            {student.grade}
                          </span>
                        </td>
                        <td>
                          {isEditing ? (
                            <button className="save-btn-small" onClick={() => handleSaveRow(student.id)}>
                              <i className="fas fa-save"></i> Save
                            </button>
                          ) : (
                            <button className="edit-btn-small" onClick={() => handleStartEdit(student)}>
                              <i className="fas fa-edit"></i> Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No students found for this Year/Subject.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <style jsx>{`
        .data-table th, .data-table td {
            text-align: center;
            vertical-align: middle;
            padding: 12px 8px;
        }
        .inline-input {
            width: 100%;
            max-width: 70px;
            padding: 8px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            text-align: center;
            font-weight: 600;
            margin: 0 auto;
            display: block;
        }
        .inline-input:focus {
            border-color: #3b82f6;
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .save-btn-small {
            background: #10b981;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            width: 80px;
        }
        .save-btn-small:hover {
            background: #059669;
        }
        .edit-btn-small {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            width: 80px;
        }
        .edit-btn-small:hover {
            background: #2563eb;
        }
      `}</style>
    </div>
  );
}
