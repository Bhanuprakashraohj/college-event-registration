# Setup and Installation Guide

## System Requirements

### Minimum Requirements
- **OS:** Windows 10+, macOS 10.12+, or Ubuntu 18.04+
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB minimum
- **Internet:** Required for initial setup

### Software Requirements
- Python 3.9 or higher
- Node.js 14.x or higher (optional, for web server)
- MySQL Server 8.0 or higher
- Git
- Code Editor (VS Code, PyCharm, etc.)

---

## Step-by-Step Installation

### 1. Clone or Download Project

```bash
# Clone repository (if using git)
git clone <repository_url>

# Or extract the project to your desired location
cd college\ event\ registration
cd three_tier_project
```

### 2. MySQL Database Setup

#### 2.1 Install MySQL
- **Windows:** Download from mysql.com and run installer
- **macOS:** Use Homebrew: `brew install mysql`
- **Linux Ubuntu:** `sudo apt-get install mysql-server`

#### 2.2 Start MySQL Service
```bash
# Windows
net start MySQL80

# macOS
mysql.server start

# Linux
sudo systemctl start mysql
```

#### 2.3 Create Database

```bash
# Login to MySQL
mysql -u root -p

# When prompted, enter your MySQL root password
# Run the schema file
source path/to/database/schema/database_schema.sql;

# Exit MySQL
exit;
```

#### 2.4 Verify Database Creation

```bash
mysql -u root -p

# In MySQL prompt:
USE college_event_registration;
SHOW TABLES;

# Should display:
# +-------------------------------------+
# | Tables_in_college_event_registration |
# +-------------------------------------+
# | admin_users                          |
# | events                               |
# | registrations                        |
# | students                             |
# +-------------------------------------+
```

### 3. Backend Setup

#### 3.1 Navigate to Backend Directory

```bash
cd backend
```

#### 3.2 Create Python Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3.3 Install Python Dependencies

```bash
pip install -r requirements.txt

# Verify installation
pip list
```

#### 3.4 Configure Environment Variables

```bash
# Copy example environment file
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env

# Edit .env file with your credentials
# MYSQL_HOST=localhost
# MYSQL_USER=root
# MYSQL_PASSWORD=your_root_password
# MYSQL_DB=college_event_registration
```

#### 3.5 Test Backend Connection

```bash
python app.py

# You should see:
# WARNING in app.run_simple ...
#  * Running on http://127.0.0.1:5000
#  * WARNING: This is a development server. Do not use it in production deployment.
```

**Test health endpoint:**
```bash
# In another terminal
curl http://localhost:5000/api/health

# Response:
# {
#   "status": "healthy",
#   "service": "College Event Registration System Backend",
#   "version": "1.0.0"
# }
```

### 4. Frontend Web Setup

#### 4.1 Navigate to Frontend Directory

```bash
cd ..\frontend\web
# or
cd ../frontend/web
```

#### 4.2 Start Local Web Server

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js (http-server):**
```bash
# Install globally (if not installed)
npm install -g http-server

# Run server
http-server -p 8000
```

#### 4.3 Access Web Application

Open your browser and navigate to:
```
http://localhost:8000/html/index.html
```

**Available Pages:**
- Student Registration: `http://localhost:8000/html/index.html`
- Admin Login: `http://localhost:8000/html/admin_login.html`
- Event List: `http://localhost:8000/html/event_list.html`
- Success: `http://localhost:8000/html/success.html`
- Admin Dashboard: `http://localhost:8000/html/admin_dashboard.html`

### 5. Flutter Mobile App Setup

#### 5.1 Install Flutter SDK

**Windows:**
1. Download Flutter from flutter.dev
2. Extract to a folder (e.g., `C:\src\flutter`)
3. Add Flutter to PATH environment variable
4. Run `flutter doctor` to verify installation

**macOS:**
```bash
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"
```

**Windows:**
```bash
git clone https://github.com/flutter/flutter.git -b stable
# Add to PATH: C:\Users\<username>\flutter\bin
```

#### 5.2 Get Dependencies

```bash
cd frontend/mobile/flutter_app

# Get Flutter packages
flutter pub get

# Verify setup
flutter doctor
```

#### 5.3 Run Flutter App

```bash
# For Android emulator
flutter run

# For specific device
flutter run -d <device_id>

# Get list of available devices
flutter devices
```

---

## Configuration Details

### Backend Configuration (.env)

