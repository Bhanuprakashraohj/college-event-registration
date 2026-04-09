# College Event Registration System - 3-Tier Architecture

A comprehensive college event registration system built using a modern 3-Tier Architecture with web and mobile interfaces.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│           PRESENTATION TIER (Frontend)                       │
│  ┌─────────────────┐                    ┌────────────────┐  │
│  │  Web Interface  │                    │ Mobile App     │  │
│  │  (HTML/CSS/JS)  │                    │ (Flutter)      │  │
│  └─────────────────┘                    └────────────────┘  │
└────────────┬────────────────────────────────────┬───────────┘
             │ REST API                           │
┌────────────▼───────────────────────────────────▼───────────┐
│        APPLICATION TIER (Backend)                           │
│  Flask Server with MVC Pattern                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Models      │  │  Views/Routes│  │   Utils        │   │
│  │  (Database   │  │  (API        │  │  (Validation,  │   │
│  │   Logic)     │  │   Endpoints) │  │   Auth, etc)   │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────┬──────────────────────────────────────┘
                      │ SQL Queries
┌─────────────────────▼──────────────────────────────────────┐
│        DATA TIER (Database)                                 │
│  MySQL Database                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Students    │  │  Events      │  │  Registrations │   │
│  │  Table       │  │  Table       │  │  Table         │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
college event registration/
├── three_tier_project/
│   ├── frontend/
│   │   ├── web/
│   │   │   ├── html/
│   │   │   │   ├── index.html              # Student Registration Form
│   │   │   │   ├── admin_login.html        # Admin Login Page
│   │   │   │   ├── event_list.html         # Event List Display
│   │   │   │   ├── success.html            # Registration Success
│   │   │   │   └── admin_dashboard.html    # Admin Dashboard
│   │   │   ├── css/
│   │   │   │   └── styles.css              # Global Styling
│   │   │   └── js/
│   │   │       ├── validation.js           # Form Validation
│   │   │       ├── registration.js         # Registration Handler
│   │   │       ├── admin_login.js          # Admin Login Handler
│   │   │       ├── event_list.js           # Event Display
│   │   │       ├── success.js              # Success Page Handler
│   │   │       └── admin_dashboard.js      # Admin Dashboard Logic
│   │   └── mobile/
│   │       └── flutter_app/
│   │           ├── lib/
│   │           │   ├── main.dart           # Main App File
│   │           │   ├── models/
│   │           │   │   └── models.dart     # Data Models
│   │           │   └── screens/
│   │           │       ├── home_screen.dart
│   │           │       ├── registration_screen.dart
│   │           │       ├── event_list_screen.dart
│   │           │       └── admin_login_screen.dart
│   │           └── pubspec.yaml            # Flutter Dependencies
│   ├── backend/
│   │   ├── app.py                          # Main Flask App
│   │   ├── config.py                       # Configuration
│   │   ├── requirements.txt                # Python Dependencies
│   │   ├── .env.example                    # Environment Template
│   │   └── app/
│   │       ├── database.py                 # Database Connection
│   │       ├── models/
│   │       │   └── __init__.py             # ORM Models
│   │       ├── routes/
│   │       │   ├── events.py               # Event Endpoints
│   │       │   ├── registrations.py        # Registration Endpoints
│   │       │   └── admin.py                # Admin Endpoints
│   │       └── utils/
│   │           └── helpers.py              # Validation & Auth
│   ├── database/
│   │   ├── schema/
│   │   │   └── database_schema.sql         # MySQL Schema
│   │   └── migrations/
│   └── documentation/
│       ├── README.md                        # Project Guide
│       ├── API_DOCUMENTATION.md            # API Endpoints
│       ├── SETUP_GUIDE.md                  # Setup Instructions
│       └── ARCHITECTURE.md                 # Architecture Details
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 14+ (for web frontend)
- MySQL 8.0+
- Flutter SDK (for mobile app)
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd three_tier_project/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Update .env with your database credentials
# Edit .env file:
# MYSQL_HOST=localhost
# MYSQL_USER=root
# MYSQL_PASSWORD=your_password
# MYSQL_DB=college_event_registration
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run database schema
source ../database/schema/database_schema.sql

# Verify tables
USE college_event_registration;
SHOW TABLES;
```

### 3. Start Backend Server

```bash
# From backend directory with virtual environment activated
python app.py

# Server runs on http://localhost:5000
```

### 4. Frontend Setup (Web)

```bash
# Navigate to web frontend
cd three_tier_project/frontend/web

