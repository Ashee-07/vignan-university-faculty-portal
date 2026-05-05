import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Splash from "./pages/Home/Splash.jsx";
import Home from "./pages/Home/Home.jsx";
import FacultyLogin from "./pages/Login/FacultyLogin.jsx";
import AdminLogin from "./pages/Login/AdminLogin.jsx";
import StudentLogin from "./pages/Login/StudentLogin.jsx";
import FacultyDashboard from "./pages/Dashboard/FacultyDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Timetable from "./pages/faculty/Timetable/Timetable.jsx";
import Attendance from "./pages/faculty/Attendance/Attendance.jsx";
import Grades from "./pages/faculty/Grades.jsx";
import QuestionPapers from "./pages/faculty/QuestionPapers.jsx";
import Assignments from "./pages/faculty/Assignments.jsx";
import CourseMaterials from "./pages/faculty/CourseMaterials.jsx";
import StudentProgress from "./pages/faculty/StudentProgress.jsx";
import StudentPerformance from "./pages/faculty/StudentPerformance.jsx";
import LeaveManagement from "./pages/faculty/LeaveManagement.jsx";
import InternalAssessment from "./pages/faculty/InternalAssessment.jsx";
import StudentFeedback from "./pages/faculty/StudentFeedback.jsx";
import Announcements from "./pages/faculty/Announcements.jsx";
import Reports from "./pages/faculty/Reports.jsx";
import FacultySettings from "./pages/Settings/FacultySettings.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import FacultyLayout from "./components/layout/FacultyLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import StudentLayout from "./components/layout/StudentLayout.jsx";
import FacultyFeedback from "./pages/student/FacultyFeedback.jsx";
import StudentTimetable from "./pages/student/StudentTimetable.jsx";
import StudentAttendance from "./pages/student/StudentAttendance.jsx";
import StudentGrades from "./pages/student/StudentGrades.jsx";
import ManageFaculty from "./pages/admin/ManageFaculty.jsx";
import ManageStudents from "./pages/admin/ManageStudents.jsx";
import ManageTimetable from "./pages/admin/ManageTimetable.jsx";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements.jsx";
import ManageLeave from "./pages/admin/ManageLeave.jsx";
import ManageReports from "./pages/admin/ManageReports.jsx";
import SystemSettings from "./pages/admin/SystemSettings.jsx";
import StudentQuestionPapers from "./pages/student/StudentQuestionPapers.jsx";
import StudentAssignments from "./pages/student/StudentAssignments.jsx";
import StudentMaterials from "./pages/student/StudentMaterials.jsx";
import StudentAssessments from "./pages/student/StudentAssessments.jsx";

const FacultyContainer = () => {
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "faculty") {
    return <Navigate to="/faculty-login" replace />;
  }
  return (
    <FacultyLayout>
      <Outlet />
    </FacultyLayout>
  );
};

const AdminContainer = () => {
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

const StudentContainer = () => {
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "student") {
    return <Navigate to="/student-login" replace />;
  }
  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  );
};

// Protect routes from unauthorized access
const ProtectedRoute = ({ children, userType }) => {
  const role = localStorage.getItem("userRole");
  if (role !== userType) {
    return <Navigate to={userType === "faculty" ? "/faculty-login" : "/admin-login"} replace />;
  }
  return children;
};

// Prevent logged in users from visiting their own login page if already authenticated
const PublicRoute = ({ children, roleToRedirect }) => {
  const userRole = localStorage.getItem("userRole");
  if (userRole === roleToRedirect) {
    return <Navigate to={userRole === "faculty" ? "/faculty-dashboard" : "/admin-dashboard"} replace />;
  }
  return children;
};

export default function App() {
  // Session Monitoring (Auto-logout after 30 minutes)
  React.useEffect(() => {
    const checkSession = () => {
      const userRole = localStorage.getItem("userRole");
      const loginTime = localStorage.getItem("loginTime");
      
      if (userRole && loginTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - parseInt(loginTime);
        const thirtyMinutes = 30 * 60 * 1000;

        if (elapsedTime > thirtyMinutes) {
          console.warn("Session expired. Logging out...");
          localStorage.clear();
          window.location.href = "/"; // Force redirect to splash/login
        }
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);
    checkSession(); // Initial check

    return () => clearInterval(interval);
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Splash Screen */}
        <Route path="/" element={<Splash />} />

        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/faculty-login" element={<PublicRoute roleToRedirect="faculty"><FacultyLogin /></PublicRoute>} />
        <Route path="/admin-login" element={<PublicRoute roleToRedirect="admin"><AdminLogin /></PublicRoute>} />
        <Route path="/student-login" element={<PublicRoute roleToRedirect="student"><StudentLogin /></PublicRoute>} />

        {/* Protected Faculty Routes wrapped in FacultyLayout */}
        <Route element={<FacultyContainer />}>
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/question-papers" element={<QuestionPapers />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/course-materials" element={<CourseMaterials />} />
          <Route path="/student-progress" element={<StudentProgress />} />
          <Route path="/student-performance" element={<StudentPerformance />} />
          <Route path="/leave-management" element={<LeaveManagement />} />
          <Route path="/internal-marks" element={<InternalAssessment />} />
          <Route path="/feedback" element={<StudentFeedback />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/faculty-settings" element={<FacultySettings />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminContainer />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/faculty" element={<ManageFaculty />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/timetable" element={<ManageTimetable />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/leave" element={<ManageLeave />} />
          <Route path="/admin/reports" element={<ManageReports />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
        </Route>

        {/* Protected Student Routes */}
        <Route element={<StudentContainer />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />

          <Route path="/student/grades" element={<StudentGrades />} />
          <Route path="/student/question-papers" element={<StudentQuestionPapers />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/assessments" element={<StudentAssessments />} />
          <Route path="/student/course-materials" element={<StudentMaterials />} />
          <Route path="/student/feedback" element={<FacultyFeedback />} />
        </Route>

        {/* Redirect any unknown routes to splash */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

