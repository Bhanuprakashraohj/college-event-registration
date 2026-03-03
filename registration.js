// Student Registration Form Handler

const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupFormHandlers();
});

/**
 * Load events from backend API
 */
function loadEvents() {
    const eventsList = document.getElementById('eventsList');
    
    fetch(`${API_BASE_URL}/events`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load events');
            }
            return response.json();
        })
        .then(data => {
            displayEvents(data.events || []);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            eventsList.innerHTML = '<div class="alert alert-danger">Failed to load events. Please try again later.</div>';
        });
}

/**
 * Display events with checkboxes
 */
function displayEvents(events) {
    const eventsList = document.getElementById('eventsList');
    
    if (events.length === 0) {
        eventsList.innerHTML = '<div class="alert alert-info">No events available at the moment.</div>';
        return;
    }

    let html = '';
    events.forEach(event => {
        html += `
            <div class="event-checkbox">
                <input type="checkbox" id="event_${event.event_id}" name="events" value="${event.event_id}" class="form-check-input">
                <label for="event_${event.event_id}" class="form-check-label">
                    <strong>${event.event_name}</strong><br>
                    <small class="text-muted">
                        <i class="fas fa-calendar"></i> ${formatDate(event.event_date)} | 
                        <i class="fas fa-map-marker-alt"></i> ${event.event_venue}
                    </small>
                </label>
            </div>
        `;
    });

    eventsList.innerHTML = html;
}

/**
 * Format date string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Setup form submission handler
 */
function setupFormHandlers() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        validator.clearErrors();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            usn: document.getElementById('usn').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            department: document.getElementById('department').value,
            year: document.getElementById('year').value,
            events: getSelectedEvents()
        };

        // Validate form
        if (!validateRegistrationForm(formData)) {
            validator.showAlert('danger', 'Please correct the errors in the form');
            return;
        }

        // Submit form
        submitRegistration(formData);
    });

    // Real-time validation
    document.getElementById('name').addEventListener('blur', function() {
        const error = validator.validateName(this.value);
        validator.displayError('nameFeedback', error);
    });

    document.getElementById('usn').addEventListener('blur', function() {
        const error = validator.validateUSN(this.value);
        validator.displayError('usnFeedback', error);
    });

    document.getElementById('email').addEventListener('blur', function() {
        const error = validator.validateEmail(this.value);
        validator.displayError('emailFeedback', error);
    });

    document.getElementById('phone').addEventListener('blur', function() {
        const error = validator.validatePhone(this.value);
        validator.displayError('phoneFeedback', error);
    });

    document.getElementById('department').addEventListener('change', function() {
        const error = validator.validateDepartment(this.value);
        validator.displayError('departmentFeedback', error);
    });

    document.getElementById('year').addEventListener('change', function() {
        const error = validator.validateYear(this.value);
        validator.displayError('yearFeedback', error);
    });
}

/**
 * Get selected events
 */
function getSelectedEvents() {
    const checkboxes = document.querySelectorAll('input[name="events"]:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

/**
 * Validate registration form
 */
function validateRegistrationForm(formData) {
    let isValid = true;

    const nameError = validator.validateName(formData.name);
    if (nameError) {
        validator.displayError('nameFeedback', nameError);
        isValid = false;
    }

    const usnError = validator.validateUSN(formData.usn);
    if (usnError) {
        validator.displayError('usnFeedback', usnError);
        isValid = false;
    }

    const emailError = validator.validateEmail(formData.email);
    if (emailError) {
        validator.displayError('emailFeedback', emailError);
        isValid = false;
    }

    const phoneError = validator.validatePhone(formData.phone);
    if (phoneError) {
        validator.displayError('phoneFeedback', phoneError);
        isValid = false;
    }

    const departmentError = validator.validateDepartment(formData.department);
    if (departmentError) {
        validator.displayError('departmentFeedback', departmentError);
        isValid = false;
    }

    const yearError = validator.validateYear(formData.year);
    if (yearError) {
        validator.displayError('yearFeedback', yearError);
        isValid = false;
    }

    const eventsError = validator.validateEvents(formData.events);
    if (eventsError) {
        validator.displayError('eventsFeedback', eventsError);
        isValid = false;
    }

    return isValid;
}

/**
 * Submit registration to backend
 */
function submitRegistration(formData) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            usn: formData.usn,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            year: parseInt(formData.year),
            event_ids: formData.events
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message || 'Registration failed');
            });
        }
        return response.json();
    })
    .then(data => {
        // Store success data in session storage
        sessionStorage.setItem('registrationData', JSON.stringify({
            name: formData.name,
            usn: formData.usn,
            email: formData.email,
            events: formData.events.length,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        // Redirect to success page
        window.location.href = 'success.html';
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Check for specific error messages
        if (error.message.includes('duplicate')) {
            validator.showAlert('warning', 'You have already registered for this event');
        } else {
            validator.showAlert('danger', error.message || 'An error occurred during registration. Please try again.');
        }
    });
}
