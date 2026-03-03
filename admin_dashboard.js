// Admin Dashboard Handler

const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadDashboardStats();
    loadEvents();
    loadRegistrations();
    loadStudents();
    setupAddEventForm();
    setupLogout();
});

/**
 * Check if admin is authenticated
 */
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    const adminName = localStorage.getItem('adminName');
    
    if (!token) {
        window.location.href = 'admin_login.html';
        return;
    }

    if (adminName) {
        document.getElementById('adminName').textContent = adminName;
    }
}

/**
 * Setup logout functionality
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        window.location.href = 'admin_login.html';
    });
}

/**
 * Load dashboard statistics
 */
function loadDashboardStats() {
    const token = localStorage.getItem('adminToken');

    fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load stats');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('totalEvents').textContent = data.total_events || 0;
        document.getElementById('totalRegistrations').textContent = data.total_registrations || 0;
        document.getElementById('totalStudents').textContent = data.total_students || 0;
        document.getElementById('todayRegistrations').textContent = data.today_registrations || 0;
    })
    .catch(error => {
        console.error('Error loading stats:', error);
    });
}

/**
 * Load events for management
 */
function loadEvents() {
    const token = localStorage.getItem('adminToken');
    const tbody = document.getElementById('eventsTableBody');

    fetch(`${API_BASE_URL}/admin/events`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load events');
        }
        return response.json();
    })
    .then(data => {
        displayEventsTable(data.events || []);
    })
    .catch(error => {
        console.error('Error loading events:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load events</td></tr>';
    });
}

/**
 * Display events in table
 */
function displayEventsTable(events) {
    const tbody = document.getElementById('eventsTableBody');

    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No events found</td></tr>';
        return;
    }

    let html = '';
    events.forEach(event => {
        const eventDate = new Date(event.event_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        html += `
            <tr>
                <td>${event.event_id}</td>
                <td>${event.event_name}</td>
                <td>${eventDate}</td>
                <td>${event.event_venue}</td>
                <td><span class="badge bg-info">${event.registered_count || 0}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteEvent(${event.event_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Load registrations
 */
function loadRegistrations() {
    const token = localStorage.getItem('adminToken');
    const tbody = document.getElementById('registrationsTableBody');

    fetch(`${API_BASE_URL}/admin/registrations`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load registrations');
        }
        return response.json();
    })
    .then(data => {
        displayRegistrationsTable(data.registrations || []);
    })
    .catch(error => {
        console.error('Error loading registrations:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load registrations</td></tr>';
    });
}

/**
 * Display registrations in table
 */
function displayRegistrationsTable(registrations) {
    const tbody = document.getElementById('registrationsTableBody');

    if (registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No registrations found</td></tr>';
        return;
    }

    let html = '';
    registrations.forEach(reg => {
        const regDate = new Date(reg.registration_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        html += `
            <tr>
                <td>${reg.registration_id}</td>
                <td>${reg.student_name}</td>
                <td>${reg.usn}</td>
                <td>${reg.event_name}</td>
                <td>${regDate}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteRegistration(${reg.registration_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Load students
 */
function loadStudents() {
    const token = localStorage.getItem('adminToken');
    const tbody = document.getElementById('studentsTableBody');

    fetch(`${API_BASE_URL}/admin/students`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load students');
        }
        return response.json();
    })
    .then(data => {
        displayStudentsTable(data.students || []);
    })
    .catch(error => {
        console.error('Error loading students:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Failed to load students</td></tr>';
    });
}

/**
 * Display students in table
 */
function displayStudentsTable(students) {
    const tbody = document.getElementById('studentsTableBody');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No students found</td></tr>';
        return;
    }

    let html = '';
    students.forEach(student => {
        html += `
            <tr>
                <td>${student.student_id}</td>
                <td>${student.name}</td>
                <td>${student.usn}</td>
                <td>${student.email}</td>
                <td>${student.department}</td>
                <td>${student.year}</td>
                <td><span class="badge bg-success">${student.events_registered || 0}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Setup add event form
 */
function setupAddEventForm() {
    const saveBtn = document.getElementById('saveEventBtn');
    
    saveBtn.addEventListener('click', function() {
        const form = document.getElementById('addEventForm');
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;
        const eventVenue = document.getElementById('eventVenue').value;
        const eventDescription = document.getElementById('eventDescription').value;

        // Validate form
        const errors = validator.validateEventForm(eventName, eventDate, eventVenue, eventDescription);
        if (errors.length > 0) {
            validator.showAlert('danger', errors.join('\n'));
            return;
        }

        addEvent(eventName, eventDate, eventVenue, eventDescription);
    });
}

/**
 * Add new event
 */
function addEvent(eventName, eventDate, eventVenue, eventDescription) {
    const token = localStorage.getItem('adminToken');
    const saveBtn = document.getElementById('saveEventBtn');
    const originalText = saveBtn.innerHTML;

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    fetch(`${API_BASE_URL}/admin/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            event_name: eventName,
            event_date: eventDate,
            event_venue: eventVenue,
            event_description: eventDescription
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message || 'Failed to add event');
            });
        }
        return response.json();
    })
    .then(data => {
        validator.showAlert('success', 'Event added successfully!');
        document.getElementById('addEventForm').reset();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
        modal.hide();

        // Reload events
        loadEvents();
        loadDashboardStats();
    })
    .catch(error => {
        console.error('Error:', error);
        validator.showAlert('danger', error.message || 'Failed to add event');
    })
    .finally(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    });
}

/**
 * Delete event
 */
function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    const token = localStorage.getItem('adminToken');

    fetch(`${API_BASE_URL}/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete event');
        }
        return response.json();
    })
    .then(data => {
        validator.showAlert('success', 'Event deleted successfully!');
        loadEvents();
        loadDashboardStats();
    })
    .catch(error => {
        console.error('Error:', error);
        validator.showAlert('danger', 'Failed to delete event');
    });
}

/**
 * Delete registration
 */
function deleteRegistration(registrationId) {
    if (!confirm('Are you sure you want to delete this registration?')) {
        return;
    }

    const token = localStorage.getItem('adminToken');

    fetch(`${API_BASE_URL}/admin/registrations/${registrationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete registration');
        }
        return response.json();
    })
    .then(data => {
        validator.showAlert('success', 'Registration deleted successfully!');
        loadRegistrations();
        loadDashboardStats();
    })
    .catch(error => {
        console.error('Error:', error);
        validator.showAlert('danger', 'Failed to delete registration');
    });
}
