import React, { useState, useEffect } from 'react';
import API from "../../lib/api";
import studentService from "../../services/studentService";
import './FacultyFeedback.css';

export default function FacultyFeedback() {
    const [studentProfile, setStudentProfile] = useState(null);
    const [studentYear, setStudentYear] = useState("");
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const registerId = localStorage.getItem("registerId");
                if (!registerId) return;

                const profile = await studentService.getStudentByRegNo(registerId);
                setStudentProfile(profile);
                const year = profile.year || "3rd";
                setStudentYear(year);

                await fetchFaculty(year);
            } catch (err) {
                console.error("Failed to load student profile for feedback", err);
            }
        };
        loadInitialData();
    }, []);

    const fetchFaculty = async (year) => {
        try {
            const res = await API.get("/faculty");
            // Filter faculty based on some logic (mock: only those assigned to student's year)
            // In a real app, this mapping would come from the backend.
            const yearSpecificFaculty = res.data.filter(f => {
                // Mock assignment: FAC001 for 1st, FAC002 for 2nd, etc.
                if (year === "1st") return f.facultyId === "FAC001";
                if (year === "2nd") return f.facultyId === "FAC002";
                if (year === "3rd") return f.facultyId === "FAC003" || f.facultyId === "FAC004";
                return true;
            });
            setFaculties(yearSpecificFaculty);
        } catch (err) {
            // Mock filtered data if backend fails
            const mockAll = [
                { _id: '1', facultyId: 'FAC001', name: 'Dr. John Smith', department: 'IT', year: '1st' },
                { _id: '2', facultyId: 'FAC002', name: 'Prof. Sarah Jane', department: 'IT', year: '2nd' },
                { _id: '3', facultyId: 'FAC003', name: 'Dr. R.V. Prasad', department: 'IT', year: '3rd' },
                { _id: '4', facultyId: 'FAC004', name: 'Ms. Kavya S.', department: 'IT', year: '3rd' },
                { _id: '5', facultyId: 'FAC005', name: 'Dr. Srinivas', department: 'IT', year: '4th' },
            ];
            setFaculties(mockAll.filter(f => f.year === year));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFaculty) {
            setMessage("Please select a faculty member first.");
            return;
        }

        try {
            setSubmitting(true);
            // Mock API call for feedback
            setTimeout(() => {
                setMessage("Feedback submitted successfully! Thank you for your review. ✅");
                setSubmitting(false);
                setComment("");
                setSelectedFaculty(null);
                setRating(5);
            }, 1000);
        } catch (err) {
            setMessage("Submission failed. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="feedback-container">
            <header className="feedback-header">
                <h2>Faculty Feedback <span className="year-badge">{studentYear} Year</span></h2>
                <p>Provide feedback for faculty members assigned to your year classes.</p>
            </header>

            <div className="feedback-content">
                <section className="faculty-selector-card">
                    <h3>Select Faculty Member</h3>
                    <div className="faculty-list">
                        {faculties.map(f => (
                            <div
                                key={f._id}
                                className={`faculty-item ${selectedFaculty?._id === f._id ? 'selected' : ''}`}
                                onClick={() => setSelectedFaculty(f)}
                            >
                                <div className="faculty-avatar">
                                    <i className="fas fa-user-tie"></i>
                                </div>
                                <div className="faculty-details">
                                    <h4>{f.name}</h4>
                                    <span>{f.facultyId} • {f.department}</span>
                                </div>
                                {selectedFaculty?._id === f._id && <i className="fas fa-check-circle check-icon"></i>}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="feedback-form-card">
                    {selectedFaculty ? (
                        <form onSubmit={handleSubmit}>
                            <h3>Submit Review for {selectedFaculty.name}</h3>

                            <div className="rating-selector">
                                <label>How would you rate their teaching?</label>
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <i
                                            key={star}
                                            className={`${star <= rating ? 'fas' : 'far'} fa-star`}
                                            onClick={() => setRating(star)}
                                        ></i>
                                    ))}
                                    <span className="rating-text">({rating}/5)</span>
                                </div>
                            </div>

                            <div className="comment-box">
                                <label>Your Comments</label>
                                <textarea
                                    placeholder="Share your experience with this faculty member..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="5"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-feedback-btn" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-arrow-left"></i>
                            <p>Please click on a faculty member to provide feedback.</p>
                        </div>
                    )}
                    {message && <div className={`feedback-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}
                </section>
            </div>
        </div>
    );
}
