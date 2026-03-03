# Architecture Overview - 3-Tier Application

## Architecture Pattern

The College Event Registration System implements a **3-Tier Client-Server Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│    PRESENTATION TIER (Frontend)     │
│  ┌─────────────────────────────┐    │
│  │ Web (HTML/CSS/JavaScript)   │    │
│  │ Mobile (Flutter)            │    │
│  └─────────────────────────────┘    │
└──────────────┬──────────────────────┘
               │ REST API (JSON)
┌──────────────▼──────────────────────┐
│  APPLICATION TIER (Business Logic)  │
│  ┌─────────────────────────────┐    │
│  │ Flask Framework             │    │
│  │ MVC Pattern Implementation  │    │
│  │ Authentication & Validation │    │
│  └─────────────────────────────┘    │
└──────────────┬──────────────────────┘
               │ SQL Queries
┌──────────────▼──────────────────────┐
│     DATA TIER (Persistence)         │
│  ┌─────────────────────────────┐    │
│  │ MySQL Database              │    │
│  │ Relational Data Storage     │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## 1. Presentation Tier (Frontend)

### Purpose
- User interface for students and admins
- Handles user interactions and display
- Client-side validation and error handling
- No business logic (only presentation)

### Technologies
- **Web Frontend:**
  - HTML5 for structure
  - CSS3 (Bootstrap 5) for responsive design
  - JavaScript (ES6+) for interactivity
  - Fetch API for backend communication

- **Mobile Frontend:**
  - Flutter framework
  - Dart programming language
  - Provider for state management

### Key Components

#### Web Application Structure
```
frontend/web/
├── html/
│   ├── index.html              # Student registration
│   ├── admin_login.html        # Admin authentication
│   ├── event_list.html         # Event display
│   ├── success.html            # Success confirmation
│   └── admin_dashboard.html    # Admin management
├── css/
│   └── styles.css              # Global styling
└── js/
    ├── validation.js           # Client-side validation
    ├── registration.js         # Registration logic
    ├── admin_login.js          # Admin login logic
    ├── event_list.js           # Event display logic
    ├── success.js              # Success page logic
    └── admin_dashboard.js      # Admin dashboard logic
```

#### Flutter Application Structure
```
frontend/mobile/flutter_app/lib/
├── main.dart                   # App entry point
├── screens/
│   ├── home_screen.dart        # Navigation hub
│   ├── registration_screen.dart # Registration form
│   ├── event_list_screen.dart  # Event listing
│   └── admin_login_screen.dart # Admin login
├── models/
│   └── models.dart             # Data models
└── services/
    └── api_service.dart        # API communication
```

### Key Features
- ✅ Form validation before server submission
- ✅ Responsive design (mobile-first)
- ✅ Error message display
- ✅ Loading states
- ✅ Session storage for success confirmation
- ✅ CSRF protection ready

---

## 2. Application Tier (Backend)

### Purpose
- Business logic implementation
- Data validation and processing
- Authentication and authorization
- API endpoint management
- Database operations coordination

### Technologies
- **Framework:** Flask (Python web framework)
- **Language:** Python 3.9+
- **Pattern:** MVC (Model-View-Controller)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt hashing
- **CORS:** Flask-CORS extension

### MVC Pattern Implementation

#### Models (Data Layer)
Located in: `backend/app/models/__init__.py`

```python
class Student:
    - create()          # Insert new student
    - get_by_id()       # Retrieve by ID
    - get_by_usn()      # Retrieve by USN
    - get_all()         # Get all students
    - update()          # Update details
    - delete()          # Remove student

class Event:
    - create()          # Insert new event
    - get_by_id()       # Retrieve by ID
    - get_all()         # Get all events
    - get_upcoming()    # Get future events
    - update()          # Update details
    - delete()          # Remove event

class Registration:
    - create()          # Insert registration
    - get_by_id()       # Retrieve by ID
    - get_all()         # Get all
    - get_by_student()  # Get student's registrations
    - get_by_event()    # Get event's registrations
    - exists()          # Check duplicate
    - delete()          # Remove registration

class AdminUser:
    - get_by_username() # Retrieve admin
    - create()          # Insert admin
```

#### Views/Routes (API Endpoints)
Located in: `backend/app/routes/`

