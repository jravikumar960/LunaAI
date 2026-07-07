import sqlite3

DB = "luna.db"


def init_memory():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memories(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE,
            value TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_memory(key: str, value: str):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO memories(key, value)
        VALUES(?, ?)
    """, (key, value))

    conn.commit()
    conn.close()


def get_memory(key: str):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT value
        FROM memories
        WHERE key=?
    """, (key,))

    row = cursor.fetchone()

    conn.close()

    if row:
        return row[0]

    return None


def get_all_memory():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT key, value
        FROM memories
        ORDER BY key
    """)

    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "key": row[0],
            "value": row[1]
        }
        for row in rows
    ]


def delete_memory(key: str):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM memories
        WHERE key=?
    """, (key,))

    conn.commit()
    conn.close()


def clear_memory():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM memories
    """)

    conn.commit()
    conn.close()
