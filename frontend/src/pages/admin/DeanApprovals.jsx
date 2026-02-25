import React, { useState } from "react";
import "./AdminDashboard.css";

export default function DeanApprovals() {
  const [approvals, setApprovals] = useState([
    { id: 1, type: "Policy Change", title: "New Attendance Threshold (80%)", requestedBy: "IT Dept Head", date: "2025-11-06", status: "Pending" },
    { id: 2, type: "Faculty Hire", title: "Dr. Elena Gilbert - Asst. Prof", requestedBy: "HR IT", date: "2025-11-05", status: "Pending" },
    { id: 3, type: "Curriculum update", title: "V25 Syllabus Integration", requestedBy: "Board of Studies", date: "2025-11-04", status: "Approved" }
  ]);

  return (
    <div className="admin-module-page">
      <header className="module-header">
        <div className="module-title">
          <h2>Dean's Approval Queue</h2>
          <p>High-level administrative oversight and policy authorization</p>
        </div>
      </header>

      <section className="table-container glass-card">
        <table className="premium-table">
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Request Type</th>
              <th>Description</th>
              <th>Originating Dept</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map(app => (
              <tr key={app.id}>
                <td><span className="request-type-badge">{app.type}</span></td>
                <td className="bold-text">{app.title}</td>
                <td>{app.requestedBy}</td>
                <td>{app.date}</td>
                <td><span className={`status-badge-p ${app.status.toLowerCase()}`}>{app.status}</span></td>
                <td>
                  {app.status === "Pending" ? (
                    <div className="action-btns">
                      <button className="approve-btn">Authorize</button>
                      <button className="reject-btn">Decline</button>
                    </div>
                  ) : (
                    <span className="processed-text"><i className="fas fa-shield-check"></i> Policy Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