```
events.py
├── GET /api/events              # Fetch all events
├── GET /api/events/upcoming     # Fetch upcoming events
└── GET /api/events/<id>         # Fetch specific event

registrations.py
├── POST /api/registrations      # Create registration
├── GET /api/registrations/<id>  # Get registration
└── GET /api/registrations/student/<id>

admin.py
├── POST /api/admin/login        # Authenticate
├── GET /api/admin/stats         # Dashboard stats
├── GET /api/admin/events        # Manage events
├── POST /api/admin/events       # Create event
├── DELETE /api/admin/events/<id> # Delete event
├── GET /api/admin/registrations # View registrations
├── DELETE /api/admin/registrations/<id>
├── GET /api/admin/students      # View students
└── GET /api/admin/students/<id> # Student details
```

#### Utilities/Helpers
Located in: `backend/app/utils/helpers.py`

- **Validator Class** - Input validation
  - Name validation
  - USN format validation
  - Email validation
  - Phone number validation
  - Department validation
  - Event validation

- **PasswordManager Class** - Password security
  - Hash password (bcrypt)
  - Verify password

- **JWTManager Class** - Token management
  - Create token
  - Verify token

- **APIResponse Class** - Consistent responses
  - Success response format
  - Error response format

### API Design Principles

1. **RESTful Design**
   - GET for retrieval
   - POST for creation
   - PUT/PATCH for update
   - DELETE for removal

2. **Consistent Response Format**
   ```json
   {
     "success": true/false,
     "message": "Description",
     "data": {...}
   }
   ```

3. **Status Codes**
   - 200: OK
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 404: Not Found
   - 500: Server Error

4. **Authentication**
   - JWT tokens for admin endpoints
   - Bearer token format
   - Token expiration (30 days)

### Request/Response Flow

```
Client Request
    ↓
URL Route Handler (Flask)
    ↓
Input Validation
    ↓
Authentication Check (if required)
    ↓
Business Logic (Model operations)
    ↓
Database Query Execution
    ↓
Response Formatting
    ↓
Client Response (JSON)
```

---

## 3. Data Tier (Database)

### Purpose
- Persistent data storage
- Data integrity through relationships
- Query optimization
- Transaction management

### Technology
- **Database:** MySQL 8.0+
- **Pattern:** Relational Database
- **Normalization:** 3NF (Third Normal Form)

### Database Schema

#### Students Table
```sql
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    usn VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year INT CHECK (year >= 1 AND year <= 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE,
    INDEX idx_usn (usn),
    INDEX idx_email (email),
    INDEX idx_department (department)
);
```

#### Events Table
```sql
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    event_venue VARCHAR(200) NOT NULL,
    event_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE,
    INDEX idx_event_date (event_date),
    INDEX idx_event_name (event_name)
);
```

#### Registrations Table (Junction Table)
```sql
CREATE TABLE registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_event (student_id, event_id),
    INDEX idx_student_id (student_id),
    INDEX idx_event_id (event_id)
);
```

#### Admin Users Table
```sql
CREATE TABLE admin_users (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE,
    INDEX idx_username (username)
);
```

### Key Design Decisions

1. **Foreign Keys & Cascading**
   - CASCADE DELETE on Registrations when Student/Event deleted
   - Maintains referential integrity

2. **Unique Constraints**
   - USN and Email unique per student
   - Username unique per admin
   - Student-Event combination unique (no duplicate registrations)

3. **Indexing Strategy**
   - Primary keys indexed automatically
   - Foreign keys indexed for joins
   - Commonly searched fields indexed (USN, Email, Name)
   - Date fields indexed for range queries

4. **Timestamps**
   - created_at: Record creation time
   - updated_at: Last modification time
   - registration_date: When registration occurred

5. **Views for Reporting**
   ```sql
   - registration_summary    # Join all 3 tables
   - event_registration_count # Count registrations per event
   - student_event_count      # Count events per student
   ```

---

## Data Flow Examples

### Student Registration Flow

