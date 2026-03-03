"""
College Event Registration System - Main Flask Application
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load .env from backend directory (if present)
load_dotenv()

from config import Config, get_config
from app.database import init_db
from app.routes.events import event_bp
from app.routes.registrations import registration_bp
from app.routes.admin import admin_bp

def create_app(config_env='development'):
    """Flask application factory"""
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    config = get_config(config_env)
    app.config.from_object(config)
    
    # Initialize database
    try:
        init_db(
            config.MYSQL_HOST,
            config.MYSQL_USER,
            config.MYSQL_PASSWORD,
            config.MYSQL_DB
        )
    except Exception as e:
        print(f"Database initialization error: {e}")
        return None
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": config.CORS_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(event_bp)
    app.register_blueprint(registration_bp)
    app.register_blueprint(admin_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'College Event Registration System Backend',
            'version': '1.0.0'
        }), 200
    
    # 404 handler
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Resource not found'
        }), 404
    
    # 500 handler
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
    
    return app


if __name__ == '__main__':
    # Create and run app
    app = create_app(os.environ.get('FLASK_ENV', 'development'))
    if app:
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True
        )
