import React, { useState, useEffect, useRef } from "react";
import studentService from "../../services/studentService";
import "./AdminDashboard.css";

export default function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterYear, setFilterYear] = useState("All");
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        rollNo: "",
        name: "",
        year: "3rd",
        department: "IT",
        section: "A",
        email: ""
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getStudents();

            // Sort by Reg No / Roll No
            data.sort((a, b) => {
                const idA = a.regNo || a.rollNo || "";
                const idB = b.regNo || b.rollNo || "";
                return idA.localeCompare(idB);
            });

            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = filterYear === "All"
        ? students
        : students.filter(s => s.year === filterYear);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const newStudent = await studentService.addStudent(form);
            setStudents([newStudent, ...students]);
            setShowForm(false);
            setForm({ rollNo: "", name: "", year: "3rd", department: "IT", section: "A", email: "" });
            alert("Student registered successfully!");
        } catch (err) {
            alert("Registration failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await studentService.deleteStudent(id);
                setStudents(students.filter(s => s._id !== id));
            } catch (err) {
                console.error(err);
                alert("Failed to delete student");
            }
        }
    };

    const handleCsvUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const headers = rows[0].split(',').map(h => h.trim().toLowerCase());

            const importedData = rows.slice(1).map(row => {
                const values = row.split(',').map(v => v.trim());
                return {
                    rollNo: values[headers.indexOf('rollno')] || values[0],
                    name: values[headers.indexOf('name')] || values[1],
                    year: values[headers.indexOf('year')] || values[2],
                    department: values[headers.indexOf('department')] || values[3],
                    section: values[headers.indexOf('section')] || values[4] || 'A',
                    email: values[headers.indexOf('email')] || values[5]
                };
            });

            try {
                const results = await studentService.bulkImport(importedData);
                setStudents([...results, ...students]);
                alert(`Successfully imported ${results.length} students!`);
            } catch (err) {
                alert("CSV Import failed. Ensure format is: rollno, name, year, department, email");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>Student Management</h2>
                    <p>Global student registry and academic records for the IT Department</p>
                </div>
                <div className="module-actions">
                    <input
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleCsvUpload}
                    />
                    <button className="secondary-btn" onClick={() => fileInputRef.current.click()}>
                        <i className="fas fa-file-import"></i> Import Bulk (CSV)
                    </button>
                    <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-user-plus'}`}></i>
                        {showForm ? 'Cancel' : 'Add New Student'}
                    </button>
                </div>
            </header>

            <div className="filter-tabs glass-card" style={{ display: 'flex', gap: '10px', padding: '10px', marginBottom: '20px' }}>
                {["All", "1st", "2nd", "3rd", "4th"].map(year => (
                    <button
                        key={year}
                        className={`filter-btn ${filterYear === year ? 'active' : ''}`}
                        onClick={() => setFilterYear(year)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: filterYear === year ? '#4cc9f0' : 'rgba(255,255,255,0.05)',
                            color: filterYear === year ? '#030712' : '#94a3b8',
                            cursor: 'pointer',
                            fontWeight: '700',
                            transition: 'all 0.3s'
                        }}
                    >
                        {year === "All" ? "All Years" : `${year} Year`}
                    </button>
                ))}
            </div>

            {showForm && (
                <section className="form-card glass-card animate-slide-down" style={{ marginBottom: '2rem' }}>
                    <h3><i className="fas fa-id-card"></i> Student Enrollment Form</h3>
                    <form className="module-form" onSubmit={handleRegister}>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Roll Number</label>
                                <input
                                    placeholder="e.g. 221FA07001"
                                    value={form.rollNo}
                                    onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    placeholder="Enter student name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Year of Study</label>
                                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                                    <option>1st</option>
                                    <option>2nd</option>
                                    <option>3rd</option>
                                    <option>4th</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Department</label>
                                <input value={form.department} readOnly disabled />
                            </div>
                            <div className="input-group">
                                <label>Section</label>
                                <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                    <option>D</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="s1@vignan.ac.in"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">Complete Enrollment</button>
                    </form>
                </section>
            )}

            <section className="table-container glass-card">
                <table className="premium-table">
                    <colgroup>
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Year</th>
                            <th>Section</th>
                            <th>Department</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(s => (
                            <tr key={s._id}>
                                <td className="bold-text">{s.regNo || s.rollNo}</td>
                                <td>{s.name}</td>
                                <td>{s.year}</td>
                                <td>{s.section || 'A'}</td>
                                <td><span className="dept-badge">{s.department}</span></td>
                                <td>{s.email}</td>
                                <td><span className="status-badge active">Enrolled</span></td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(s._id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
