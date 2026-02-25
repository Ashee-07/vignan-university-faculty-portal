import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LeaveManagement.css';
import leaveService from '../../services/leaveService';

export default function LeaveManagement() {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [balance, setBalance] = useState({ sick: 0, casual: 0, vacation: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const facultyId = localStorage.getItem('facultyId') || 'FAC001';

  // Load initial data
  useEffect(() => {
    fetchData();
  }, [facultyId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [requests, leaveBalance] = await Promise.all([
        leaveService.getLeaveRequests(facultyId),
        leaveService.getLeaveBalance(facultyId)
      ]);
      setLeaveRequests(requests);
      setBalance(leaveBalance);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (newLeave.type && newLeave.startDate && newLeave.endDate && newLeave.reason) {
      try {
        const start = new Date(newLeave.startDate);
        const end = new Date(newLeave.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const created = await leaveService.applyLeave({
          ...newLeave,
          days,
          facultyId
        });

        setLeaveRequests([created, ...leaveRequests]);
        setNewLeave({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
        setShowApplyForm(false);
        alert('Leave application submitted successfully!');
      } catch (err) {
        alert('Application failed: ' + err.message);
      }
    } else {
      alert('Please fill in all fields (Type, Dates, Reason)');
    }
  };

  if (isLoading && leaveRequests.length === 0) {
    return (
      <div className="leave-container">
        <main className="leave-main-content">
          <div className="loading-state" style={{ textAlign: 'center', padding: '5rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#b8235a' }}></i>
            <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Syncing leave records...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="leave-container">
      <main className="leave-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Leave Management <i className="fas fa-calendar-check"></i></h2>
            <p>Apply for leaves, track approval status, and view your remaining balance</p>
          </div>
          <button
            onClick={() => setShowApplyForm(!showApplyForm)}
            className="premium-primary-btn"
          >
            <i className="fas fa-paper-plane"></i> Apply for Leave
          </button>
        </header>

        {/* Leave Balance Stats */}
        <div className="leave-stats-grid">
          <div className="leave-stat-card sick">
            <span className="label">Sick Leave Balance</span>
            <span className="value">{balance.sick} Days</span>
          </div>
          <div className="leave-stat-card casual">
            <span className="label">Casual Leave Balance</span>
            <span className="value">{balance.casual} Days</span>
          </div>
          <div className="leave-stat-card vacation">
            <span className="label">Vacation Balance</span>
            <span className="value">{balance.vacation} Days</span>
          </div>
        </div>

        {showApplyForm && (
          <div className="apply-form-premium fadeUp">
            <h3>New Leave Application</h3>
            <div className="form-grid-premium">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  className="form-select-premium"
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Emergency">Emergency Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  className="form-input-premium"
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  className="form-input-premium"
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Reason for Leave</label>
              <textarea
                className="form-textarea-premium"
                placeholder="Brief explanation for your absence..."
                rows="3"
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              />
            </div>
            <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button onClick={handleApply} className="premium-primary-btn">Submit Application</button>
              <button onClick={() => setShowApplyForm(false)} className="cancel-btn-premium" style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="leave-timeline">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Recent Applications</h3>
          {leaveRequests.map((leave, idx) => (
            <div key={leave.id} className="leave-request-card" style={{ '--i': idx }}>
              <div className="request-main-info">
                <div className={`leave-type-badge type-${leave.type.toLowerCase().split(' ')[0]}`}>
                  {leave.type}
                </div>
                <div className="date-range">
                  <span className="dates">{leave.startDate} to {leave.endDate}</span>
                  <span className="duration">{leave.days} Working Days</span>
                </div>
                <div className="reason-box">
                  {leave.reason}
                </div>
              </div>
              <div className={`status-badge-p status-${leave.status.toLowerCase()}`}>
                {leave.status}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}