```
# Flask Configuration
FLASK_ENV=development          # development, testing, production
SECRET_KEY=your-secret-key
DEBUG=True                     # Set to False in production

# Database Configuration
MYSQL_HOST=localhost           # Your MySQL host
MYSQL_USER=root                # MySQL username
MYSQL_PASSWORD=your_password   # MySQL password
MYSQL_DB=college_event_registration

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret

# Server Configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=5000

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Frontend Configuration (JavaScript)

Update API base URL in JavaScript files (frontend/web/js/):

```javascript
// Current setting (localhost development)
const API_BASE_URL = 'http://localhost:5000/api';

// For production, update to:
// const API_BASE_URL = 'https://your-domain.com/api';
```

---

## Database Initial Data

### Default Admin Account

**Username:** `admin`  
**Password:** `admin123`

**Note:** Change these credentials in production!

### Sample Events (Optional)

Insert sample events using Admin Dashboard or API:

```sql
INSERT INTO events (event_name, event_date, event_venue, event_description) VALUES
('Tech Summit 2026', '2026-03-15 10:00:00', 'Main Auditorium', 'Annual technology summit'),
('Culture Fest', '2026-03-20 15:00:00', 'College Ground', 'Inter-departmental cultural event'),
('Sports Day', '2026-03-25 08:00:00', 'Sports Complex', 'Annual sports competition');
```

---

## Troubleshooting

### Issue: Cannot connect to MySQL

**Solution:**
```bash
# Check if MySQL is running
mysql -u root -p

# If connection fails, ensure MySQL service is started
# Windows: net start MySQL80
# macOS: mysql.server start
# Linux: sudo systemctl start mysql
```

### Issue: Python package installation fails

**Solution:**
```bash
# Update pip first
pip install --upgrade pip

# Try installing again
pip install -r requirements.txt

# If specific package fails, install individually
pip install Flask==2.3.3
```

### Issue: API endpoints not responding

**Solution:**
1. Verify backend is running: `http://localhost:5000/api/health`
2. Check CORS credentials in frontend JS
3. Verify database connection in backend logs
4. Check firewall settings

### Issue: Flutter app crashes on startup

**Solution:**
```bash
# Run with verbose output
flutter run -v

# Check dependencies
flutter pub get --no-offline

# Clean build
flutter clean
flutter pub get
flutter run
```

### Issue: Database tables not found

**Solution:**
```bash
# Verify database was created
mysql -u root -p
USE college_event_registration;
SHOW TABLES;

# If tables missing, re-run schema
source path/to/database_schema.sql;
```

---

## Port Configuration

| Service | Default Port | Configurable |
|---------|-------------|--------------|
| Flask Backend | 5000 | Yes (config.py) |
| Web Server | 8000 | Yes (http-server) |
| MySQL | 3306 | Yes (MySQL config) |
| Flutter (Android) | 5555+ | N/A |

---

## Development Tips

### Enable Debug Mode

```python
# In backend/config.py
class DevelopmentConfig(Config):
    DEBUG = True        # Enable detailed error messages
    TESTING = False
```

### View Database Queries

```python
# Install MySQL Query Viewer
pip install django-debug-toolbar
```

### Testing API Endpoints

**Using Postman:**
1. Import API endpoints from documentation
2. Set base URL to `http://localhost:5000/api`
3. Test each endpoint

**Using cURL:**
```bash
# Test health
curl http://localhost:5000/api/health

# Get events
curl http://localhost:5000/api/events

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Production Deployment Considerations

1. **Use production database:** PostgreSQL or managed MySQL service
2. **Enable HTTPS:** Use SSL certificates
3. **Change secrets:** Generate new SECRET_KEY and JWT_SECRET_KEY
4. **Use WSGI server:** Gunicorn or uWSGI instead of Flask development server
5. **Setup reverse proxy:** Nginx or Apache
6. **Enable rate limiting:** Prevent abuse
7. **Monitor logs:** Setup logging and monitoring
8. **Database backups:** Regular backup strategy
9. **Security headers:** Implement CSP, X-Frame-Options, etc.
10. **Update dependencies:** Regularly update packages

---

## Useful Commands Quick Reference

```bash
# Backend
python app.py                    # Start backend
python -m pytest                 # Run tests
pip freeze > requirements.txt    # Update requirements

# Frontend Web
python -m http.server 8000      # Start web server
curl http://localhost:5000/api/health  # Test API

# Database
mysql -u root -p                # Connect to MySQL
SHOW DATABASES;                 # List databases
USE college_event_registration; # Select database
SHOW TABLES;                    # List tables

# Flutter
flutter pub get                 # Get packages
flutter run                     # Run app
flutter clean                   # Clean build
flutter pub upgrade             # Upgrade packages
```

---

**Version:** 1.0.0  
**Last Updated:** February 27, 2026
