# API Documentation - College Event Registration System

## Base URL
```
http://localhost:5000/api
```

## Authentication
Admin endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Events Endpoints

### Get All Events
**Endpoint:** `GET /events`

**Description:** Retrieve all available events with registration count

**Response:**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "events": [
    {
      "event_id": 1,
      "event_name": "Tech Summit 2026",
      "event_date": "2026-03-15T10:00:00",
      "event_venue": "Main Auditorium",
      "event_description": "Annual technology summit with industry experts",
      "registered_count": 45
    }
  ]
}
```

**Status Code:** 200 OK

---

### Get Upcoming Events
**Endpoint:** `GET /events/upcoming`

**Description:** Retrieve only upcoming events

**Response:**
```json
{
  "success": true,
  "message": "Upcoming events retrieved successfully",
  "events": [...]
}
```

**Status Code:** 200 OK

---

### Get Specific Event
**Endpoint:** `GET /events/<event_id>`

**Parameters:**
- `event_id` (integer) - Event ID

**Response:**
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "event": {
    "event_id": 1,
    "event_name": "Tech Summit 2026",
    ...
  }
}
```

**Status Codes:**
- 200 OK - Event found
- 404 Not Found - Event not found

---

## Registration Endpoints

### Create New Registration
**Endpoint:** `POST /registrations`

**Description:** Register a student for events

**Request Body:**
```json
{
  "name": "John Doe",
  "usn": "1RV19CS001",
  "email": "john@college.edu",
  "phone": "+919876543210",
  "department": "CSE",
  "year": 2,
  "event_ids": [1, 2, 3]
}
```

**Validation Rules:**
- `name`: Required, 3+ characters, letters only
- `usn`: Required, format 1RV19CS### (uppercase)
- `email`: Required, valid email format
- `phone`: Required, valid Indian phone number
- `department`: Required, must be CSE/ECE/ME/CE/EEE/IT
- `year`: Required, must be 1-4
- `event_ids`: Required, non-empty array of valid event IDs

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "student_id": 1,
  "registration_ids": [1, 2, 3],
  "number_of_events": 3
}
```

**Status Codes:**
- 201 Created - Registration successful
- 400 Bad Request - Validation error
- 404 Not Found - Event not found

**Error Response:**
```json
{
  "success": false,
  "message": "You have already registered for this event"
}
```

---

### Get Specific Registration
**Endpoint:** `GET /registrations/<registration_id>`

**Parameters:**
- `registration_id` (integer) - Registration ID

**Response:**
```json
{
  "success": true,
  "message": "Registration retrieved successfully",
  "registration": {
    "registration_id": 1,
    "student_id": 1,
    "event_id": 1,
    "registration_date": "2026-02-27T10:30:00",
    "student_name": "John Doe",
    "usn": "1RV19CS001",
    "event_name": "Tech Summit 2026"
  }
}
```

**Status Codes:**
- 200 OK - Registration found
- 404 Not Found - Registration not found

---

### Get Student Registrations
**Endpoint:** `GET /registrations/student/<student_id>`

**Parameters:**
- `student_id` (integer) - Student ID

**Response:**
```json
{
  "success": true,
  "message": "Student registrations retrieved successfully",
  "student_id": 1,
  "student_name": "John Doe",
  "registrations": [
    {
      "registration_id": 1,
      "registration_date": "2026-02-27T10:30:00",
      "event_id": 1,
      "event_name": "Tech Summit 2026",
      ...
    }
  ]
}
```

**Status Codes:**
- 200 OK - Registrations found
- 404 Not Found - Student not found

---

## Admin Endpoints

### Admin Login
**Endpoint:** `POST /admin/login`

**Description:** Authenticate admin and get JWT token

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin_id": 1,
  "admin_name": "Administrator"
}
```

**Status Codes:**
- 200 OK - Login successful
- 400 Bad Request - Missing credentials
- 401 Unauthorized - Invalid credentials

---

### Get Dashboard Statistics
**Endpoint:** `GET /admin/stats`