```
1. User fills registration form (Frontend)
   ↓
2. JavaScript validates form (Client-side validation)
   ↓
3. POST to /api/registrations with JSON payload
   ↓
4. Backend receives request
   ↓
5. Backend validates all fields (Server-side validation)
   ↓
6. Check if student exists by USN
   ├─ YES: Get existing student_id
   └─ NO: Create new student record
   ↓
7. For each selected event:
   ├─ Verify event exists
   ├─ Check for duplicate registration
   └─ Create registration record
   ↓
8. Return success with registration IDs
   ↓
9. Frontend redirects to success page
   ↓
10. Success page displays confirmation details
```

### Admin Login Flow

```
1. Admin fills login form (Frontend)
   ↓
2. POST to /api/admin/login with credentials
   ↓
3. Backend receives request
   ↓
4. Find admin by username in database
   ├─ NOT FOUND: Return error 401
   └─ FOUND: Continue
   ↓
5. Verify password using bcrypt
   ├─ MISMATCH: Return error 401
   └─ MATCH: Continue
   ↓
6. Generate JWT token
   (payload: admin_id, username; expiry: 30 days)
   ↓
7. Return token and admin details
   ↓
8. Frontend stores token in localStorage
   ↓
9. Subsequent requests include token in header
   Authorization: Bearer <token>
   ↓
10. Backend verifies token on protected endpoints
```

### Event Query Flow

```
1. Frontend requests: GET /api/events
   ↓
2. Backend calls Event.get_all()
   ↓
3. Database executes query with aggregation:
   SELECT e.*, COUNT(r.registration_id) 
   FROM events e
   LEFT JOIN registrations r ON e.event_id = r.event_id
   GROUP BY e.event_id
   ↓
4. Results include registered_count for each event
   ↓
5. Format as JSON response
   ↓
6. Frontend displays events with registration count
```

---

## Security Architecture

### Input Validation
- **Frontend:** Immediate user feedback
- **Backend:** Authoritative validation (never trust client)
- **Validation Types:**
  - Type checking
  - Length constraints
  - Format validation (regex)
  - Business logic validation (duplicate check)

### Authentication
- **Admin:** JWT token-based
- **Student:** No authentication required
- **Token Storage:** localStorage (frontend) -> HTTP header

### Authorization
- **Public Endpoints:** Events, Registrations creation
- **Protected Endpoints:** Admin operations (require valid token)
- **Scope:** Admin privilege check

### Password Security
- **Storage:** bcrypt hashing (12 salt rounds)
- **Comparison:** Timing-safe comparison
- **Never logged:** Passwords excluded from logs

### SQL Injection Prevention
- **Method:** Parameterized queries
- **Implementation:** mysql-connector uses placeholders (%s)
- **Advantage:** User input treated as data, not code

### CORS Security
- **Whitelist:** Specific allowed origins
- **Methods:** GET, POST, PUT, DELETE
- **Headers:** Content-Type, Authorization

---

## Performance Considerations

### Database Optimization
1. **Indexing**
   - Indexed commonly searched fields
   - Foreign key columns indexed for joins

2. **Query Optimization**
   - Join tables efficiently
   - Use aggregations at database level
   - Avoid N+1 query problems

3. **Connection Pooling**
   - Reuse database connections
   - Configurable pool size

### Backend Optimization
1. **Response Format**
   - JSON (lightweight, standard)
   - Compress large payloads

2. **Caching** (Future enhancement)
   - Cache event list (changes infrequently)
   - Cache admin stats (refresh periodically)

### Frontend Optimization
1. **Asset Loading**
   - CDN for Bootstrap, jQuery
   - Minified CSS/JavaScript

2. **DOM Manipulation**
   - Batch updates when possible
   - Event delegation for dynamic content

---

## Scalability Considerations

### Horizontal Scaling
- **Stateless backend:** Each server independent
- **Load balancer:** Distribute requests
- **Database:** Shared MySQL instance (or replica)

### Vertical Scaling
- **Increase server resources** as needed
- **Database optimization** for more concurrent users

### Future Enhancements
- Redis for caching
- Message queue for async operations
- Microservices architecture
- Database replication/sharding

---

## Deployment Architecture

### Development
```
Local Machine
├── Frontend: http://localhost:8000
├── Backend: http://localhost:5000
└── Database: localhost:3306
```

### Production
```
Web Server (Nginx/Apache)
    ↓
Application Server (Gunicorn)
    ↓
Flask Application
    ↓
Database Server (MySQL)
```

---

**Version:** 1.0.0  
**Last Updated:** February 27, 2026
