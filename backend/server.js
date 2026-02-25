const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vignan_portal';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require('./routes/students');
const timetableRoutes = require('./routes/timetable');
const assessmentRoutes = require('./routes/assessments');
const announcementRoutes = require('./routes/announcements');
const reportRoutes = require('./routes/reports');
const assignmentRoutes = require('./routes/assignments');
const materialRoutes = require('./routes/materials');
const questionPaperRoutes = require('./routes/questionPapers');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leaves');
const adminRoutes = require('./routes/admins');
const analyticsRoutes = require('./routes/analytics');
const gradesRoutes = require('./routes/grades');

app.use('/api/faculty', facultyRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/questionPapers', questionPaperRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/grades', gradesRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('Vignan University API is Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
