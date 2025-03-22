import sqlite3
import openai
import os
from dotenv import load_dotenv
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rapidfuzz import process  # Ensure rapidfuzz is installed

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Get the API Key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

# Check if the OPENAI_API_KEY is loaded
print("Loaded OPENAI_API_KEY:", openai.api_key)


class ActionValidateUserInput(Action):
    def name(self):
        return "action_validate_user_input"

    def load_terms(self):
        """Load terms and responses from SQLite database."""
        conn = sqlite3.connect("terms.db")
        cursor = conn.cursor()
        cursor.execute("SELECT word, response FROM terms")
        terms = {row[0].lower(): row[1] for row in cursor.fetchall()}
        conn.close()
        return terms

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_input = tracker.latest_message.get("text").lower().strip()

        # Load known terms and responses
        known_terms = self.load_terms()

        # 1️⃣ **Check if the exact query exists in the database**
        if user_input in known_terms:
            dispatcher.utter_message(known_terms[user_input])
            return []

        # 2️⃣ **Check for typos using fuzzy matching**
        best_match, score, _ = process.extractOne(user_input, known_terms.keys(), score_cutoff=80)

        if best_match:
            # If a correction exists and has a valid response, suggest and respond
            if best_match in known_terms:
                dispatcher.utter_message(f"Did you mean '{best_match}'?\nHere’s some information:\n{known_terms[best_match]}")
                return []
            else:
                # If no valid response exists for the corrected word, call OpenAI
                dispatcher.utter_message(f"Did you mean '{best_match}'?")
                await self.call_openai(dispatcher, best_match)
                return []

        # 3️⃣ **If no match or typo correction, call OpenAI**
        await self.call_openai(dispatcher, user_input)
        return []

    async def call_openai(self, dispatcher, user_message):
        """Calls OpenAI API when no matching term is found in the database."""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}],
                max_tokens=300,
            )

            # Extract response message
            if response.get("choices") and response["choices"][0]["message"]["content"].strip():
                message_content = response["choices"][0]["message"]["content"].strip()
                dispatcher.utter_message(text=message_content)
            else:
                dispatcher.utter_message(text="Sorry, I couldn't find an answer to that.")

        except openai.OpenAIError as e:
            print("OpenAI Error:", e)
            dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")
