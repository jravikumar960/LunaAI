import sqlite3

DB_NAME = "luna.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_database():
    conn = get_connection()
    cursor = conn.cursor()

    # Chat History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Uploaded Documents
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


# -----------------------
# Chat
# -----------------------

def save_message(role, content):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO messages(role,content) VALUES(?,?)",
        (role, content),
    )

    conn.commit()
    conn.close()


def get_messages():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT role,content
        FROM messages
        ORDER BY id
    """)

    rows = cursor.fetchall()

    conn.close()

    return rows


# -----------------------
# Documents
# -----------------------

def save_document(filename, filepath):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO documents(filename, filepath)
        VALUES(?,?)
        """,
        (filename, filepath),
    )

    conn.commit()
    conn.close()


def get_documents():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, filename
        FROM documents
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    documents = []

    for row in rows:
        documents.append({
            "id": row[0],
            "filename": row[1]
        })

    return documents
def get_document(doc_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, filename, filepath
        FROM documents
        WHERE id=?
    """, (doc_id,))

    row = cursor.fetchone()

    conn.close()

    if not row:
        return None

    return {
        "id": row[0],
        "filename": row[1],
        "filepath": row[2],
    }


def delete_document(doc_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM documents WHERE id=?",
        (doc_id,),
    )

    conn.commit()
    conn.close()

def clear_messages():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM messages
    """)

    conn.commit()
    conn.close()