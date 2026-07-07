import sqlite3

DB = "luna.db"


def init_documents():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            content TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def save_document(filename, content):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO documents(filename, content)
        VALUES(?, ?)
        """,
        (filename, content),
    )

    conn.commit()
    conn.close()


def get_documents():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, filename
        FROM documents
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "id": row[0],
            "filename": row[1],
        }
        for row in rows
    ]


def get_document(doc_id):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, filename, content
        FROM documents
        WHERE id=?
        """,
        (doc_id,),
    )

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return None

    return {
        "id": row[0],
        "filename": row[1],
        "content": row[2],
    }


def delete_document(doc_id):
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM documents WHERE id=?",
        (doc_id,),
    )

    conn.commit()
    conn.close()

def clear_documents():
    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM documents
    """)

    conn.commit()
    conn.close()