import React, { useState, useEffect } from "react";
import leaveService from "../../services/leaveService";
import "./AdminDashboard.css";

export default function ManageLeave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const data = await leaveService.getAllLeaveRequests();
            setLeaves(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await leaveService.updateLeaveStatus(id, status);
            setLeaves(leaves.map(l => l._id === id ? { ...l, status } : l));
            alert(`Leave ${status} successfully!`);
        } catch (err) {
            alert("Action failed");
        }
    };

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>Leave Approval Center</h2>
                    <p>Review and process leave applications from department faculty</p>
                </div>
            </header>

            <section className="table-container glass-card">
                {loading ? (
                    <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Fetching requests...</div>
                ) : (
                    <table className="premium-table">
                        <colgroup>
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '15%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Faculty</th>
                                <th>Leave Type</th>
                                <th>Duration</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(l => (
                                <tr key={l._id}>
                                    <td>
                                        <div className="faculty-name-cell">
                                            <strong>{l.facultyName}</strong>
                                            <span>Submitted: {l.submittedDate}</span>
                                        </div>
                                    </td>
                                    <td><span className={`leave-type-p ${l.type.split(' ')[0].toLowerCase()}`}>{l.type}</span></td>
                                    <td>{l.startDate} to {l.endDate} ({l.days} days)</td>
                                    <td className="reason-cell" title={l.reason}>{l.reason}</td>
                                    <td><span className={`status-badge-p ${l.status.toLowerCase()}`}>{l.status}</span></td>
                                    <td>
                                        {l.status === 'Pending' ? (
                                            <div className="action-btns">
                                                <button className="approve-btn" onClick={() => handleAction(l._id, 'Approved')}>Approve</button>
                                                <button className="reject-btn" onClick={() => handleAction(l._id, 'Rejected')}>Reject</button>
                                            </div>
                                        ) : (
                                            <span className="processed-text"><i className="fas fa-check-circle"></i> Handled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
