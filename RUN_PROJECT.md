# College Event Registration System - Quick Start

This project is now ready to run with a **single command**.

## Prerequisites

- **MySQL Server** installed and running (configured with root password as per `backend/.env`)
- **Python 3.7+** installed
- Port 5000 (backend) and 8000 (frontend) available

## Running the Project

### Windows (Batch File)
Simply double-click or run:
```bash
runbat.
```

This will:
1. ✓ Check/start MySQL service
2. ✓ Import database schema
3. ✓ Start Flask backend on http://localhost:5000
4. ✓ Start frontend server on http://localhost:8000
5. ✓ Open admin dashboard in your browser

**To run without opening the browser:**
```bash
run.bat -nopen
```

### Windows (PowerShell)
Alternative method (if `.bat` doesn't work):
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\run.ps1 -NoOpen
```

### Manual Setup (if scripts don't work)
```bash
# From the backend directory
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt

# Import schema
.\venv\Scripts\python.exe .\scripts\import_schema.py

# In one terminal: Start backend
.\venv\Scripts\python.exe .\app.py

# In another terminal: Start frontend
cd frontend\web
python -m http.server 8000
```

## Accessing the Application

- **Admin Dashboard**: http://localhost:8000/html/admin_dashboard.html
- **Event List**: http://localhost:8000/html/event_list.html
- **Backend API**: http://localhost:5000/api

### Default Credentials
- **Username**: admin
- **Password**: admin (set in database during schema import)

## Stopping the Services

The services run in separate command windows. Close each window to stop the service:
- Close the Flask backend window
- Close the HTTP server window

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL is installed and running
- Check `backend\.env` for correct database credentials
- Password is set to `pass` by default

### Port Already in Use
- Backend uses port 5000, frontend uses port 8000
- Close other services using these ports

### Python Venv Not Found
- Run: `python -m venv backend\venv`
- Then: `backend\venv\Scripts\python.exe -m pip install -r backend\requirements.txt`

## Project Structure

```
three_tier_project/
├── backend/              # Flask API server
│   ├── app.py           # Main Flask app
│   ├── config.py        # Configuration
│   ├── requirements.txt  # Dependencies
│   └── app/
│       ├── routes/      # API endpoints
│       ├── models/      # Database models
│       └── utils/       # Helper functions
├── frontend/web/        # Static web files
│   ├── html/           # HTML pages
│   ├── js/             # JavaScript files
│   └── css/            # Stylesheets
└── database/           # Database schema
```

---

**Questions?** Check the documentation in the `documentation/` folder.
