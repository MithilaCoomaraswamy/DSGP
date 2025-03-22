import sqlite3
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
import openai
import os
from dotenv import load_dotenv
from rapidfuzz import process  # For typo correction

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Get the API Key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

# Check if the OPENAI_API_KEY is loaded
print("Loaded OPENAI_API_KEY:", openai.api_key)

class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    def load_terms(self):
        """ Load terms and responses from SQLite database """
        conn = sqlite3.connect("terms.db")  # Connect to database
        cursor = conn.cursor()
        cursor.execute("SELECT word, response FROM terms")  # Fetch words and responses
        terms = {row[0]: row[1] for row in cursor.fetchall()}  # Store in dictionary
        conn.close()
        return terms

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text").lower()
        intent_ranking = tracker.latest_message.get("intent_ranking", [])

        # Step 1: Check if the intent is handled by Rasa (Pretrained Response)
        if intent_ranking and intent_ranking[0]["confidence"] > 0.4:
            return [UserUtteranceReverted()]  # Let Rasa handle the response

        # Step 2: Load known terms and responses from the database
        known_terms = self.load_terms()

        # Step 3: Check if the user query exactly matches the database
        if user_message in known_terms:
            dispatcher.utter_message(text=known_terms[user_message])  # Return stored response
            return []

        # Step 4: Use fuzzy matching to handle typos
        match, score, _ = process.extractOne(user_message, known_terms.keys(), score_cutoff=80) if known_terms else (None, 0, None)

        if match:
            dispatcher.utter_message(f"Did you mean '{match}'? Here’s some information: {known_terms[match]}")
            return []

        # Step 5: If no match is found, call OpenAI API
        await self.call_openai(dispatcher, user_message)

        return []

    async def call_openai(self, dispatcher, user_message):
        """ Calls OpenAI API when no matching term is found in the database. """
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}],
                max_tokens=300,
            )

            # Extract response message
            if response and "choices" in response and len(response["choices"]) > 0:
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
