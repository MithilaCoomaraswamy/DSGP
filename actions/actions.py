import openai
from rasa_sdk import Action
from rasa_sdk.events import UserUtteranceReverted

class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    async def run(self, dispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text")

        # Get response from OpenAI
        openai.api_key = "YOUR_OPENAI_API_KEY"  # Not needed if set in environment

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Or "gpt-4"
                messages=[{"role": "user", "content": user_message}],
                max_tokens=150
            )

            bot_response = response["choices"][0]["message"]["content"]

        except Exception as e:
            bot_response = "Sorry, I'm having trouble understanding you right now."

        dispatcher.utter_message(text=bot_response)
        return []
