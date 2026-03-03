-- College Event Registration System Database Schema
-- MySQL Database Creation and Table Setup

-- Create Database
CREATE DATABASE IF NOT EXISTS college_event_registration;
USE college_event_registration;

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    usn VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year INT NOT NULL CHECK (year >= 1 AND year <= 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usn (usn),
    INDEX idx_email (email),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    event_venue VARCHAR(200) NOT NULL,
    event_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_event_name (event_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_event (student_id, event_id),
    INDEX idx_student_id (student_id),
    INDEX idx_event_id (event_id),
    INDEX idx_registration_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password, admin_name, email) VALUES 
('admin', '$2b$12$YourHashedPasswordHere', 'Administrator', 'admin@college.edu');

-- Create views for easier querying
CREATE OR REPLACE VIEW registration_summary AS
SELECT 
    r.registration_id,
    s.student_id,
    s.name AS student_name,
    s.usn,
    s.email,
    s.phone,
    s.department,
    s.year,
    e.event_id,
    e.event_name,
    e.event_date,
    e.event_venue,
    r.registration_date
FROM registrations r
JOIN students s ON r.student_id = s.student_id
JOIN events e ON r.event_id = e.event_id
ORDER BY r.registration_date DESC;

-- Create view for event registration count
CREATE OR REPLACE VIEW event_registration_count AS
SELECT 
    e.event_id,
    e.event_name,
    e.event_date,
    e.event_venue,
    e.event_description,
    COUNT(r.registration_id) AS registered_count
FROM events e
LEFT JOIN registrations r ON e.event_id = r.event_id
GROUP BY e.event_id, e.event_name, e.event_date, e.event_venue, e.event_description
ORDER BY e.event_date;

-- Create view for student event count
CREATE OR REPLACE VIEW student_event_count AS
SELECT 
    s.student_id,
    s.name,
    s.usn,
    s.email,
    s.department,
    s.year,
    COUNT(r.registration_id) AS events_registered
FROM students s
LEFT JOIN registrations r ON s.student_id = r.student_id
GROUP BY s.student_id, s.name, s.usn, s.email, s.department, s.year;
