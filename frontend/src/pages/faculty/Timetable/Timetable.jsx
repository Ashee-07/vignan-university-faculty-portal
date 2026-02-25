import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import timetableService from '../../../services/timetableService';
import './Timetable.css';

export default function Timetable() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(true);
  const facultyName = localStorage.getItem("facultyName") || "Faculty Member";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allSlots = await timetableService.getTimetables();

      // Group by day for the tabbed UI
      const grouped = allSlots.reduce((acc, slot) => {
        if (!acc[slot.day]) acc[slot.day] = [];
        acc[slot.day].push({
          id: slot._id,
          time: slot.time,
          course: slot.subject,
          room: slot.room,
          type: slot.type,
          faculty: slot.faculty,
          year: slot.year
        });
        return acc;
      }, {});

      setTimetableData(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Lecture': return '#2196F3';
      case 'Practical': return '#4CAF50';
      case 'Tutorial': return '#FF9800';
      default: return '#607d8b';
    }
  };

  if (loading) return <div className="timetable-container" style={{ padding: '40px', color: 'white' }}>Loading Master Schedule...</div>;

  return (
    <div className="timetable-container">
      <main className="timetable-main-content">
        {/* Header */}
        <div className="timetable-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Master Timetable <i className="fas fa-calendar-alt"></i></h2>
            <p>Admin-verified university schedule for {facultyName}</p>
          </div>
          <div className="sync-status">
            <i className="fas fa-check-circle" style={{ color: '#4CAF50' }}></i> Synchronized with Dean Portal
          </div>
        </div>

        {/* Day Selector */}
        <div className="day-selector">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`day-btn ${selectedDay === day ? 'active' : ''}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable Display */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e293b', fontSize: '1.4rem', margin: 0 }}>
              {selectedDay}'s Classes
            </h2>
          </div>

          {timetableData[selectedDay] && timetableData[selectedDay].length > 0 ? (
            <div className="content-grid">
              {timetableData[selectedDay].map((slot) => (
                <div key={slot.id} className="content-card">
                  <div className="card-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{slot.time}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#4cc9f0', fontWeight: 'bold' }}>{slot.year} Year Class</span>
                    </div>
                    <span
                      className="badge"
                      style={{ backgroundColor: getTypeColor(slot.type) }}
                    >
                      {slot.type}
                    </span>
                  </div>

                  <div className="card-body">
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ color: '#b8235a', fontSize: '1.1rem' }}>
                        {slot.course}
                      </strong>
                    </div>
                    <div className="info-row" style={{ color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                      <span>📍 {slot.room}</span>
                      <span style={{ fontSize: '0.85rem' }}>👤 {slot.faculty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-calendar-times"></i>
              <p>No classes scheduled by Admin for {selectedDay}.</p>
            </div>
          )}
        </div>

        {/* Weekly Overview Table */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '1.4rem' }}>
            Weekly Master Overview
          </h2>
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Course</th>
                  <th>Room</th>
                  <th>Assigned Faculty</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  timetableData[day]?.map((slot, index) => (
                    <tr key={`${day}-${slot.id}`}>
                      {index === 0 && (
                        <td rowSpan={timetableData[day].length} style={{ fontWeight: 'bold', background: '#f8fafc', borderRight: '2px solid #e2e8f0' }}>
                          {day}
                        </td>
                      )}
                      <td>{slot.time}</td>
                      <td>{slot.course}</td>
                      <td>{slot.room}</td>
                      <td>{slot.faculty}</td>
                      <td>
                        <span style={{
                          color: 'white',
                          background: getTypeColor(slot.type),
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {slot.type}
                        </span>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
