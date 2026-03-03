import mysql.connector
from mysql.connector import Error

try:
    conn = mysql.connector.connect(host='localhost', user='root', password='pass')
    print('connected:', conn.is_connected())
    conn.close()
except Error as e:
    print('error:', e)
