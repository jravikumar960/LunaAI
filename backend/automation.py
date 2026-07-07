import sqlite3

DB = "luna.db"


def init_automation():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS automation(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        remind_at TEXT
    )
    """)

    conn.commit()
    conn.close()


def add_automation(title, remind_at):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO automation(title, remind_at)
    VALUES(?, ?)
    """, (title, remind_at))

    conn.commit()
    conn.close()


def get_automation():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, title, remind_at
    FROM automation
    ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "remind_at": row[2]
        }
        for row in rows
    ]


def delete_automation(reminder_id):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
    DELETE FROM automation
    WHERE id=?
    """, (reminder_id,))

    conn.commit()
    conn.close()