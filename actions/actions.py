import openai
from rasa_sdk import Action
from dotenv import load_dotenv
from rasa_sdk.events import UserUtteranceReverted
from rasa_sdk.executor import CollectingDispatcher
import os


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text")

        # If message is empty, send fallback
        if not user_message:
            dispatcher.utter_message(text="Sorry, I didn't understand that.")
            return []

        try:
            # Initialize conversation history
            conversation_history = []

            # Collect last 5 exchanges from tracker
            for event in tracker.events:
                if event.get("event") == "user":
                    conversation_history.append({"role": "user", "content": event.get("text")})
                elif event.get("event") == "bot":
                    conversation_history.append({"role": "assistant", "content": event.get("text")})

            # Keep only the last 5 exchanges
            conversation_history = conversation_history[-5:]

            # Append current user message
            conversation_history.append({"role": "user", "content": user_message})

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=conversation_history,
                max_tokens=300,

            )

            for chunk in response:
                if "content" in chunk["choices"][0]["delta"]:
                    dispatcher.utter_message(text=chunk["choices"][0]["delta"]["content"])

        except Exception as e:
            dispatcher.utter_message(text="Sorry, I encountered an error.")
            print(f"Error in API call: {str(e)}")  # Log the error for debugging

        return []