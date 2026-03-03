"""
College Event Registration System - API Routes for Events
"""

from flask import Blueprint, request
from app.models import Event
from app.utils.helpers import Validator, APIResponse, token_required

event_bp = Blueprint('api_events', __name__, url_prefix='/api/events')

@event_bp.route('', methods=['GET'])
def get_events():
    """Get all events"""
    try:
        events = Event.get_all()
        return APIResponse.success(
            'Events retrieved successfully',
            {'events': events}
        )
    except Exception as e:
        return APIResponse.error(str(e), 500)


@event_bp.route('/upcoming', methods=['GET'])
def get_upcoming_events():
    """Get upcoming events"""
    try:
        events = Event.get_upcoming()
        return APIResponse.success(
            'Upcoming events retrieved successfully',
            {'events': events}
        )
    except Exception as e:
        return APIResponse.error(str(e), 500)


@event_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Get specific event"""
    try:
        event = Event.get_by_id(event_id)
        if not event:
            return APIResponse.error('Event not found', 404)
        
        return APIResponse.success('Event retrieved successfully', {'event': event})
    except Exception as e:
        return APIResponse.error(str(e), 500)
