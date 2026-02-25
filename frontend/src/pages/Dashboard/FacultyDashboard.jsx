import React, { useState, useEffect } from "react";
import "./FacultyDashboard.css";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../components/ChangePasswordModal";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const facultyName = localStorage.getItem("facultyName") || "Faculty Member";
  const facultyId = localStorage.getItem("facultyId");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Announcements rotation with images
  const announcements = [
    {
      id: 1,
      icon: "📢",
      text: "Mid-term examinations scheduled from Nov 15-20, 2025",
      type: "important",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop" // Exam/Study image
    },
    {
      id: 2,
      icon: "🎓",
      text: "Faculty training workshop on digital pedagogy - Nov 25th",
      type: "info",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop" // Workshop/Training image
    },
    {
      id: 3,
      icon: "📚",
      text: "New course materials available for Winter semester 2025",
      type: "update",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop" // Books/Learning image
    },
    {
      id: 4,
      icon: "⚠️",
      text: "Assignment submission deadline extended till Nov 30th",
      type: "alert",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop" // Deadline/Calendar image
    },
    {
      id: 5,
      icon: "🌟",
      text: "Congratulations! Information Technology ranked #1 in student feedback",
      type: "success",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop" // Success/Achievement image
    },
  ];

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) =>
        (prevIndex + 1) % announcements.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("facultyId");
    localStorage.removeItem("facultyName");
    navigate("/faculty-login");
  };

  return (
    <div className="faculty-dashboard-container">

      {/* Main Dashboard Content */}
      <main className="dashboard-main-content">
        <div className="intro-section">
          <h2>Faculty Dashboard 👋</h2>
          <p>
            Complete academic management system — Manage timetables, attendance, grades,
            assessments, course materials, and student progress all in one place.
          </p>
        </div>

        {/* Announcements Banner */}
        <div className="announcements-banner">
          <div className="announcement-wrapper">
            <div className="announcement-image-container">
              <img
                src={announcements[currentAnnouncementIndex].image}
                alt="Announcement"
                className="announcement-image"
              />
            </div>
            <div className="announcement-content">
              <span className="announcement-icon">
                <i className="fas fa-bullhorn"></i>
              </span>
              <span className="announcement-text">
                {announcements[currentAnnouncementIndex].text}
              </span>
            </div>
          </div>
          <div className="announcement-indicators">
            {announcements.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentAnnouncementIndex ? 'active' : ''}`}
                onClick={() => setCurrentAnnouncementIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Professional Metrics Bar */}
        <div className="metrics-bar">
          <div className="metric-card">
            <span className="metric-icon"><i className="fas fa-user-tie"></i></span>
            <div className="metric-info">
              <span className="metric-label">Designation</span>
              <span className="metric-value">Senior Assistant Professor</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon"><i className="fas fa-building"></i></span>
            <div className="metric-info">
              <span className="metric-label">Department</span>
              <span className="metric-value">Information Technology</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon"><i className="fas fa-microscope"></i></span>
            <div className="metric-info">
              <span className="metric-label">Research Area</span>
              <span className="metric-value">Machine Learning & AI</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon"><i className="fas fa-graduation-cap"></i></span>
            <div className="metric-info">
              <span className="metric-label">Experience</span>
              <span className="metric-value">8+ Years</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          {/* Left Column: Department & Faculty Bio */}
          <div className="content-left">
            <section className="dashboard-section card-style">
              <h3><i className="fas fa-university"></i> Vignan University Profile</h3>
              <div className="university-highlights">
                <div className="highlight-item">
                  <span className="h-icon"><i className="fas fa-award"></i></span>
                  <div className="h-text">
                    <strong>NAAC A+ Accredited</strong>
                    <p>Highest institutional excellence rating</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="h-icon"><i className="fas fa-medal"></i></span>
                  <div className="h-text">
                    <strong>NIRF Top 100</strong>
                    <p>Consistently ranked among India's elite Universities</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="h-icon"><i className="fas fa-atom"></i></span>
                  <div className="h-text">
                    <strong>Research Driven</strong>
                    <p>Dedicated to innovation and technical leadership</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-section card-style">
              <h3><i className="fas fa-users-cog"></i> Department Dashboard (IT)</h3>
              <div className="dept-stats">
                <div className="stat-box">
                  <span className="stat-num">45+</span>
                  <span className="stat-label">Faculty Members</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">1200+</span>
                  <span className="stat-label">Students Enrolled</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">15:1</span>
                  <span className="stat-label">Student-Teacher Ratio</span>
                </div>
              </div>
              <p className="dept-mission">
                Equipping future engineers with cutting-edge skills in software architecture,
                data science, and algorithmic problem solving.
              </p>
            </section>
          </div>

          {/* Right Column: Achievements & Portfolio */}
          <div className="content-right">
            <section className="dashboard-section achievements-section card-style">
              <h3><i className="fas fa-star"></i> Past Year Achievements</h3>
              <div className="achievements-timeline">
                <div className="achievement-event">
                  <div className="event-date">Oct 2025</div>
                  <div className="event-info">
                    <strong>Best Paper Award</strong>
                    <p>International Conference on Neural Networks (ICNN 2025)</p>
                  </div>
                </div>
                <div className="achievement-event">
                  <div className="event-date">Aug 2025</div>
                  <div className="event-info">
                    <strong>Grant Approval</strong>
                    <p>Research funding of ₹15L sanctioned for AI-driven Healthcare project</p>
                  </div>
                </div>
                <div className="achievement-event">
                  <div className="event-date">Mar 2025</div>
                  <div className="event-info">
                    <strong>Curriculum Innovation</strong>
                    <p>Spearheaded the integration of Cloud Computing in Semester VI syllabus</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-section research-portfolio card-style">
              <h3><i className="fas fa-book-reader"></i> My Research Portfolio</h3>
              <div className="portfolio-tags">
                <span className="tag">Deep Learning</span>
                <span className="tag">Cyber Security</span>
                <span className="tag">IoT Systems</span>
                <span className="tag">Edge Computing</span>
              </div>
              <div className="quick-actions-bar">
                <button className="minimal-btn" onClick={() => setIsPasswordModalOpen(true)}>
                  <i className="fas fa-key"></i> Change Password
                </button>
                <button className="minimal-btn"><i className="fas fa-plus"></i> Add Outcome</button>
                <button className="minimal-btn"><i className="fas fa-file-export"></i> Export Bio</button>
              </div>
            </section>
          </div>
        </div>

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          facultyId={facultyId}
        />
      </main>
    </div>
  );
}
