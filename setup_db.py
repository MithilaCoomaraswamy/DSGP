import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect("terms.db")  # This creates 'terms.db' file in your project folder
cursor = conn.cursor()

# Create a table for storing terms
cursor.execute("CREATE TABLE IF NOT EXISTS terms (word TEXT)")

# Insert example terms (only if they are not already in the database)
terms = [("pcos",), ("ovulation",), ("hormones",), ("insulin",), ("cysts",), ("menstrual cycle",)]
cursor.executemany("INSERT INTO terms (word) VALUES (?)", terms)

# Save and close connection
conn.commit()
conn.close()

print("✅ Database setup complete! Terms added.")
