import sqlite3
import os

# Get the absolute path to the database file
db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "medical_terms.db"))

# Ensure the directory exists
db_directory = os.path.dirname(db_path)
if not os.path.exists(db_directory):
    os.makedirs(db_directory)

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check if the table exists, if not, create it
cursor.execute("""SELECT name FROM sqlite_master WHERE type='table' AND name='medical_terms';""")
if cursor.fetchone() is None:
    print("⚠️ Table 'medical_terms' not found, creating it.")
    cursor.execute("""
        CREATE TABLE medical_terms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            term TEXT UNIQUE NOT NULL,
            corrected_term TEXT
        )
    """)
else:
    print("✅ Table 'medical_terms' already exists.")

# List of medical terms to insert
medical_terms = [
    ("PCOS", "PCOS"),
    ("pcos", "pcos"),
    ("hormonal imbalance", "hormonal imbalance"),
    ("ovulation", "ovulation"),
    ("endometriosis", "endometriosis"),
    ("menstrual cycle", "menstrual cycle"),
    ("infertility", "infertility"),
    ("cysts", "cysts"),
    ("androgen", "androgen"),
    ("insulin resistance", "insulin resistance"),
    ("weight gain", "weight gain"),
    ("acne", "acne"),
    ("irregular periods", "irregular periods"),
    ("birth control", "birth control"),
    ("metformin", "metformin"),
    ("lifestyle changes", "lifestyle changes"),
    ("hirsutism", "hirsutism"),
    ("ultrasound", "ultrasound"),
    ("reproductive health", "reproductive health")
]

# Insert or update the terms into the table
for term, corrected_term in medical_terms:
    cursor.execute("""
        INSERT INTO medical_terms (term, corrected_term)
        VALUES (?, ?)
        ON CONFLICT(term) DO UPDATE SET corrected_term = excluded.corrected_term
    """, (term, corrected_term))

# Commit changes and close the connection
conn.commit()
conn.close()

print("✅ Database setup completed successfully!")