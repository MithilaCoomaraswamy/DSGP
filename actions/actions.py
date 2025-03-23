from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
import openai
import os
from dotenv import load_dotenv
from actions.typo_correction import correct_typo  # Import typo correction function

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Get the API Key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")


class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text")
        intent_ranking = tracker.latest_message.get("intent_ranking", [])


        # If intent confidence is low, handle it as fallback
        if intent_ranking and intent_ranking[0]["confidence"] < 0.4:
            dispatcher.utter_message(text="I'm not sure about that. Let me try my best to help you.")
            return [UserUtteranceReverted()]

        try:
            # Call OpenAI API for response
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}],
                max_tokens=300,
            )

            # Extract response from OpenAI API and send it
            if "choices" in response and response["choices"]:
                message_content = response["choices"][0].get("message", {}).get("content", "").strip()

                if message_content:
                    dispatcher.utter_message(text=message_content)
                else:
                    dispatcher.utter_message(text="Sorry, I couldn't generate a response for that.")
            else:
                dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")

        except openai.OpenAIError as e:
            print("OpenAI Error:", e)
            dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")
