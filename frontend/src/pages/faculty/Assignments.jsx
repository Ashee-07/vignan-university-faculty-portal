import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Assignments.css';
import assignmentService from '../../services/assignmentService';
import API from '../../lib/api';;

export default function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    totalMarks: ''
  });

  // Load assignments on mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  const [facultySubjects, setFacultySubjects] = useState([]);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const facultyId = localStorage.getItem('facultyId');
      const data = await assignmentService.getAssignments({ facultyId });
      setAssignments(data);

      // Fetch faculty subjects for dropdown (reusing facultyService logic if needed, or simple local storage check)
      // For now, let's try to get them from local storage or a service if available
      // Fetch faculty subjects for dropdown directly from MongoDB
      const facultyOid = localStorage.getItem('facultyOid');
      if (facultyOid) {
        const res = await API.get(`/faculty/${facultyOid}`);
        if (res.data.assignedSubjects) {
          setFacultySubjects(res.data.assignedSubjects);
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (newAssignment.title && newAssignment.course && newAssignment.dueDate) {
      try {
        const payload = {
          ...newAssignment,
          subject: newAssignment.course,
          facultyId: localStorage.getItem('facultyId'),
          year: new Date().getFullYear().toString(),
          deadline: newAssignment.dueDate // Map dueDate to deadline
        };
        const created = await assignmentService.createAssignment(payload);
        setAssignments([created, ...assignments]);
        setNewAssignment({ title: '', course: '', description: '', dueDate: '', totalMarks: '', file: null });
        setShowCreateForm(false);
        alert('Assignment created successfully!');
      } catch (err) {
        alert('Creation failed: ' + err.message);
      }
    } else {
      alert('Please fill in all required fields (Title, Course, Due Date)');
    }
  };

  const handleViewSubmissions = (assignment) => {
    alert(`Viewing submissions for:\n"${assignment.title}"\n\nSubmissions: ${assignment.submissions}/${assignment.total}\nDue Date: ${assignment.dueDate}`);
  };

  const handleEdit = async (assignment) => {
    const newTitle = prompt(`Edit Assignment\n\nCurrent Title: ${assignment.title}\n\nEnter new title:`, assignment.title);
    if (newTitle && newTitle.trim()) {
      try {
        const updated = await assignmentService.updateAssignment(assignment._id, { ...assignment, title: newTitle.trim() });
        setAssignments(assignments.map(a => a._id === assignment._id ? updated : a));
        alert('Assignment updated successfully!');
      } catch (err) {
        alert('Update failed: ' + err.message);
      }
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?\n\nThis action cannot be undone.')) {
      try {
        await assignmentService.deleteAssignment(assignmentId);
        setAssignments(assignments.filter(a => a._id !== assignmentId));
        alert('Assignment deleted successfully!');
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && assignments.length === 0) {
    return (
      <div className="assignments-container">
        <main className="assignments-main-content">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Fetching assignments data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignments-container">
        <main className="assignments-main-content">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Error: {error}</p>
            <button onClick={fetchAssignments} className="premium-primary-btn">Retry</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="assignments-container">
      <main className="assignments-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Assignments Management <i className="fas fa-tasks"></i></h2>
            <p>Create, distribute and evaluate student assignments</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="premium-primary-btn"
          >
            <i className="fas fa-plus"></i> Create New Assignment
          </button>
        </header>

        <div className="assignments-action-bar">
          <div className="assignments-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showCreateForm && (
          <div className="create-form-premium">
            <div className="card-top">
              <h3><i className="fas fa-plus-circle"></i> Create New Assignment</h3>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>×</button>
            </div>
            <div className="assignments-form-grid">
              <div className="form-group">
                <label>Assignment Title</label>
                <input
                  className="form-input-premium"
                  type="text"
                  placeholder="Enter title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Course Name</label>
                <select
                  className="form-input-premium"
                  value={newAssignment.course}
                  onChange={(e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    const targetYear = selectedOption.getAttribute('data-year');
                    setNewAssignment({ ...newAssignment, course: e.target.value, targetYear: targetYear });
                  }}
                >
                  <option value="">Select Course</option>
                  {facultySubjects.length > 0 ? (
                    facultySubjects.map((sub, idx) => (
                      <option key={idx} value={sub.subject} data-year={sub.year}>{sub.subject} - {sub.year} Year</option>
                    ))
                  ) : (
                    <>
                      <option value="Advanced Java" data-year="3">Advanced Java - 3rd Year (Fallback)</option>
                      <option value="Web Technologies" data-year="3">Web Technologies - 3rd Year (Fallback)</option>
                    </>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  className="form-input-premium"
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Total Marks</label>
                <input
                  className="form-input-premium"
                  type="number"
                  placeholder="e.g. 10"
                  value={newAssignment.totalMarks}
                  onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-textarea-premium"
                placeholder="Enter assignment details..."
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="file-upload-zone" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                id="assign-upload"
                hidden
                onChange={(e) => setNewAssignment({ ...newAssignment, file: e.target.files[0] })}
              />
              <label htmlFor="assign-upload" className="file-label">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>{newAssignment.file ? newAssignment.file.name : "Attach Assignment File (PDF/Doc)"}</span>
              </label>
            </div>

            <div className="form-actions">
              <button onClick={handleCreate} className="submit-btn-premium">Publish Assignment</button>
              <button onClick={() => setShowCreateForm(false)} className="cancel-btn-premium">Cancel</button>
            </div>
          </div>
        )}

        <div className="assignments-bento-grid">
          {filteredAssignments.map((assignment, idx) => (
            <div key={assignment._id} className="assignment-premium-card" style={{ '--i': idx }}>
              <div className="assignment-card-header">
                <h3>{assignment.title}</h3>
                <span className="course-badge">{assignment.course}</span>
              </div>
              <div className="assignment-card-body">
                <div className="meta-info">
                  <span className="meta-item"><i className="fas fa-calendar-alt"></i> Due: {assignment.dueDate}</span>
                  <span className="submissions-count">
                    {assignment.submissions}/{assignment.total} Submitted
                  </span>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="assignment-card-footer">
                <button className="action-btn-premium" onClick={() => handleViewSubmissions(assignment)}>
                  <i className="fas fa-eye"></i> View
                </button>
                <button className="action-btn-premium" onClick={() => handleEdit(assignment)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="action-btn-premium danger" onClick={() => handleDelete(assignment._id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}