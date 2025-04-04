import sqlite3

db_path = "medical_terms.db"  # Make sure this path is correct

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if the table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='medical_terms';")
    table_exists = cursor.fetchone()

    if table_exists:
        print("✅ The 'medical_terms' table exists!")

        # Retrieve inserted terms
        cursor.execute("SELECT * FROM medical_terms;")
        rows = cursor.fetchall()

        print("📜 Medical Terms in Database:")
        for row in rows:
            print(row)
    else:
        print("❌ The 'medical_terms' table does not exist.")

except sqlite3.Error as e:
    print(f"Database error: {e}")
finally:
    conn.close()
