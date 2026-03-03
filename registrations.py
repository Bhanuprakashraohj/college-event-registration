"""
College Event Registration System - API Routes for Registrations
"""

from flask import Blueprint, request
from app.models import Student, Event, Registration
from app.utils.helpers import Validator, APIResponse

registration_bp = Blueprint('api_registrations', __name__, url_prefix='/api/registrations')

@registration_bp.route('', methods=['POST'])
def create_registration():
    """Create new student registration"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'usn', 'email', 'phone', 'department', 'year', 'event_ids']
        for field in required_fields:
            if field not in data:
                return APIResponse.error(f'{field} is required', 400)
        
        # Validate inputs
        is_valid, error = Validator.validate_name(data['name'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_usn(data['usn'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_email(data['email'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_phone(data['phone'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_department(data['department'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        is_valid, error = Validator.validate_year(data['year'])
        if not is_valid:
            return APIResponse.error(error, 400)
        
        if not data['event_ids'] or not isinstance(data['event_ids'], list) or len(data['event_ids']) == 0:
            return APIResponse.error('At least one event must be selected', 400)
        
        # Check if student already exists
        existing_student = Student.get_by_usn(data['usn'])
        if existing_student:
            student_id = existing_student['student_id']
            # Check for duplicate registrations
            for event_id in data['event_ids']:
                if Registration.exists(student_id, event_id):
                    return APIResponse.error('You have already registered for this event', 400)
        else:
            # Create new student
            student_id = Student.create(
                data['name'],
                data['usn'],
                data['email'],
                data['phone'],
                data['department'],
                data['year']
            )
        
        # Register for events
        registration_ids = []
        for event_id in data['event_ids']:
            # Verify event exists
            event = Event.get_by_id(event_id)
            if not event:
                return APIResponse.error(f'Event with ID {event_id} not found', 404)
            
            reg_id = Registration.create(student_id, event_id)
            registration_ids.append(reg_id)
        
        return APIResponse.success(
            'Registration successful',
            {
                'student_id': student_id,
                'registration_ids': registration_ids,
                'number_of_events': len(registration_ids)
            },
            201
        )
    
    except Exception as e:
        return APIResponse.error(str(e), 500)


@registration_bp.route('/<int:registration_id>', methods=['GET'])
def get_registration(registration_id):
    """Get specific registration"""
    try:
        registration = Registration.get_by_id(registration_id)
        if not registration:
            return APIResponse.error('Registration not found', 404)
        
        return APIResponse.success('Registration retrieved successfully', {'registration': registration})
    except Exception as e:
        return APIResponse.error(str(e), 500)


@registration_bp.route('/student/<int:student_id>', methods=['GET'])
def get_student_registrations(student_id):
    """Get all registrations for a student"""
    try:
        student = Student.get_by_id(student_id)
        if not student:
            return APIResponse.error('Student not found', 404)
        
        registrations = Registration.get_by_student(student_id)
        return APIResponse.success(
            'Student registrations retrieved successfully',
            {
                'student_id': student_id,
                'student_name': student['name'],
                'registrations': registrations
            }
        )
    except Exception as e:
        return APIResponse.error(str(e), 500)
