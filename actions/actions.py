import sqlite3
import openai
import os
from dotenv import load_dotenv
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
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
        """ Load terms and their responses from SQLite database """
        conn = sqlite3.connect("terms.db")
        cursor = conn.cursor()
        cursor.execute("SELECT word FROM terms")
        terms = [row[0] for row in cursor.fetchall()]
        conn.close()
        return terms

    def get_response(self, term):
        """ Fetch predefined response from the database if available """
        conn = sqlite3.connect("terms.db")
        cursor = conn.cursor()
        cursor.execute("SELECT response FROM terms WHERE word=?", (term,))
        response = cursor.fetchone()
        conn.close()
        return response[0] if response else None

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_input = tracker.latest_message.get("text").lower()

        # Load known terms from database
        known_terms = self.load_terms()

        # If the input exactly matches a term, fetch its response
        if user_input in known_terms:
            response = self.get_response(user_input)
            if response:
                dispatcher.utter_message(text=response)
                return []

        # Find the closest match using fuzzy matching
        match = None
        if known_terms:
            match, score, _ = process.extractOne(user_input, known_terms, score_cutoff=80)

        if match:
            response = self.get_response(match)
            if response:
                dispatcher.utter_message(f"Did you mean '{match}'?\n{response}")
            else:
                dispatcher.utter_message(f"Did you mean '{match}'?")

        else:
            # If no match is found, call OpenAI for assistance
            await self.call_openai(dispatcher, user_input)

        return []

    async def call_openai(self, dispatcher, user_message):
        """
        Calls OpenAI API when no matching term is found in the database.
        """
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}],
                max_tokens=300,
            )

            # Extract response message
            if "choices" in response and len(response["choices"]) > 0:
                message_content = response["choices"][0]["message"]["content"].strip()
                if message_content:
                    dispatcher.utter_message(text=message_content)
                else:
                    dispatcher.utter_message(text="Sorry, I couldn't find an answer to that.")
            else:
                dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")

        except openai.OpenAIError as e:
            print("OpenAI Error:", e)
            dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")