# Open index.html in a web browser
# Or use a simple HTTP server:
# Python 3
python -m http.server 8000

# Access at http://localhost:8000
```

## 📱 Features

### Student Portal
- ✅ User Registration Form (Name, USN, Email, Phone, Department, Year)
- ✅ Event Selection and Registration
- ✅ View All Available Events
- ✅ Registration Confirmation
- ✅ Duplicate Registration Prevention
- ✅ Form Validation (Frontend & Backend)

### Admin Portal
- ✅ Admin Authentication with JWT
- ✅ Add New Events
- ✅ Delete Events
- ✅ View All Registrations
- ✅ View Registered Students
- ✅ Dashboard Statistics
- ✅ Event Management

### Mobile App (Flutter)
- ✅ Home Screen with Navigation
- ✅ Student Registration Form
- ✅ Event List Display
- ✅ Admin Login
- ✅ Event Details View

## 🔌 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/<event_id>` - Get specific event
- `GET /api/events/upcoming` - Get upcoming events

### Registrations
- `POST /api/registrations` - Create new registration
- `GET /api/registrations/<registration_id>` - Get registration
- `GET /api/registrations/student/<student_id>` - Get student registrations

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get dashboard stats (requires auth)
- `GET /api/admin/events` - Get all events (requires auth)
- `POST /api/admin/events` - Create event (requires auth)
- `DELETE /api/admin/events/<event_id>` - Delete event (requires auth)
- `GET /api/admin/registrations` - Get registrations (requires auth)
- `DELETE /api/admin/registrations/<registration_id>` - Delete registration
- `GET /api/admin/students` - Get all students (requires auth)

## 🗄️ Database Schema

### Students Table
```sql
- student_id (PK)
- name
- usn (Unique)
- email (Unique)
- phone
- department
- year
- created_at
- updated_at
```

### Events Table
```sql
- event_id (PK)
- event_name
- event_date
- event_venue
- event_description
- created_at
- updated_at
```

### Registrations Table
```sql
- registration_id (PK)
- student_id (FK)
- event_id (FK)
- registration_date
- UNIQUE(student_id, event_id)
```

### Admin Users Table
```sql
- admin_id (PK)
- username (Unique)
- password (hashed)
- admin_name
- email
```

## 🔐 Security Features

- ✅ Password Hashing (bcrypt)
- ✅ JWT Authentication for Admin
- ✅ Input Validation (Frontend & Backend)
- ✅ SQL Injection Prevention (Parameterized Queries)
- ✅ CORS Protection
- ✅ Duplicate Registration Prevention

## 🧪 Testing Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## 📖 File Descriptions

### Frontend Files
- `index.html` - Student registration form with event selection
- `admin_login.html` - Admin authentication page
- `event_list.html` - Display all available events
- `success.html` - Registration confirmation page
- `admin_dashboard.html` - Admin management interface
- `styles.css` - Responsive Bootstrap-based styling
- `validation.js` - Client-side form validation
- `registration.js` - Student registration logic
- `admin_login.js` - Admin authentication logic
- `admin_dashboard.js` - Admin dashboard functionality

### Backend Files
- `app.py` - Flask application entry point
- `config.py` - Configuration management
- `database.py` - MySQL connection handling
- `models/__init__.py` - Data models (ORM)
- `routes/events.py` - Event API endpoints
- `routes/registrations.py` - Registration API endpoints
- `routes/admin.py` - Admin API endpoints
- `utils/helpers.py` - Validation, authentication, utilities

## 🛠️ Technology Stack

**Frontend (Web):**
- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (ES6+)
- Fetch API

**Frontend (Mobile):**
- Flutter
- Dart
- Provider (State Management)

**Backend:**
- Python 3.9+
- Flask
- Flask-CORS
- PyJWT
- bcrypt

**Database:**
- MySQL 8.0+

**Architecture:**
- 3-Tier Architecture
- MVC Pattern
- RESTful API

## 📋 Functional Requirements

✅ Students can register for multiple events
✅ Students cannot register for the same event twice
✅ Admin can add new events with date, venue, description
✅ Admin can delete events
✅ Admin can view all registered students
✅ Admin can view event-wise registrations
✅ System displays confirmation after registration
✅ Responsive design for web and mobile
✅ Input validation on both frontend and backend

## 🤝 Contributing

To contribute to this project:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request



---

**Version:** 1.0.0  
**Last Updated:** February 27, 2026  
**Status:** Production Ready
