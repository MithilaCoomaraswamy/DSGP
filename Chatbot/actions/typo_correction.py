import sqlite3
from rapidfuzz import process

# Load medical terms from the database
def load_medical_terms():
    db_path = "actions/medical_terms.db"
    conn = None
    terms = []

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT term FROM medical_terms")
        rows = cursor.fetchall()
        terms = [row[0].lower() for row in rows]
        return terms

    except sqlite3.Error as e:
        print(f"Error loading medical terms: {e}")
    finally:
        if conn:
            conn.close()

    return terms

# Corrects typos using fuzzy matching
def correct_typo(user_input):
    medical_terms = load_medical_terms()

    if not medical_terms:
        return None

    user_input = user_input.lower()

    # Perform fuzzy matching with a score cutoff of 60
    result = process.extractOne(user_input, medical_terms, score_cutoff=60)

    if result:
        match, score, _ = result
        return match

    return None

# Test the load_medical_terms function
if __name__ == "__main__":
    # Test loading medical terms from database
    medical_terms = load_medical_terms()
    if medical_terms:
        print("Loaded Medical Terms:")
        for term in medical_terms:
            print(term)
    else:
        print("No terms loaded from the database.")

    # Test the correct_typo function with a sample input
    test_input = "homonla imblnce"  # User input with a typo
    corrected_term = correct_typo(test_input)

    if corrected_term:
        print(f"Corrected Term: {corrected_term}")
    else:
        print("No correction found.")
