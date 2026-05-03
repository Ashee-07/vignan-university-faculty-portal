import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionPapers.css';
import paperService from '../../services/paperService';
import facultyService from '../../services/facultyService';
import { BASE_URL } from '../../services/api';

export default function QuestionPapers() {
  const navigate = useNavigate();
  const [questionPapers, setQuestionPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyAssignments, setFacultyAssignments] = useState([]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newPaper, setNewPaper] = useState({
    course: '',
    year: '',
    semester: '',
    type: '',
    targetYear: ''
  });

  // Load papers on mount
  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const facultyId = localStorage.getItem('facultyId');
      const data = await paperService.getPapers({ facultyId });
      setQuestionPapers(data);

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

  const handleUpload = async () => {
    if (newPaper.course && newPaper.type && newPaper.file) {
      try {
        const payload = {
          ...newPaper,
          subject: newPaper.course, // Map course to subject
          facultyId: localStorage.getItem('facultyId'), // Add facultyId
          year: new Date().getFullYear().toString(), // Auto-set current year
          title: `${newPaper.type} - ${newPaper.course}`
        };
        const uploadedPaper = await paperService.uploadPaper(payload);
        setQuestionPapers([uploadedPaper, ...questionPapers]);
        setNewPaper({ course: '', type: '', module: '', topic: '', targetYear: '', file: null });
        setShowUploadForm(false);
        alert('Question paper uploaded successfully!');
      } catch (err) {
        alert('Upload failed: ' + err.message);
      }
    } else {
      alert('Please fill all fields and select a file!');
    }
  };

  const handleDownload = (paper) => {
    // Construct full URL if it's a relative path from backend
    const fileUrl = paper.url.startsWith('http') ? paper.url : `${BASE_URL}${paper.url}`;
    window.open(fileUrl, '_blank');
  };

  const handlePreview = (paper) => {
    alert(`Opening preview for: \n${paper.course} - ${paper.type} (${paper.year})`);
  };

  const handleShare = (paper) => {
    const shareText = `Question Paper: ${paper.course} - ${paper.type} (${paper.year})`;
    navigator.clipboard.writeText(shareText);
    alert('Link copied to clipboard!');
  };

  const handleDelete = async (paperId) => {
    if (window.confirm('Are you sure you want to delete this question paper?')) {
      try {
        await paperService.deletePaper(paperId);
        setQuestionPapers(questionPapers.filter(p => p._id !== paperId));
        alert('Question paper deleted successfully!');
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Mid-Term': return '#2196F3';
      case 'End-Term': return '#4CAF50';
      case 'Model': return '#FF9800';
      default: return '#607d8b';
    }
  };

  if (isLoading && questionPapers.length === 0) {
    return (
      <div className="qp-container">
        <main className="qp-main-content">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading Question Papers Archive...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="qp-container">
        <main className="qp-main-content">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Error: {error}</p>
            <button onClick={fetchPapers} className="premium-primary-btn">Retry</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="qp-container">
      <main className="qp-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Question Papers <i className="fas fa-file-pdf"></i></h2>
            <p>Access, upload and manage previous year academic papers</p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="premium-primary-btn"
          >
            <i className="fas fa-plus"></i> Upload Paper
          </button>
        </header>

        <div className="qp-action-bar">
          <div className="qp-stats">
            <div className="small-stat">
              <strong>{questionPapers.length}</strong> <span>Total</span>
            </div>
            <div className="small-stat">
              <strong>{questionPapers.filter(p => p.type === 'End-Term').length}</strong> <span>End-Term</span>
            </div>
          </div>
          <div className="qp-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search course or year..." />
          </div>
        </div>

        {/* Upload Form Modal/Expand */}
        {showUploadForm && (
          <div className="qp-upload-card fade-in">
            <div className="card-top">
              <h3><i className="fas fa-cloud-upload-alt"></i> Upload New Paper</h3>
              <button className="close-btn" onClick={() => setShowUploadForm(false)}>×</button>
            </div>
            <div className="qp-form-grid">
              <div className="form-group">
                <label>Select Course</label>
                <select
                  value={newPaper.course}
                  onChange={(e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    const targetYear = selectedOption.getAttribute('data-year');
                    setNewPaper({ ...newPaper, course: e.target.value, targetYear: targetYear });
                  }}
                >
                  <option value="">Choose Course</option>
                  {facultyAssignments.map((a, idx) => (
                    <option key={idx} value={a.subject} data-year={a.year}>{a.subject} - {a.year} Year</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Paper Category</label>
                <select
                  value={newPaper.type}
                  onChange={(e) => setNewPaper({ ...newPaper, type: e.target.value })}
                >
                  <option value="">Type</option>
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="End-Term">End-Term</option>
                  <option value="Model">Model Paper</option>
                </select>
              </div>
              <div className="form-group">
                <label>Module / Unit</label>
                <input
                  type="text"
                  placeholder="e.g. Module 1"
                  value={newPaper.module || ''}
                  onChange={(e) => setNewPaper({ ...newPaper, module: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Topic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={newPaper.topic || ''}
                  onChange={(e) => setNewPaper({ ...newPaper, topic: e.target.value })}
                />
              </div>
            </div>
            <div className="file-upload-zone">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                id="pdf-upload"
                hidden
                onChange={(e) => setNewPaper({ ...newPaper, file: e.target.files[0] })}
              />
              <label htmlFor="pdf-upload" className="file-label">
                <i className="fas fa-file-pdf"></i>
                <span>{newPaper.file ? newPaper.file.name : "Click to select PDF/Doc or drag & drop here"}</span>
              </label>
            </div>
            <div className="qp-form-actions">
              <button onClick={handleUpload} className="confirm-btn">Confirm Upload</button>
              <button onClick={() => setShowUploadForm(false)} className="discard-btn">Discard</button>
            </div>
          </div>
        )}

        {/* Papers Bento Grid */}
        <div className="papers-bento-grid">
          {questionPapers.map((paper, idx) => (
            <div key={paper._id} className="paper-premium-card" style={{ "--i": idx }}>
              <div className="paper-card-header">
                <div className="paper-type-badge" data-type={paper.type}>
                  {paper.type}
                </div>
                <div className="paper-actions-menu">
                  <button className="icon-action-btn danger" title="Delete" onClick={() => handleDelete(paper._id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              <div className="paper-card-content">
                <h3 className="course-title">{paper.course}</h3>
                <div className="paper-meta">
                  <span className="meta-item"><i className="fas fa-calendar-day"></i> {paper.year}</span>
                  <span className="meta-item"><i className="fas fa-layer-group"></i> {paper.semester}</span>
                  {paper.module && <span className="module-tag"><i className="fas fa-bookmark"></i> {paper.module}</span>}
                  {paper.topic && <span className="meta-item"><i className="fas fa-tag"></i> {paper.topic}</span>}
                </div>
              </div>
              <div className="paper-card-footer">
                <button className="paper-footer-btn preview" onClick={() => handlePreview(paper)}>
                  <i className="fas fa-eye"></i> View
                </button>
                <button className="paper-footer-btn download" onClick={() => handleDownload(paper)}>
                  <i className="fas fa-download"></i> Get
                </button>
                <button className="paper-footer-btn share" onClick={() => handleShare(paper)}>
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Browse by Year - Reimagined */}
        <section className="browse-year-section">
          <div className="section-head">
            <h3><i className="fas fa-history"></i> Browse Archive</h3>
            <p>Explore question papers from previous academic years</p>
          </div>
          <div className="year-button-grid">
            {['2024', '2023', '2022', '2021'].map(year => (
              <button key={year} className="year-archive-card">
                <span className="year-num">{year}</span>
                <span className="paper-count">{questionPapers.filter(p => p.year === year).length} Papers</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
