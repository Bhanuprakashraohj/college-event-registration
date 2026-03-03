"""
College Event Registration System - API Routes for Admin Functions
"""

from flask import Blueprint, request
from app.models import Student, Event, Registration, AdminUser
from app.utils.helpers import (
    Validator, APIResponse, PasswordManager, JWTManager, token_required
)

admin_bp = Blueprint('api_admin', __name__, url_prefix='/api/admin')

# Admin Authentication Routes
@admin_bp.route('/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'username' not in data or 'password' not in data:
            return APIResponse.error('Username and password are required', 400)
        
        # Get admin by username
        admin = AdminUser.get_by_username(data['username'])
        if not admin:
            return APIResponse.error('Invalid credentials', 401)
        
        # Verify password
        if not PasswordManager.verify_password(data['password'], admin['password']):
            return APIResponse.error('Invalid credentials', 401)
        
        # Create JWT token
        token = JWTManager.create_token({
            'admin_id': admin['admin_id'],
            'username': admin['username']
        })
        
        return APIResponse.success(
            'Login successful',
            {
                'token': token,
                'admin_id': admin['admin_id'],
                'admin_name': admin['admin_name']
            }
        )
    
    except Exception as e:
        return APIResponse.error(str(e), 500)


# Admin Statistics Routes
@admin_bp.route('/stats', methods=['GET'])
@token_required
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        # Get total events
        events = Event.get_all()
        total_events = len(events)
        
        # Get total registrations
        registrations = Registration.get_all()
        total_registrations = len(registrations)
        
        # Get total students
        students = Student.get_all()
        total_students = len(students)
        
        # Get today's registrations count
        from datetime import datetime, date
        today_count = sum(1 for reg in registrations 
                         if reg['registration_date'].date() == date.today())
        
        return APIResponse.success(
            'Dashboard statistics retrieved successfully',
            {
                'total_events': total_events,
                'total_registrations': total_registrations,
                'total_students': total_students,
                'today_registrations': today_count
            }
        )
    
    except Exception as e:
        return APIResponse.error(str(e), 500)


# Admin Event Management Routes
@admin_bp.route('/events', methods=['GET'])
@token_required
def get_all_events():
    """Get all events for admin"""
    try:
        events = Event.get_all()
        return APIResponse.success('Events retrieved successfully', {'events': events})
    except Exception as e:
        return APIResponse.error(str(e), 500)


@admin_bp.route('/events', methods=['POST'])
@token_required
def create_event():
    """Create new event"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['event_name', 'event_date', 'event_venue', 'event_description']
        for field in required_fields:
            if field not in data:
                return APIResponse.error(f'{field} is required', 400)
        
        # Validate inputs
        is_valid, error = Validator.validate_event_name(data['event_name'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_event_date(data['event_date'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_venue(data['event_venue'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_description(data['event_description'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        # Create event
        event_id = Event.create(
            data['event_name'],
            data['event_date'],
            data['event_venue'],
            data['event_description']
        )
        
        return APIResponse.success(
            'Event created successfully',
            {'event_id': event_id},
            201
        )
    
    except Exception as e:
        return APIResponse.error(str(e), 500)


@admin_bp.route('/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(event_id):
    """Delete event"""
    try:
        event = Event.get_by_id(event_id)
        if not event:
            return APIResponse.error('Event not found', 404)
        
        Event.delete(event_id)
        return APIResponse.success('Event deleted successfully')
    
    except Exception as e:
        return APIResponse.error(str(e), 500)


# Admin Registration Viewing Routes
@admin_bp.route('/registrations', methods=['GET'])
@token_required
def get_all_registrations():
    """Get all registrations"""
    try:
        registrations = Registration.get_all()
        return APIResponse.success(
            'Registrations retrieved successfully',
            {'registrations': registrations}
        )
    except Exception as e:
        return APIResponse.error(str(e), 500)


@admin_bp.route('/registrations/<int:registration_id>', methods=['DELETE'])
@token_required
def delete_registration(registration_id):
    """Delete registration"""
    try:
        registration = Registration.get_by_id(registration_id)
        if not registration:
            return APIResponse.error('Registration not found', 404)
        
        Registration.delete(registration_id)
        return APIResponse.success('Registration deleted successfully')
    
    except Exception as e:
        return APIResponse.error(str(e), 500)


# Admin Student Viewing Routes
@admin_bp.route('/students', methods=['GET'])
@token_required
def get_all_students():
    """Get all students"""
    try:
        # Execute custom query to get students with event count
        from app.database import get_db
        db = get_db()
        query = """
            SELECT s.*, COUNT(r.registration_id) as events_registered
            FROM students s
            LEFT JOIN registrations r ON s.student_id = r.student_id
            GROUP BY s.student_id
            ORDER BY s.created_at DESC
        """
        students = db.execute_query(query)
        
        return APIResponse.success(
            'Students retrieved successfully',
            {'students': students}
        )
    except Exception as e:
        return APIResponse.error(str(e), 500)


@admin_bp.route('/students/<int:student_id>', methods=['GET'])
@token_required
def get_student_details(student_id):
    """Get student details"""
    try:
        student = Student.get_by_id(student_id)
        if not student:
            return APIResponse.error('Student not found', 404)
        
        registrations = Registration.get_by_student(student_id)
        
        return APIResponse.success(
            'Student details retrieved successfully',
            {
                'student': student,
                'registrations': registrations,
                'total_events': len(registrations)
            }
        )
    except Exception as e:
        return APIResponse.error(str(e), 500)
