import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ModulePage.css';
import './InternalAssessment.css';
import assessmentService from '../../services/assessmentService';

export default function InternalAssessment() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyAssignments, setFacultyAssignments] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    course: '',
    date: '',
    totalMarks: '',
    type: 'Exam'
  });

  // Load assessments on mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);

      // Fetch assessments
      const data = await assessmentService.getAssessments();
      setAssessments(data);

      // Fetch faculty assignments directly from MongoDB
      const facultyOid = localStorage.getItem('facultyOid');
      if (facultyOid) {
        const profile = await facultyService.getFacultyById(facultyOid);
        setFacultyAssignments(profile.assignedSubjects || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (newAssessment.title && newAssessment.course && newAssessment.date) {
      try {
        const found = facultyAssignments.find(a => a.subject === newAssessment.course);

        const payload = {
          ...newAssessment,
          year: found ? found.year : '3rd', // Default to 3rd if not found
          facultyId: localStorage.getItem('facultyId') || 'FAC001'
        };

        const created = await assessmentService.createAssessment(payload);
        setAssessments([created, ...assessments]);
        setNewAssessment({ title: '', course: '', date: '', totalMarks: '', type: 'Exam' });
        setShowCreateForm(false);
        alert('Assessment created successfully!');
      } catch (err) {
        alert('Creation failed: ' + err.message);
      }
    } else {
      alert('Please fill in all required fields (Title, Course, Date)');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await assessmentService.deleteAssessment(id);
        setAssessments(assessments.filter(a => a.id !== id));
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const filteredAssessments = assessments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && assessments.length === 0) {
    return (
      <div className="assessment-container">
        <main className="assessment-main-content">
          <div className="loading-state" style={{ textAlign: 'center', padding: '5rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#b8235a' }}></i>
            <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Loading assessment data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <main className="assessment-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Internal Assessment <i className="fas fa-clipboard-list"></i></h2>
            <p>Schedule and manage internal exams, quizzes, and continuous evaluations</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="premium-primary-btn"
          >
            <i className="fas fa-plus-circle"></i> Create Assessment
          </button>
        </header>

        <div className="assessment-action-bar">
          <div className="assessment-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by title or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showCreateForm && (
          <div className="assessment-form-premium fadeUp">
            <h3>New Internal Assessment</h3>
            <div className="form-grid-premium">
              <div className="form-group">
                <label>Assessment Title</label>
                <input
                  className="form-input-p"
                  type="text"
                  placeholder="e.g. Mid-Term 1"
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Course Code</label>
                <select
                  className="form-select-p"
                  value={newAssessment.course}
                  onChange={(e) => setNewAssessment({ ...newAssessment, course: e.target.value })}
                >
                  <option value="">Select Course</option>
                  {facultyAssignments.map((a, idx) => (
                    <option key={idx} value={a.subject}>{a.subject}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  className="form-input-p"
                  type="date"
                  value={newAssessment.date}
                  onChange={(e) => setNewAssessment({ ...newAssessment, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Total Marks</label>
                <input
                  className="form-input-p"
                  type="number"
                  placeholder="e.g. 50"
                  value={newAssessment.totalMarks}
                  onChange={(e) => setNewAssessment({ ...newAssessment, totalMarks: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Assessment Type</label>
                <select
                  className="form-select-p"
                  value={newAssessment.type}
                  onChange={(e) => setNewAssessment({ ...newAssessment, type: e.target.value })}
                >
                  <option value="Exam">Exam</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Practical">Practical</option>
                  <option value="Viva">Viva</option>
                </select>
              </div>
            </div>
            <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleCreate} className="premium-primary-btn">Schedule Assessment</button>
              <button onClick={() => setShowCreateForm(false)} className="cancel-btn-premium" style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="assessment-bento-grid">
          {filteredAssessments.map((assessment, idx) => (
            <div key={assessment.id} className="assessment-premium-card" style={{ '--i': idx }}>
              <span className={`card-type-tag type-${assessment.type.toLowerCase()}`}>
                {assessment.type}
              </span>
              <div className="assessment-info">
                <h3>{assessment.title}</h3>
                <div className="assessment-meta">
                  <span><i className="fas fa-book"></i> {assessment.course}</span>
                  <span><i className="fas fa-calendar-alt"></i> {assessment.date}</span>
                </div>
                <div className="assessment-meta">
                  <span style={{ color: '#b8235a', fontWeight: 800 }}>
                    <i className="fas fa-star"></i> Max Marks: {assessment.totalMarks}
                  </span>
                </div>
              </div>
              <div className="assessment-actions">
                <button className="btn-assessment-p primary"><i className="fas fa-pen-nib"></i> Enter Marks</button>
                <button className="btn-assessment-p"><i className="fas fa-chart-bar"></i> Stats</button>
                <button className="btn-assessment-p"><i className="fas fa-edit"></i> Edit</button>
                <button className="btn-assessment-p danger" onClick={() => handleDelete(assessment.id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}