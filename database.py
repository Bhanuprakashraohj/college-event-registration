"""
College Event Registration System - Database Connection Module
"""

import mysql.connector
from mysql.connector import Error
from datetime import datetime
import json

class DatabaseConnection:
    """Manages MySQL database connections"""
    
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
    
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                autocommit=True,
                charset='utf8mb4',
                use_unicode=True
            )
            return self.connection
        except Error as err:
            if err.errno == 2003:
                raise Exception("Cannot connect to MySQL database. Please ensure MySQL is running.")
            elif err.errno == 1049:
                raise Exception(f"Database '{self.database}' does not exist.")
            else:
                raise Exception(f"Database connection error: {err}")
    
    def disconnect(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
    
    def get_cursor(self):
        """Get database cursor"""
        if not self.connection or not self.connection.is_connected():
            self.connect()
        return self.connection.cursor(dictionary=True)
    
    def execute_query(self, query, params=None):
        """Execute SELECT query"""
        cursor = None
        try:
            cursor = self.get_cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            return cursor.fetchall()
        except Error as err:
            raise Exception(f"Query execution error: {err}")
        finally:
            if cursor:
                cursor.close()
    
    def execute_insert(self, query, params=None):
        """Execute INSERT query and return last insert id"""
        cursor = None
        try:
            cursor = self.get_cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.connection.commit()
            return cursor.lastrowid
        except Error as err:
            self.connection.rollback()
            raise Exception(f"Insert error: {err}")
        finally:
            if cursor:
                cursor.close()
    
    def execute_update(self, query, params=None):
        """Execute UPDATE query"""
        cursor = None
        try:
            cursor = self.get_cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.connection.commit()
            return cursor.rowcount
        except Error as err:
            self.connection.rollback()
            raise Exception(f"Update error: {err}")
        finally:
            if cursor:
                cursor.close()
    
    def execute_delete(self, query, params=None):
        """Execute DELETE query"""
        cursor = None
        try:
            cursor = self.get_cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.connection.commit()
            return cursor.rowcount
        except Error as err:
            self.connection.rollback()
            raise Exception(f"Delete error: {err}")
        finally:
            if cursor:
                cursor.close()
    
    def close(self):
        """Close the connection"""
        self.disconnect()


# Global database instance
db = None

def init_db(host, user, password, database):
    """Initialize global database connection"""
    global db
    db = DatabaseConnection(host, user, password, database)
    db.connect()
    return db

def get_db():
    """Get global database instance"""
    global db
    if db is None:
        raise Exception("Database not initialized. Call init_db() first.")
    return db
