import sqlite3

# Path to your database file
db_path = "actions/medical_terms.db"

# Connect to the SQLite database (it will create the file if it doesn't exist)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create the medical_terms table if it doesn't already exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS medical_terms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        term TEXT UNIQUE NOT NULL
    )
""")

# List of medical terms to insert
medical_terms = [
    "PCOS", "ovulation", "hormonal imbalance", "estrogen", "testosterone",
    "menstrual cycle", "infertility", "follicle", "cysts", "androgen",
    "insulin resistance", "weight gain", "acne", "irregular periods",
    "metformin", "birth control", "lifestyle changes", "hirsutism",
    "ultrasound", "ovarian dysfunction", "reproductive health"
]

# Insert medical terms into the table
for term in medical_terms:
    try:
        cursor.execute("INSERT OR IGNORE INTO medical_terms (term) VALUES (?)", (term,))
    except sqlite3.IntegrityError:
        # Handle the case where the term already exists
        print(f"Term '{term}' already exists in the database.")

# Commit the changes
conn.commit()

# Verify by selecting all rows and printing them
cursor.execute("SELECT * FROM medical_terms")
rows = cursor.fetchall()
for row in rows:
    print(row)

# Close the connection
conn.close()
