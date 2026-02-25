import React, { useState, useEffect } from "react";
import API from "../../lib/api";
import "./AdminDashboard.css"; // Reuse general styles for now
import { AVAILABLE_SUBJECTS, AVAILABLE_YEARS } from "../../services/facultyService";
import usePageTitle from "../../hooks/usePageTitle";

export default function ManageFaculty() {
    usePageTitle("Manage Faculty");
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [managingAssignments, setManagingAssignments] = useState(null); // Faculty being assigned subjects

    const [form, setForm] = useState({
        facultyId: "",
        name: "",
        department: "IT",
        email: "",
        password: "Vignan@" + Math.floor(1000 + Math.random() * 9000), // Auto-suggest a default
        assignedSubjects: []
    });

    const [assignmentForm, setAssignmentForm] = useState({
        subject: AVAILABLE_SUBJECTS[0],
        year: AVAILABLE_YEARS[0]
    });

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const res = await API.get("/faculty");

            // Sort by Faculty ID
            const sortedFaculty = res.data.sort((a, b) => {
                return (a.facultyId || "").localeCompare(b.facultyId || "");
            });

            setFaculties(sortedFaculty);
        } catch (err) {
            console.error("Failed to fetch faculty", err);
            // If backend is not running, keep list empty or show error
            // setFaculties([]); 
            alert("Error fetching faculty. Is the backend running on port 5000?");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!form.facultyId || !form.name || !form.department || !form.email) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            // Call Backend API
            const res = await API.post("/faculty", form);

            alert("Faculty Registered Successfully");
            setFaculties([...faculties, res.data]);

            setForm({ facultyId: "", name: "", department: "IT", email: "", assignedSubjects: [] });
            setShowForm(false);
        } catch (err) {
            alert("Registration failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleAddAssignment = async () => {
        if (!managingAssignments) return;

        const alreadyExists = managingAssignments.assignedSubjects?.some(
            a => a.subject === assignmentForm.subject && a.year === assignmentForm.year
        );

        if (alreadyExists) {
            alert("This subject and year is already assigned to this faculty.");
            return;
        }

        const updatedAssignments = [
            ...(managingAssignments.assignedSubjects || []),
            { ...assignmentForm }
        ];

        try {
            setLoading(true);
            const res = await API.put(`/faculty/${managingAssignments._id}`, {
                assignedSubjects: updatedAssignments
            });

            // Update local state
            setFaculties(faculties.map(f => f._id === res.data._id ? res.data : f));
            setManagingAssignments(res.data);
            alert("Assignment added successfully");
        } catch (err) {
            alert("Failed to update assignments");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAssignment = async (index) => {
        if (!managingAssignments) return;

        const updatedAssignments = [...(managingAssignments.assignedSubjects || [])];
        updatedAssignments.splice(index, 1);

        try {
            setLoading(true);
            const res = await API.put(`/faculty/${managingAssignments._id}`, {
                assignedSubjects: updatedAssignments
            });

            // Update local state
            setFaculties(faculties.map(f => f._id === res.data._id ? res.data : f));
            setManagingAssignments(res.data);
            alert("Assignment removed successfully");
        } catch (err) {
            alert("Failed to update assignments");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this faculty member?")) {
            try {
                setLoading(true);
                await API.delete(`/faculty/${id}`);
                setFaculties(faculties.filter(f => f._id !== id));
                alert("Faculty deleted successfully");
            } catch (err) {
                alert("Delete failed");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>Faculty Management</h2>
                    <p>Register and manage faculty accounts for Information Technology</p>
                </div>
                <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
                    <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} `}></i>
                    {showForm ? 'Cancel' : 'Register New Faculty'}
                </button>
            </header>

            {showForm && (
                <section className="form-card glass-card animate-slide-down">
                    <h3><i className="fas fa-user-plus"></i> New Faculty Registration</h3>
                    <form className="module-form" onSubmit={handleRegister}>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Faculty ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. FAC001"
                                    value={form.facultyId}
                                    onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Department</label>
                                <input value={form.department} readOnly disabled />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="email@vignan.ac.in"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Initial Password (Temporary)</label>
                                <input
                                    type="text"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <small style={{ color: '#4cc9f0', fontSize: '0.7rem' }}>Faculty MUST change this on first login</small>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Processing..." : "Complete Registration"}
                        </button>
                    </form>
                </section>
            )}

            {/* Assignment Management Modal */}
            {managingAssignments && (
                <div className="modal-overlay">
                    <div className="glass-card modal-content animate-slide-down">
                        <button
                            className="modal-close-btn"
                            onClick={() => setManagingAssignments(null)}
                        >
                            <i className="fas fa-times"></i>
                        </button>

                        <h3 className="modal-title-premium">
                            <i className="fas fa-book-reader"></i> Assign Subjects
                        </h3>

                        <p className="modal-subtitle">
                            Manage teaching assignments for <strong>{managingAssignments.name}</strong> ({managingAssignments.facultyId})
                        </p>

                        <div className="assignment-form-container">
                            <h4>Add New Assignment</h4>
                            <div className="assignment-input-grid">
                                <div className="input-group">
                                    <label>Subject</label>
                                    <select
                                        value={assignmentForm.subject}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                                    >
                                        {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Year</label>
                                    <select
                                        value={assignmentForm.year}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, year: e.target.value })}
                                    >
                                        {AVAILABLE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <button className="primary-btn" onClick={handleAddAssignment}>
                                    <i className="fas fa-plus"></i> Add
                                </button>
                            </div>
                        </div>

                        <div className="current-assignments-header">
                            <i className="fas fa-list-ul"></i>
                            <h4>Current Assignments</h4>
                        </div>

                        <div className="assignments-pills-container">
                            {managingAssignments.assignedSubjects && managingAssignments.assignedSubjects.length > 0 ? (
                                managingAssignments.assignedSubjects.map((assign, idx) => (
                                    <div key={idx} className="assignment-chip">
                                        <span className="chip-subject">{assign.subject}</span>
                                        <span className="chip-year">{assign.year}</span>
                                        <button
                                            className="chip-remove"
                                            onClick={() => handleRemoveAssignment(idx)}
                                            title="Remove Assignment"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#94a3b8', fontStyle: 'italic', padding: '10px' }}>No subjects assigned yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <section className="table-container glass-card">
                <table className="premium-table">
                    <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '12%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Faculty ID</th>
                            <th>Name</th>
                            <th>Dept</th>
                            <th>Email</th>
                            <th>Initial Pass</th>
                            <th>Assignments</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.map((f) => (
                            <tr key={f._id}>
                                <td className="bold-text">{f.facultyId}</td>
                                <td>{f.name}</td>
                                <td><span className="dept-badge">{f.department}</span></td>
                                <td>{f.email}</td>
                                <td><code style={{ background: 'rgba(76, 201, 240, 0.1)', padding: '4px 8px', borderRadius: '4px', color: '#4cc9f0' }}>{f.password || '••••••••'}</code></td>
                                <td>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {f.assignedSubjects?.map((a, i) => (
                                            <span key={i} title={`${a.subject} (${a.year})`} style={{
                                                width: '10px', height: '10px', borderRadius: '50%',
                                                display: 'inline-block', background: '#4cc9f0'
                                            }}></span>
                                        ))}
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '4px' }}>
                                            {f.assignedSubjects?.length || 0} subjects
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="icon-btn edit" title="Manage Assignments" onClick={() => setManagingAssignments(f)}>
                                            <i className="fas fa-book"></i>
                                        </button>
                                        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(f._id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
