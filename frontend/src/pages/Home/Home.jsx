import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showCourseStructure, setShowCourseStructure] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const blobs = document.querySelectorAll(".blob");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      blobs.forEach((blob, index) => {
        const shiftX = (x - 0.5) * (index + 1) * 50;
        const shiftY = (y - 0.5) * (index + 1) * 50;
        blob.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = (role) => {
    if (role === 'Faculty') {
      navigate("/faculty-login");
    } else if (role === 'Admin') {
      navigate("/admin-login");
    } else if (role === 'Student') {
      navigate("/student-login");
    }
  };

  const toggleCourseStructure = () => {
    setShowCourseStructure(!showCourseStructure);
  };

  return (
    <div className="home-container">
      {/* Background Blobs */}
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Navigation Header */}
      <header className="header-glass">
        <div className="logo-section">
          <div className="logo-box"></div>
          <h1>VIGNAN UNIVERSITY</h1>
        </div>
        <nav className="nav-links">
          <a href="https://vignan.ac.in/newvignan/contact.php" target="_blank" rel="noopener noreferrer" className="support-btn">Support</a>
        </nav>
      </header>

      <main className="content-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <h2 className="title-gradient">Department Of Information Technology</h2>
          <p className="hero-subtitle">
            Welcome to the Vignan Faculty Portal. Empowering the IT Department with a
            comprehensive management system for academic excellence.
          </p>
        </section>

        {/* Action Buttons */}
        <div className="login-actions">
          <div className="circle-btn-wrapper" onClick={() => handleLogin('Faculty')}>
            <div className="circle-btn glass-card">
              <div className="glow pink-glow"></div>
              <i className="fas fa-chalkboard-teacher icon-pink"></i>
              <span>FACULTY LOGIN</span>
              <div className="line pink-line"></div>
            </div>
          </div>

          <div className="circle-btn-wrapper" onClick={() => handleLogin('Admin')}>
            <div className="circle-btn glass-card border-white-50">
              <div className="glow white-glow"></div>
              <i className="fas fa-user-shield icon-white"></i>
              <span>ADMIN LOGIN</span>
              <div className="line white-line"></div>
            </div>
          </div>

          <div className="circle-btn-wrapper" onClick={() => handleLogin('Student')}>
            <div className="circle-btn glass-card">
              <div className="glow cyan-glow"></div>
              <i className="fas fa-user-graduate icon-cyan"></i>
              <span>STUDENT LOGIN</span>
              <div className="line cyan-line"></div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="info-grid">
          <div className="info-card border-pink">
            <h3><i className="fas fa-graduation-cap"></i> UG : Program Structure</h3>
            <p>Detailed mission, vision, and marking schemes for IT excellence.</p>
            <div className="tag-container">
              <span className="tag">R22/C22</span>
              <span className="tag">R22/C24</span>
              <span className="tag">R25-C25</span>
            </div>
          </div>

          <div className="info-card border-blue clickable" onClick={toggleCourseStructure}>
            <h3><i className="fas fa-book-open"></i> Course Structure</h3>
            <p>Details regarding course subjects, lectures, and practicals for all semesters.</p>
            <div className="click-indicator">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>

          <div className="info-card border-teal">
            <h3><i className="fas fa-chart-line"></i> Student Outcome</h3>
            <p className="italic text-muted">No Student Outcome Available at this moment.</p>
          </div>
        </div>

        {/* Course Structure Details - Show when clicked */}
        {showCourseStructure && (
          <div className="course-structure-details">
            {/* Programme Educational Objectives */}
            <div className="programme-section">
              <h3 className="programme-title">Programme Educational Objectives (PEOs)</h3>
              <div className="programme-table">
                <div className="table-header">
                  <div className="header-cell">Title</div>
                  <div className="header-cell">Description</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PEO 1</div>
                  <div className="table-cell">To excel in their career as competent software engineer in IT and allied organizations, enabling them to design and develop effective and efficient IT solutions in real-world applications.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PEO 2</div>
                  <div className="table-cell">To demonstrate research temper and address complex problems in rapidly evolving IT industry, preparing them as entrepreneurs.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PEO 3</div>
                  <div className="table-cell">To integrate ethical values, social responsibility, and sustainability in their IT practices and exhibit leadership skills.</div>
                </div>
              </div>
            </div>

            {/* Programme Specific Outcomes */}
            <div className="programme-section">
              <h3 className="programme-title">Programme Specific Outcomes (PSOs)</h3>
              <div className="programme-table">
                <div className="table-header">
                  <div className="header-cell">Title</div>
                  <div className="header-cell">Description</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PSO 1</div>
                  <div className="table-cell">Provide solutions in the area of database management, software design and computing systems using machine intelligence.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PSO 2</div>
                  <div className="table-cell">Design, implement and manage secure computer networks and information systems by applying cybersecurity.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PSO 3</div>
                  <div className="table-cell">Apply software engineering principles, agile methodologies and project management techniques to develop and deliver high quality IT products.</div>
                </div>
              </div>
            </div>

            {/* Programme Outcomes */}
            <div className="programme-section">
              <h3 className="programme-title">Programme Outcomes (POs)</h3>
              <div className="programme-table">
                <div className="table-header">
                  <div className="header-cell">Title</div>
                  <div className="header-cell">Description</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 1</div>
                  <div className="table-cell">Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 2</div>
                  <div className="table-cell">Problem analysis: Identify, formulate, review research literature, and analyse complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 3</div>
                  <div className="table-cell">Design/development of solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 4</div>
                  <div className="table-cell">Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 5</div>
                  <div className="table-cell">Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modelling to complex engineering activities with an understanding of the limitations.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 6</div>
                  <div className="table-cell">The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 7</div>
                  <div className="table-cell">Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 8</div>
                  <div className="table-cell">Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 9</div>
                  <div className="table-cell">Individual and teamwork: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 10</div>
                  <div className="table-cell">Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 11</div>
                  <div className="table-cell">Project management and finance: Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">PO 12</div>
                  <div className="table-cell">Life-long learning: Recognize the need for and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-glass">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p><i className="fas fa-map-marker-alt"></i> Vignan's Foundation for Science, Technology and Research, Vadlamudi, Guntur-522213</p>
            <p><i className="fas fa-envelope"></i> info@vignan.ac.in</p>
            <p><i className="fas fa-phone"></i> 0863-2344700 / 701</p>
          </div>

          <div className="footer-column">
            <h4>Programme Description</h4>
            <p>The Information Technology department is dedicated to fostering innovation through a curriculum that blends theoretical knowledge with hands-on practical experience.</p>
          </div>

          <div className="footer-column align-right">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/vignanuniversityofficial?fref=ts" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/vignansuniversityofficial/?hl=en" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/vignan-s-foundation-of-science-technology-research?originalSubdomain=in" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://www.youtube.com/channel/UCzDKwPH7h79xDSOUgGSwjPQ?reload=9" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Vignan University | Faculty Portal & Administration System</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;