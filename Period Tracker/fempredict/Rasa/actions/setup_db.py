import sqlite3

# Path to your database file
db_path = "actions/medical_terms.db"

# Connect to the SQLite database (it will create the file if it doesn't exist)
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    print(f"Connected to database: {db_path}")
except sqlite3.Error as e:
    print(f"Failed to connect to the database: {e}")
    exit(1)

# Create the medical_terms table if it doesn't already exist
try:
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medical_terms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            term TEXT UNIQUE NOT NULL
        )
    """)
    print("Database setup: medical_terms table created if not already existing.")
except sqlite3.Error as e:
    print(f"Error creating table: {e}")
    conn.close()
    exit(1)

# List of medical terms to insert
medical_terms = [
    "pcos", "ovulation", "hormonal imbalance", "estrogen", "testosterone",
    "menstrual cycle", "infertility", "follicle", "cysts", "androgen",
    "insulin resistance", "weight gain", "acne", "irregular periods",
    "metformin", "birth control", "lifestyle changes", "hirsutism",
    "ultrasound", "ovarian dysfunction", "reproductive health"
]

# Insert medical terms into the table
for term in medical_terms:
    try:
        cursor.execute("INSERT OR IGNORE INTO medical_terms (term) VALUES (?)", (term,))
        print(f" {term}")
    except sqlite3.IntegrityError:
        # Handle the case where the term already exists
        print(f"Term '{term}' already exists in the database.")
    except sqlite3.Error as e:
        print(f"Error inserting term '{term}': {e}")

# Commit the changes
try:
    conn.commit()
    print("Database setup: terms inserted successfully.")
except sqlite3.Error as e:
    print(f"Error committing changes: {e}")
    conn.rollback()

# Close the connection
conn.close()
print("Connection closed.")