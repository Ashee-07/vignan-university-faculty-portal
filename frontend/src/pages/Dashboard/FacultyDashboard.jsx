import React, { useState, useEffect } from "react";
import "./FacultyDashboard.css";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import announcementService from "../../services/announcementService";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const facultyName = localStorage.getItem("facultyName") || "Faculty Member";
  const facultyId = localStorage.getItem("facultyId");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [realAnnouncements, setRealAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const defaultAnnouncements = [
    {
      id: 1,
      text: "Welcome to Vignan University Faculty Portal",
      title: "Notice Board",
      author: "System",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop"
    }
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        if (data && data.length > 0) {
          const formatted = data.map((a, idx) => ({
            id: a._id || idx,
            text: a.content,
            title: a.title,
            author: a.facultyName,
            image: idx % 2 === 0 
              ? "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop"
              : "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop"
          }));
          setRealAnnouncements(formatted);
        } else {
          setRealAnnouncements(defaultAnnouncements);
        }
      } catch (err) {
        setRealAnnouncements(defaultAnnouncements);
      }
    };
    fetchAnnouncements();
  }, []);

  const displayAnnouncements = realAnnouncements.length > 0 ? realAnnouncements : defaultAnnouncements;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) =>
        (prevIndex + 1) % displayAnnouncements.length
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [displayAnnouncements.length]);

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
                src={displayAnnouncements[currentAnnouncementIndex]?.image}
                alt="Announcement"
                className="announcement-image"
              />
            </div>
            <div className="announcement-content">
              <div className="announcement-main">
                <span className="announcement-icon">
                  <i className="fas fa-bullhorn"></i>
                </span>
                <div className="announcement-text-group">
                  <span className="announcement-title">
                    {displayAnnouncements[currentAnnouncementIndex]?.title || "Latest Update"}
                  </span>
                  <span className="announcement-text">
                    {displayAnnouncements[currentAnnouncementIndex]?.text}
                  </span>
                </div>
              </div>
              <div className="announcement-author-tag">
                <i className="fas fa-user-edit"></i> {displayAnnouncements[currentAnnouncementIndex]?.author || "System"}
              </div>
            </div>
          </div>
          <div className="announcement-indicators">
            {displayAnnouncements.map((_, index) => (
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
