
# VIGNAN UNIVERSITY — Faculty Portal (MERN + SQL Hybrid)

A professional portal for **VIGNAN UNIVERSITY** with **Faculty, Admin, and Student** roles.

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **MongoDB**: users, attendance, timetable, leave requests, alerts, reviews, OTPs
- **SQL (SQLite via Prisma)**: students, courses, assignments, grades

## Features (MVP)
- Animated **logo splash** then a role chooser: **Faculty / Admin / Student**
- **OTP login** (email/dev mode). JWT-based sessions
- **Faculty**: post attendance (fast bulk or per student), view timetable, request leave, enter assignment grades
- **Admin (DEO)**: edit timetable, broadcast alerts to all faculty, manage plans
- **Students**: login with **Register ID**, view **progress & marks**
- **Profiles**: faculty profiles; **students can review faculty**
- **Innovations**:
  - Quick **bulk attendance** via paste/CSV
  - **Alerts** feed with read states
  - Smart **grade entry** with keyboard navigation

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env    # then edit values as needed
npm install
npx prisma generate
npm run dev
```
The backend runs on **http://localhost:5000** by default.

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on **http://localhost:5173** by default.

## Environment (.env in backend)
```
PORT=5000
JWT_SECRET=supersecret_change_me

# Mongo
MONGO_URI=mongodb://localhost:27017/vignan_portal

# OTP dev mode (emails print to console if SMTP not set)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=no-reply@vignan.edu

# Prisma (SQLite default)
DATABASE_URL="file:./dev.db"
```

## Notes
- SQL is used only for **marks/grades** via Prisma + SQLite (swap to Postgres/MySQL by changing `DATABASE_URL`).
- OTPs are **time-limited** (5 minutes) and stored hashed in MongoDB (dev: plain send to console).
- This is an MVP starter—extend schemas and UI per your exact needs.
