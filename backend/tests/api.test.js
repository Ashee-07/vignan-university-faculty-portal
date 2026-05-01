const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const studentRoutes = require('../routes/students');
const reportRoutes = require('../routes/reports');

app.use('/api/students', studentRoutes);
app.use('/api/reports', reportRoutes);

// Increased timeout for Cloud MongoDB connections
jest.setTimeout(60000);

describe('Vignan University Portal - Automated API Tests', () => {
    
    beforeAll(async () => {
        // Use the Atlas URI from .env but point to a test database
        let url = process.env.MONGODB_URI;
        if (url) {
            url = url.replace('/vignan_portal', '/vignan_portal_test');
        } else {
            url = 'mongodb://localhost:27017/vignan_portal_test';
        }
        
        try {
            await mongoose.connect(url);
        } catch (err) {
            console.error("Automation Error: Could not connect to MongoDB Atlas. Check your internet or URI.");
            throw err;
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Automated Student Registry Health Check', async () => {
        const response = await request(app).get('/api/students');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Automated Analytics Endpoint Verification', async () => {
        const response = await request(app).get('/api/reports/admin/analytics');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });
});
