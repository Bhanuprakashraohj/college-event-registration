#!/usr/bin/env python3
"""
Seed the database with test data:
- Update admin user with correct password hash
- Insert sample events
"""

import os
import sys
import mysql.connector
from bcrypt import hashpw, gensalt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database config
DB_HOST = os.environ.get('MYSQL_HOST', 'localhost')
DB_USER = os.environ.get('MYSQL_USER', 'root')
DB_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'pass')
DB_NAME = os.environ.get('MYSQL_DB', 'college_event_registration')

def hash_password(password):
    """Hash password using bcrypt"""
    return hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

def seed_database():
    """Seed database with test data"""
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        
        cursor = conn.cursor()
        
        # Update admin user password
        admin_password_hash = hash_password('admin')
        print(f"[+] Hashing password for admin user...")
        update_admin_query = """
            UPDATE admin_users 
            SET password = %s 
            WHERE username = 'admin'
        """
        cursor.execute(update_admin_query, (admin_password_hash,))
        conn.commit()
        print(f"[✓] Admin user password updated")
        
        # Insert sample events
        events = [
            ('Tech Summit 2026', '2026-03-15 10:00:00', 'Main Auditorium', 'Annual tech conference with industry experts showcasing latest technologies'),
            ('Hackathon 2026', '2026-03-20 09:00:00', 'CSE Lab Block', '24-hour hackathon for programming enthusiasts'),
            ('Cultural Fest', '2026-03-25 14:00:00', 'Sports Ground', 'College cultural programs and performances from all departments'),
            ('Sports Week', '2026-04-01 08:00:00', 'Sports Complex', 'Inter-department sports competitions and awards'),
            ('AI & ML Workshop', '2026-04-10 10:30:00', 'Seminar Hall', 'Two-day workshop on Artificial Intelligence and Machine Learning fundamentals'),
            ('Robotics Expo', '2026-04-18 09:00:00', 'Innovation Hub', 'Showcase of robotics projects and live demonstrations'),
            ('Coding Contest', '2026-04-25 10:00:00', 'Computer Lab', 'Online competitive programming contest with prizes'),
        ]
        
        insert_events_query = """
            INSERT INTO events (event_name, event_date, event_venue, event_description) 
            VALUES (%s, %s, %s, %s)
        """
        
        for event in events:
            cursor.execute(insert_events_query, event)
        
        conn.commit()
        print(f"[✓] Inserted {len(events)} sample events")
        
        cursor.close()
        conn.close()
        
        print("\n[✓] Database seeded successfully!")
        print("\nCredentials:")
        print("  Admin Username: admin")
        print("  Admin Password: admin")
        print("\nYou can now log in to the admin dashboard.")
        return True
        
    except Exception as e:
        print(f"[✗] Error seeding database: {e}")
        return False

if __name__ == '__main__':
    if not seed_database():
        sys.exit(1)
