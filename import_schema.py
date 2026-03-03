import os
import mysql.connector
from mysql.connector import errorcode

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(ROOT, ".env")
SCHEMA_PATH = os.path.abspath(os.path.join(ROOT, "..", "database", "schema", "database_schema.sql"))

def load_env(path):
    env = {}
    if not os.path.exists(path):
        return env
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def main():
    env = load_env(ENV_PATH)
    host = env.get('MYSQL_HOST', 'localhost')
    user = env.get('MYSQL_USER', 'root')
    password = env.get('MYSQL_PASSWORD', '')
    dbname = env.get('MYSQL_DB', 'college_event')

    print(f"Using DB host={host} user={user} db={dbname}")

    try:
        conn = mysql.connector.connect(host=host, user=user, password=password)
    except mysql.connector.Error as err:
        print("Error: could not connect to MySQL server:", err)
        return 1

    cursor = conn.cursor()
    try:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {dbname} DEFAULT CHARACTER SET 'utf8mb4'")
        print(f"Database '{dbname}' ensured.")
    except mysql.connector.Error as err:
        print(f"Failed creating database: {err}")
        cursor.close()
        conn.close()
        return 1

    try:
        conn.database = dbname
    except mysql.connector.Error as err:
        print(err)
        cursor.close()
        conn.close()
        return 1

    if not os.path.exists(SCHEMA_PATH):
        print(f"Schema file not found: {SCHEMA_PATH}")
        cursor.close()
        conn.close()
        return 1

    print(f"Importing schema from {SCHEMA_PATH} ...")
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        sql = f.read()

    try:
        for result in cursor.execute(sql, multi=True):
            pass
        conn.commit()
        print("Schema imported successfully.")
    except mysql.connector.Error as err:
        print("Failed executing schema SQL:", err)
        cursor.close()
        conn.close()
        return 1

    cursor.close()
    conn.close()
    return 0


if __name__ == '__main__':
    exit(main())
