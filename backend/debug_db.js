const mongoose = require('mongoose');
const Student = require('./models/Student');
const Timetable = require('./models/Timetable');
require('dotenv').config();

async function checkData() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vignan-portal');
    
    const students = await Student.find().limit(2);
    const timetables = await Timetable.find().limit(2);
    
    console.log('Students Sample:', JSON.stringify(students, null, 2));
    console.log('Timetable Sample:', JSON.stringify(timetables, null, 2));
    
    process.exit();
}

checkData();
