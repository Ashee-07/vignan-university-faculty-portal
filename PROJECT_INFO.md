# Vignan University Faculty Portal - Project Info

## Overview
This project is a hybrid web application designed for **Vignan University** to facilitate academic and administrative tasks for Faculty, Admins (DEOs), and Students. It combines the flexibility of **MERN** (MongoDB, Express, React, Node.js) for unstructured data with the robustness of **SQL** for structured academic records.

## Project Structure
The project is split into two main components:

### 1. Frontend (`/frontend`)
- **Framework**: React.js with Vite
- **State Management**: Zustand
- **Routing**: React Router DOM
- **UI/Styling**: Vanilla CSS with FontAwesome for icons
- **Key Features**: 
  - Automated logo splash screen
  - Role-based authentication (Faculty, Admin, Student)
  - Interactive dashboards for attendance, grades, and leave requests

### 2. Backend (`/backend`)
- **Environment**: Node.js & Express.js
- **Databases**: 
  - **MongoDB (Mongoose)**: Handles dynamic data like Faculty profiles, attendance logs, timetables, leave requests, and alerts.
  - **SQLite (Prisma)**: Handles structured academic data like student records, courses, assignments, and grades.
- **Key Features**:
  - JWT-based authentication
  - RESTful API architecture
  - Multi-database integration for optimal performance

## Security & Secrets
- Database credentials and API keys are managed via `.env` files.
- A `.gitignore` has been implemented to ensure sensitive credentials are never pushed to public repositories.
- `.env.example` templates are provided for easy setup in new environments.

## Development Team
- **Project Type**: Integrated Development Project (IDP)
- **Institution**: Vignan University
- **GitHub Repository**: [Ashee-07](https://github.com/Ashee-07)
