import sqlite3
from rapidfuzz import process  # Ensure rapidfuzz is installed


# Load medical terms from the database
def load_medical_terms():
    db_path = "actions/medical_terms.db"
    conn = None
    terms = []

    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Execute SQL query to fetch all terms from the database
        cursor.execute("SELECT term FROM medical_terms")
        rows = cursor.fetchall()

        # Extract terms from the query result
        terms = [row[0] for row in rows]
        print(f"Loaded terms from the database: {terms}")  # Debugging output
        return terms

    except sqlite3.Error as e:
        print(f"Error loading medical terms from database: {e}")
    finally:
        # Close the connection to the database if it was opened
        if conn:
            conn.close()

    return terms


# Corrects typos using fuzzy matching
def correct_typo(user_input):
    print(f"Original User Input: {user_input}")  # Debugging output

    # Load medical terms from the database
    medical_terms = load_medical_terms()

    if not medical_terms:
        print("No medical terms loaded from the database.")
        return None

    # Perform fuzzy matching with a lower score cutoff
    result = process.extractOne(user_input, medical_terms, score_cutoff=70)  # Lower the score_cutoff to 70

    # If result is None, return None
    if result is None:
        print("No match found.")
        return None

    match, score = result  # Unpack the match and score

    # Output the matching result for debugging
    print(f"Matching result: {match} (Score: {score})")

    return match


# Test the function
if __name__ == "__main__":
    test_input = "pco"
    corrected = correct_typo(test_input)
    if corrected:
        print(f"Corrected Term: {corrected}")
    else:
        print("No correction found.")
