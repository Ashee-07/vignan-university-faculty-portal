import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseMaterials.css';
import courseMaterialService from '../../services/courseMaterialService';
import API from '../../lib/api';;

export default function CourseMaterials() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    year: '',
    department: '',
    type: 'PDF',
    description: '',
    file: null
  });
  const [facultySubjects, setFacultySubjects] = useState([]);

  // Load materials on mount
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const facultyId = localStorage.getItem('facultyId');
      const data = await courseMaterialService.getMaterials({ facultyId });
      setMaterials(data);

      // Fetch faculty subjects for dropdown
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

  const handleUpload = async () => {
    if (newMaterial.title && newMaterial.subject && newMaterial.type && newMaterial.file) {
      try {
        const payload = {
          ...newMaterial,
          facultyId: localStorage.getItem('facultyId'),
          facultyName: localStorage.getItem('facultyName'),
        };
        const created = await courseMaterialService.uploadMaterial(payload);
        setMaterials([created, ...materials]);
        setNewMaterial({ title: '', subject: '', year: '', department: '', type: 'PDF', description: '', file: null });
        setShowUploadForm(false);
        alert('Material uploaded successfully!');
      } catch (err) {
        console.error('Upload error details:', err);
        const errorMsg = err.response?.data?.message || err.message;
        alert('Upload failed: ' + errorMsg);
      }
    } else {
      alert('Please fill in all required fields (Title, Subject, Type, and File)');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await courseMaterialService.deleteMaterial(id);
        setMaterials(prev => prev.filter(m => m._id !== id));
        alert('Material deleted successfully!');
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <i className="fas fa-file-pdf"></i>;
      case 'ppt': return <i className="fas fa-file-powerpoint"></i>;
      case 'doc': return <i className="fas fa-file-word"></i>;
      case 'video': return <i className="fas fa-file-video"></i>;
      default: return <i className="fas fa-file"></i>;
    }
  };

  const filteredMaterials = (materials || []).filter(m =>
    (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: materials.length,
    downloads: materials.reduce((sum, m) => sum + (m.downloads || 0), 0),
    avg: materials.length > 0 ? (materials.reduce((sum, m) => sum + (m.downloads || 0), 0) / materials.length).toFixed(1) : 0
  };

  if (isLoading && materials.length === 0) {
    return (
      <div className="materials-container">
        <main className="materials-main-content">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Accessing library...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="materials-container">
      <main className="materials-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Course Materials <i className="fas fa-book-reader"></i></h2>
            <p>Upload and manage lecture notes, presentations, and resources</p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="premium-primary-btn"
          >
            <i className="fas fa-cloud-upload-alt"></i> Upload Material
          </button>
        </header>

        {/* Stats Section */}
        <div className="materials-stats-bar">
          <div className="stat-card">
            <div className="stat-icon blue"><i className="fas fa-folder-open"></i></div>
            <div className="stat-details">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Resources</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><i className="fas fa-download"></i></div>
            <div className="stat-details">
              <span className="stat-value">{stats.downloads}</span>
              <span className="stat-label">Total Downloads</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><i className="fas fa-chart-line"></i></div>
            <div className="stat-details">
              <span className="stat-value">{stats.avg}</span>
              <span className="stat-label">Avg Downloads/File</span>
            </div>
          </div>
        </div>

        <div className="materials-action-bar">
          <div className="materials-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by title or course code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showUploadForm && (
          <div className="upload-form-premium fadeUp">
            <h3>Upload New Resource</h3>
            <div className="form-grid-premium">
              <div className="form-group">
                <label>Material Title</label>
                <input
                  className="form-input-premium"
                  type="text"
                  placeholder="e.g. Unit 1 - Introduction to SQL"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Select Course (Assigned Only)</label>
                <select
                  className="form-select-premium"
                  value={newMaterial.subject}
                  onChange={(e) => {
                    const selected = facultySubjects.find(s => s.subject === e.target.value);
                    if (selected) {
                      setNewMaterial({
                        ...newMaterial,
                        subject: selected.subject,
                        year: selected.year,
                        department: localStorage.getItem('facultyDepartment') || ''
                      });
                    } else {
                      setNewMaterial({ ...newMaterial, subject: e.target.value });
                    }
                  }}
                >
                  <option value="">Choose Course</option>
                  {facultySubjects.map((sub, idx) => (
                    <option key={idx} value={sub.subject}>{sub.subject} - {sub.year} Year</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>File Type</label>
                <select
                  className="form-select-premium"
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                >
                  <option value="PDF">PDF Document</option>
                  <option value="PPT">Presentation (PPT)</option>
                  <option value="DOC">Word Document</option>
                  <option value="VIDEO">Video Lecture</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>
              <div className="form-group">
                <label>Resource File</label>
                <input
                  type="file"
                  id="material-file-upload"
                  hidden
                  onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
                />
                <label htmlFor="material-file-upload" className="file-label-premium">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{newMaterial.file ? newMaterial.file.name : "Choose File (PDF, PPT, Doc...)"}</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Description (Optional) - Targeted at {newMaterial.year} Year students</label>
              <textarea
                className="form-input-premium"
                rows="3"
                placeholder="Brief summary of the content..."
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
              />
            </div>
            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button onClick={handleUpload} className="premium-primary-btn">Complete Upload</button>
              <button onClick={() => setShowUploadForm(false)} className="cancel-btn-premium">Cancel</button>
            </div>
          </div>
        )}

        <div className="materials-bento-grid">
          {filteredMaterials.map((material, idx) => (
            <div key={material._id} className="material-premium-card" style={{ '--i': idx }}>
              <div className="material-icon-header">
                <div className={`type-icon-box type-${material.type.toLowerCase()}`}>
                  {getFileIcon(material.type)}
                </div>
                <span className="course-tag">{material.subject}</span>
                <span className="year-badge" style={{ fontSize: '0.7rem', opacity: 0.8 }}>{material.year} Year</span>
              </div>
              <div className="material-info">
                <h3>{material.title}</h3>
                <div className="material-stats">
                  <span><i className="fas fa-calendar-day"></i> {new Date(material.createdAt).toLocaleDateString()}</span>
                  <span><i className="fas fa-eye"></i> {material.downloads || 0} views</span>
                </div>
              </div>
              <div className="material-actions">
                <a href={material.url.startsWith('http') ? material.url : `http://localhost:5000${material.url}`} target="_blank" rel="noopener noreferrer" className="action-btn-p" style={{ textDecoration: 'none' }}>
                  <i className="fas fa-download"></i> Get
                </a>
                <button className="action-btn-p danger" onClick={() => handleDelete(material._id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}