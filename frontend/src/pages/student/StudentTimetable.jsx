import React, { useState, useEffect } from "react";
import "./StudentTimetable.css";
import timetableService from "../../services/timetableService";
import studentService from "../../services/studentService";

export default function StudentTimetable() {
    const [studentYear, setStudentYear] = useState("");
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(true);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() - 1] || "Monday");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const registerId = localStorage.getItem("registerId");
                if (!registerId) throw new Error("Student ID missing. Please login again.");

                const profile = await studentService.getStudentByRegNo(registerId);
                const year = profile.year || "3rd";
                setStudentYear(year);

                // Fetch timetable using the year from profile
                await fetchTimetable(year);
            } catch (err) {
                console.error("Failed to load initial data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const fetchTimetable = async (year) => {
        try {
            // Fetch all timetables (using true for all) and filter here for student's year
            const allSlots = await timetableService.getTimetables(true);
            const mySlots = allSlots.filter(s => s.year === year);


            // Group by day
            const grouped = mySlots.reduce((acc, slot) => {
                if (!acc[slot.day]) acc[slot.day] = [];
                acc[slot.day].push({
                    time: slot.time,
                    subject: slot.subject,
                    room: slot.room,
                    faculty: slot.faculty
                });
                return acc;
            }, {});

            setTimetable({
                year: studentYear,
                schedule: grouped
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currentDaySchedule = timetable?.schedule?.[selectedDay] || [];

    return (
        <div className="student-timetable-container">
            <header className="timetable-header">
                <div className="header-info">
                    <h2>Academic Timetable <span className="year-badge">{studentYear} Year</span></h2>
                    <p>Your personalized class schedule managed by the University Admin</p>
                </div>
            </header>

            <div className="day-selector-card glass-card">
                {days.map(day => (
                    <button
                        key={day}
                        className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day.substring(0, 3)}
                    </button>
                ))}
            </div>

            <div className="schedule-content">
                {currentDaySchedule.length > 0 ? (
                    <div className="timetable-grid">
                        {currentDaySchedule.map((item, idx) => (
                            <div key={idx} className="timetable-card">
                                <div className="time-strip">{item.time}</div>
                                <div className="subject-info">
                                    <h3>{item.subject}</h3>
                                    <p className="faculty-name"><i className="fas fa-user-tie"></i> {item.faculty}</p>
                                    <div className="room-tag"><i className="fas fa-map-marker-alt"></i> {item.room}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-timetable">
                        <i className="fas fa-calendar-day"></i>
                        <p>No classes scheduled for {selectedDay}</p>
                    </div>
                )}
            </div>

            <div className="timetable-footer">
                <p><i className="fas fa-info-circle"></i> This timetable is read-only. Contact Admin for any discrepancies.</p>
            </div>
        </div>
    );
}
