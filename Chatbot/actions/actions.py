from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
import openai
import os
from dotenv import load_dotenv
from dotenv import dotenv_values

# Load environment variables
load_dotenv()
env_values = dotenv_values(".env")

if "OPENAI_API_KEY" in env_values:
    os.environ["OPENAI_API_KEY"] = env_values["OPENAI_API_KEY"]

# Set OpenAI API Key
api_key = os.getenv("OPENAI_API_KEY")
print(f"DEBUG: Loaded API Key = {api_key}")  # Check if key is loaded
if not api_key:
    print("❌ ERROR: OPENAI_API_KEY is not set.")

openai.api_key = api_key  # ✅ Use this instead of OpenAI() client


class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text", "").strip()
        intent_ranking = tracker.latest_message.get("intent_ranking", [])
        confidence = intent_ranking[0]["confidence"] if intent_ranking else 0

        print(f"Intent Confidence: {confidence}")

        # ✅ If confidence is high, let Rasa handle it
        if confidence >= 0.4:
            return []

        # 🚨 Low confidence → Fallback to OpenAI
        print(f"⚠️ Low confidence! Sending to OpenAI: {user_message}")
        dispatcher.utter_message(text="I'm not sure about that. Let me try my best to help you.")

        if not user_message:
            dispatcher.utter_message(text="I didn't receive any input to process.")
            return [UserUtteranceReverted()]

        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=500
            )

            print(f"✅ OpenAI Response: {response}")

            if response and response.choices:
                bot_response = response.choices[0].message.content.strip()

                if bot_response:
                    dispatcher.utter_message(text=bot_response)
                    return []  # ✅ Successfully handled by GPT

                else:
                    dispatcher.utter_message(text="Sorry, I couldn't generate a response.")
                    print("⚠️ OpenAI returned an empty response.")

            else:
                dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")
                print("⚠️ No valid choices from OpenAI.")

        except openai.RateLimitError:
            dispatcher.utter_message(text="I'm experiencing high traffic. Please try again later.")
        except openai.OpenAIError as e:
            print(f"❌ OpenAI API Error: {e}")
            dispatcher.utter_message(text="An issue occurred while communicating with OpenAI.")

        return [UserUtteranceReverted()]  # ❌ Only revert if OpenAI fails