**Authentication:** Required (Bearer Token)

**Description:** Get dashboard statistics

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "total_events": 10,
  "total_registrations": 250,
  "total_students": 150,
  "today_registrations": 15
}
```

**Status Code:** 200 OK

---

### Get All Events (Admin)
**Endpoint:** `GET /admin/events`

**Authentication:** Required (Bearer Token)

**Description:** Get all events with management details

**Response:**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "events": [...]
}
```

**Status Code:** 200 OK

---

### Create New Event
**Endpoint:** `POST /admin/events`

**Authentication:** Required (Bearer Token)

**Description:** Create a new event

**Request Body:**
```json
{
  "event_name": "Annual Hackathon 2026",
  "event_date": "2026-04-10T09:00:00",
  "event_venue": "Tech Building, Room 101",
  "event_description": "24-hour coding competition with amazing prizes"
}
```

**Validation Rules:**
- `event_name`: Required, 3+ characters
- `event_date`: Required, must be in future (ISO format)
- `event_venue`: Required, 3+ characters
- `event_description`: Required, 10+ characters

**Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event_id": 11
}
```

**Status Codes:**
- 201 Created - Event created
- 400 Bad Request - Validation error

---

### Delete Event
**Endpoint:** `DELETE /admin/events/<event_id>`

**Authentication:** Required (Bearer Token)

**Parameters:**
- `event_id` (integer) - Event ID

**Description:** Delete an event and its registrations

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Status Codes:**
- 200 OK - Event deleted
- 404 Not Found - Event not found

---

### Get All Registrations (Admin)
**Endpoint:** `GET /admin/registrations`

**Authentication:** Required (Bearer Token)

**Description:** Get all registrations with details

**Response:**
```json
{
  "success": true,
  "message": "Registrations retrieved successfully",
  "registrations": [
    {
      "registration_id": 1,
      "student_id": 1,
      "student_name": "John Doe",
      "usn": "1RV19CS001",
      "event_id": 1,
      "event_name": "Tech Summit 2026",
      "registration_date": "2026-02-27T10:30:00"
    }
  ]
}
```

**Status Code:** 200 OK

---

### Delete Registration
**Endpoint:** `DELETE /admin/registrations/<registration_id>`

**Authentication:** Required (Bearer Token)

**Parameters:**
- `registration_id` (integer) - Registration ID

**Response:**
```json
{
  "success": true,
  "message": "Registration deleted successfully"
}
```

**Status Codes:**
- 200 OK - Registration deleted
- 404 Not Found - Registration not found

---

### Get All Students (Admin)
**Endpoint:** `GET /admin/students`

**Authentication:** Required (Bearer Token)

**Description:** Get all students with event count

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "students": [
    {
      "student_id": 1,
      "name": "John Doe",
      "usn": "1RV19CS001",
      "email": "john@college.edu",
      "phone": "+919876543210",
      "department": "CSE",
      "year": 2,
      "events_registered": 3
    }
  ]
}
```

**Status Code:** 200 OK

---

### Get Student Details
**Endpoint:** `GET /admin/students/<student_id>`

**Authentication:** Required (Bearer Token)

**Parameters:**
- `student_id` (integer) - Student ID

**Response:**
```json
{
  "success": true,
  "message": "Student details retrieved successfully",
  "student": {
    "student_id": 1,
    "name": "John Doe",
    ...
  },
  "registrations": [...],
  "total_events": 3
}
```

**Status Codes:**
- 200 OK - Student found
- 404 Not Found - Student not found

---

## Health Check

### Health Status
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "College Event Registration System Backend",
  "version": "1.0.0"
}
```

**Status Code:** 200 OK

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": ["error1", "error2"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token is invalid or expired"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting
Currently no rate limiting implemented. Consider adding in production.

## CORS
Cross-Origin Resource Sharing is enabled for:
- http://localhost:3000
- http://localhost:8000
- http://127.0.0.1:5000

---

**API Version:** 1.0.0  
**Last Updated:** February 27, 2026
