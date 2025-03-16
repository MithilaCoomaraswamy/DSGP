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
        intent_ranking = tracker.latest_message.get("intent_ranking", [])

        # Prevent API calls if the confidence is reasonable
        if intent_ranking and intent_ranking[0]["confidence"] > 0.4:
            dispatcher.utter_message(text="I'm not sure, but I can try to help.")
            return [UserUtteranceReverted()]

        try:
            # Collect recent messages for better context
            conversation_history = [
                {"role": "user", "content": event.get("text")}
                if event.get("event") == "user" else
                {"role": "assistant", "content": event.get("text")}
                for event in tracker.events[-5:] if "text" in event
            ]

            # Add current user message
            conversation_history.append({"role": "user", "content": user_message})

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=conversation_history,
                max_tokens=300,
            )

            dispatcher.utter_message(text=response["choices"][0]["message"]["content"])

        except openai.error.OpenAIError as e:
            dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")

        return []
