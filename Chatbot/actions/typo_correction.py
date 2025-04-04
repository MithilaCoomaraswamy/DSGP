import sqlite3
import os
from rapidfuzz import process

# Load medical terms from the SQLite database into a dictionary
def load_medical_terms():
    db_path = os.path.join(os.path.dirname(__file__), 'medical_terms.db')

    if not os.path.exists(db_path):
        print(f"⚠️ Database file not found at {db_path}. Using default typo corrections.")
        return {}

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT term, corrected_term FROM medical_terms")
    rows = cursor.fetchall()

    conn.close()
    return {term.lower(): corrected_term for term, corrected_term in rows}

# Load medical terms into a dictionary at startup
MEDICAL_TERMS = load_medical_terms()

# Common typos and their corrections
COMMON_TYPOS = {
    "pcsoo": "pcos",
    "is": "is",
    "Is": "Is",
    "for": "for",
    "thyrod": "thyroid",
    "symtom": "symptom",
    "har": "hair",
    "disorder": "disorder",
"disease": "disease",
    "this": "this",
    "the": "the",
    "cause": "cause",
    "hormnl imbalnce": "hormonal imbalance",
    "cuses": "cause",
    "causesse": "causes",
    "ovulotion": "ovulation",
    "menstral cycle": "menstrual cycle",
    "infirtility": "infertility",
    "cysts": "cysts",
    "rsiks": "risk",
    "androgens": "androgen",
    "insuline resistance": "insulin resistance",
    "weigth gain": "weight gain",
    "acne": "acne",
    "reproductive": "reproductive",
    "irregular period": "irregular periods",
    "birthcontrol": "birth control",
    "lifestyle hanges": "lifestyle changes",
    "hirsutism": "hirsutism",
    "ultrasouns": "ultrasound",
    "reproductivehealth": "reproductive health",
    "pcooo": "pcos",
    "pso": "pcos",
    "spco": "pcos",
    "pscos": "pcos",
    "life": "life",
    "are": "are",
    "polycysticovarysyndrome": "polycystic ovary syndrome",
"polycystic ovary syndrome":"polycystic ovary syndrome",

}

# Merge medical terms into the typo dictionary
COMMON_TYPOS.update(MEDICAL_TERMS)


def correct_typo(user_message):
    """
    Correct typos without changing sentence structure or intent.
    """
    original_message = user_message.strip()
    words = original_message.split()
    corrected_words = []

    for word in words:
        corrected_word = word  # Default to original word

        # Check if the word is a known typo in the dictionary
        if word.lower() in COMMON_TYPOS:
            corrected_word = COMMON_TYPOS[word.lower()]
        else:
            # Apply fuzzy matching only for long words (>4 characters) to avoid miscorrections
            if len(word) > 4:
                match = process.extractOne(word, COMMON_TYPOS.keys(), score_cutoff=90)  # Higher cutoff for better accuracy
                if match:
                    corrected_word = COMMON_TYPOS[match[0]]

        corrected_words.append(corrected_word)

    # Keep the sentence structure the same
    corrected_message = " ".join(corrected_words)

    return corrected_message


