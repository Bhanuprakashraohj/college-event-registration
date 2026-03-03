// Event List Display Handler

const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    loadAndDisplayEvents();
    setupSearchFilter();
});

/**
 * Load and display all events
 */
function loadAndDisplayEvents() {
    fetch(`${API_BASE_URL}/events`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load events');
            }
            return response.json();
        })
        .then(data => {
            displayEventsGrid(data.events || []);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            const container = document.getElementById('eventsContainer');
            container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Failed to load events. Please try again later.</div></div>';
        });
}

/**
 * Display events in grid format
 */
function displayEventsGrid(events) {
    const container = document.getElementById('eventsContainer');

    if (events.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No events available at the moment.</div></div>';
        return;
    }

    let html = '';
    events.forEach(event => {
        const eventDate = new Date(event.event_date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        const formattedTime = eventDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="event-card">
                    <div class="event-card-header">
                        <h5 class="mb-2">${event.event_name}</h5>
                    </div>
                    <div class="event-card-body">
                        <div class="event-date mb-2">
                            <i class="fas fa-calendar-alt text-primary"></i> 
                            ${formattedDate} at ${formattedTime}
                        </div>
                        <div class="event-venue mb-3">
                            <i class="fas fa-map-marker-alt text-danger"></i> 
                            ${event.event_venue}
                        </div>
                        <p class="text-muted mb-3">
                            ${event.event_description.substring(0, 100)}${event.event_description.length > 100 ? '...' : ''}
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-info">
                                <i class="fas fa-users"></i> 
                                ${event.registered_count || 0} Registered
                            </span>
                            <button class="btn btn-sm btn-primary" onclick="showEventDetails(${event.event_id}, '${event.event_name}', '${event.event_date}', '${event.event_venue}', '${event.event_description}', ${event.registered_count || 0})">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Store events for filtering
    window.allEvents = events;
}

/**
 * Show event details in modal
 */
function showEventDetails(eventId, eventName, eventDate, eventVenue, eventDescription, registeredCount) {
    document.getElementById('eventTitle').textContent = eventName;
    document.getElementById('eventDate').textContent = new Date(eventDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('eventVenue').textContent = eventVenue;
    document.getElementById('eventDescription').textContent = eventDescription;
    document.getElementById('registeredCount').textContent = registeredCount || 0;

    const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
    modal.show();
}

/**
 * Setup search filter
 */
function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterEvents(searchTerm);
    });
}

/**
 * Filter events based on search term
 */
function filterEvents(searchTerm) {
    if (!window.allEvents) return;

    const filtered = window.allEvents.filter(event => {
        return event.event_name.toLowerCase().includes(searchTerm) ||
               event.event_venue.toLowerCase().includes(searchTerm) ||
               event.event_description.toLowerCase().includes(searchTerm);
    });

    displayEventsGrid(filtered);
}
