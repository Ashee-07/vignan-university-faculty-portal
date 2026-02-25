import React, { useState, useEffect } from "react";
import timetableService from "../../services/timetableService";
import facultyService, { AVAILABLE_SUBJECTS } from "../../services/facultyService";
import "./AdminDashboard.css";

export default function ManageTimetable() {
    const [timetables, setTimetables] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedYear, setSelectedYear] = useState("1st");
    const [form, setForm] = useState({
        day: "Monday",
        time: "",
        subject: "",
        faculty: "",
        room: "",
        type: "Lecture",
        year: "1st",
        section: "N/A"
    });

    useEffect(() => {
        fetchTimetable();
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        const data = await facultyService.getFaculty();
        setFacultyList(data);
    };

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const data = await timetableService.getTimetables(true); // Pass true for Admin mode
            setTimetables(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTimetables = timetables.filter(t => t.year === selectedYear);

    const handleAddSlot = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const updated = await timetableService.updateSlot(form._id, form);
                setTimetables(timetables.map(t => t._id === form._id ? updated : t));
                alert("Slot updated successfully!");
            } else {
                const newSlot = await timetableService.addSlot(form);
                setTimetables([...timetables, newSlot]);
                alert("New slot added successfully!");
            }
            setShowForm(false);
            setIsEditing(false);
            setForm({ day: "Monday", time: "", subject: "", faculty: "", room: "", type: "Lecture", year: selectedYear, section: "N/A" });
        } catch (err) {
            alert("Failed to save timetable slot");
        }
    };

    const handleEdit = (slot) => {
        setForm(slot);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this slot?")) {
            try {
                await timetableService.deleteSlot(id);
                setTimetables(timetables.filter(t => t._id !== id));
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="admin-module-page">
            <header className="module-header">
                <div className="module-title">
                    <h2>University Timetable</h2>
                    <p>Master scheduling system — Controls what faculty and students see</p>
                </div>
                <div className="module-actions" style={{ display: 'flex', gap: '15px' }}>
                    <div className="year-selector-tabs" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
                        {["1st", "2nd", "3rd", "4th"].map(y => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(y)}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    borderRadius: '10px',
                                    background: selectedYear === y ? '#4cc9f0' : 'transparent',
                                    color: selectedYear === y ? '#030712' : 'rgba(255, 255, 255, 0.7)',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    transition: 'all 0.3s',
                                    outline: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedYear !== y) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.color = '#fff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedYear !== y) {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                                    }
                                }}
                            >
                                {y} Year
                            </button>
                        ))}
                    </div>
                    <button className="primary-btn" onClick={() => {
                        setShowForm(!showForm);
                        setIsEditing(false);
                        if (!showForm) setForm({ day: "Monday", time: "", subject: "", faculty: "", room: "", type: "Lecture", year: selectedYear, section: "N/A" });
                    }}>
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-calendar-plus'}`}></i>
                        {showForm ? 'Cancel' : 'Add New Slot'}
                    </button>
                </div>
            </header>

            {showForm && (
                <section className="form-card glass-card animate-slide-down" style={{ marginBottom: '2rem' }}>
                    <h3><i className="fas fa-clock"></i> {isEditing ? 'Edit Existing Slot' : 'Assign New Class Slot'}</h3>
                    <form className="module-form" onSubmit={handleAddSlot}>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Day of Week</label>
                                <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Time Duration (HH:MM - HH:MM)</label>
                                <input placeholder="e.g. 09:00 - 10:00" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Subject / Course</label>
                                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                                    <option value="">Select Subject</option>
                                    {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Assigned Faculty</label>
                                <select value={form.faculty} onChange={(e) => {
                                    const fac = facultyList.find(f => f.name === e.target.value);
                                    setForm({ ...form, faculty: e.target.value, facultyId: fac?.facultyId });
                                }}>
                                    <option value="">Select Faculty</option>
                                    {facultyList.map(f => <option key={f._id} value={f.name}>{f.name} ({f.facultyId})</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Room / Lab</label>
                                <input placeholder="e.g. LT-101" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Target Year</label>
                                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                                    {['1st', '2nd', '3rd', '4th'].map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Type</label>
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                    <option>Lecture</option>
                                    <option>Practical</option>
                                    <option>Tutorial</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">{isEditing ? 'Save Changes' : 'Publish to Faculty Portal'}</button>
                    </form>
                </section>
            )}



            {/* Weekly Master Overview (similar to Faculty view but for Admin) */}
            <section className="table-container glass-card" style={{ marginTop: '50px', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.4rem', margin: 0 }}>
                        <i className="fas fa-th-list" style={{ marginRight: '10px', color: '#4cc9f0' }}></i>
                        {selectedYear} Year Weekly Master Overview
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>* Detailed view of all scheduled classes</span>
                </div>

                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Time Slot</th>
                                <th>Subject</th>
                                <th>Assigned Faculty</th>
                                <th>Room</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                                const daySlots = filteredTimetables
                                    .filter(t => t.day === day)
                                    .sort((a, b) => a.time.localeCompare(b.time));

                                if (daySlots.length === 0) return null;

                                return daySlots.map((slot, index) => (
                                    <tr key={slot._id || `${day}-${index}`}>
                                        {index === 0 && (
                                            <td
                                                rowSpan={daySlots.length}
                                                className="bold-text"
                                                style={{
                                                    background: 'rgba(76, 201, 240, 0.05)',
                                                    borderRight: '1px solid rgba(255,255,255,0.1)',
                                                    color: '#4cc9f0'
                                                }}
                                            >
                                                {day}
                                            </td>
                                        )}
                                        <td>{slot.time}</td>
                                        <td className="bold-text">{slot.subject}</td>
                                        <td>{slot.faculty}</td>
                                        <td><span className="room-badge">{slot.room}</span></td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: slot.type === 'Practical' ? 'rgba(76, 175, 80, 0.2)' :
                                                    slot.type === 'Tutorial' ? 'rgba(255, 152, 0, 0.2)' :
                                                        'rgba(33, 150, 243, 0.2)',
                                                color: slot.type === 'Practical' ? '#81c784' :
                                                    slot.type === 'Tutorial' ? '#ffb74d' :
                                                        '#64b5f6'
                                            }}>
                                                {slot.type}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="icon-btn edit" onClick={() => handleEdit(slot)} title="Edit"><i className="fas fa-pen"></i></button>
                                                <button className="icon-btn delete" onClick={() => handleDelete(slot._id)} title="Delete" style={{ color: '#ff4d4d' }}><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
