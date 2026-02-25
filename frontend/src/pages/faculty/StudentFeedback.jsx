import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentFeedback.css';
import feedbackService from '../../services/feedbackService';

export default function StudentFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load feedback on mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await feedbackService.getFeedbackSummaries();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<i key={i} className="fas fa-star"></i>);
      else if (i === fullStars && rating % 1 >= 0.5) stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      else stars.push(<i key={i} className="far fa-star"></i>);
    }
    return stars;
  };

  const stats = {
    totalCourses: feedbacks.length,
    avgOverall: feedbacks.length > 0 ? (feedbacks.reduce((a, b) => a + b.avgRating, 0) / feedbacks.length).toFixed(1) : 0,
    totalResponses: feedbacks.reduce((a, b) => a + (b.responses || 0), 0)
  };

  if (isLoading && feedbacks.length === 0) {
    return (
      <div className="feedback-container">
        <main className="feedback-main-content">
          <div className="loading-state" style={{ textAlign: 'center', padding: '5rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#b8235a' }}></i>
            <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Loading student insights...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <main className="feedback-main-content">
        <header className="page-header">
          <div className="header-info">
            <h2>Student Feedback <i className="fas fa-comments"></i></h2>
            <p>Analyze course evaluations, student sentiment, and teaching performance</p>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="feedback-stats-bar">
          <div className="feedback-stat-card">
            <span className="label">Evaluated Courses</span>
            <span className="value">{stats.totalCourses}</span>
          </div>
          <div className="feedback-stat-card">
            <span className="label">Overall Avg. Rating</span>
            <span className="value">{stats.avgOverall} <span>⭐</span></span>
          </div>
          <div className="feedback-stat-card">
            <span className="label">Total Responses</span>
            <span className="value">{stats.totalResponses}</span>
          </div>
        </div>

        <div className="feedback-bento-grid">
          {feedbacks.map((feedback, idx) => (
            <div key={feedback.id} className="feedback-premium-card" style={{ '--i': idx }}>
              <div className="feedback-card-header">
                <h3>{feedback.course}</h3>
                <span className={`sentiment-badge sentiment-${feedback.sentiment?.toLowerCase().split(' ')[0] || 'neutral'}`}>
                  {feedback.sentiment || 'Steady'}
                </span>
              </div>
              <div className="rating-display">
                <div className="big-rating">{feedback.avgRating}</div>
                <div className="rating-stars">
                  {getRatingStars(feedback.avgRating)}
                </div>
                <div className="response-count">
                  {feedback.responses} verified responses
                </div>
              </div>
              <div className="feedback-card-footer">
                <button className="btn-feedback-p"><i className="fas fa-list-alt"></i> Details</button>
                <button className="btn-feedback-p"><i className="fas fa-file-download"></i> Report</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
