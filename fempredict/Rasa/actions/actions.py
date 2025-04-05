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
print(f"DEBUG: Loaded API Key from env: {api_key:5}**")  # Check if key is loaded correctly
if not api_key:
    print("❌ ERROR: OPENAI_API_KEY is not set.")
else:
    print("✅ API Key loaded successfully.")  # Added success message

openai.api_key = api_key  # ✅ Use this instead of OpenAI() client


class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text", "").strip()
        intent_ranking = tracker.latest_message.get("intent_ranking", [])
        confidence = intent_ranking[0]["confidence"] if intent_ranking else 0

        print(f"DEBUG: Intent Confidence: {confidence}")  # Added debug statement to show confidence level

        # 🚨 Handle untrained intents (force fallback to OpenAI)
        if tracker.latest_message.get("intent", {}).get("name") == "nlu_fallback":
            print(f"DEBUG: Detected unknown intent. Forcing nlu_fallback.")
            confidence = 0.0  # 🚨 Force confidence to 0 to trigger OpenAI

        # 🚨 Low confidence → Fallback to OpenAI
        if confidence < 0.6:  # Force fallback for confidence < 0.6
            print(f"{user_message}")
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
                    max_tokens=300,
                    stop =None
                )


                if response and response.choices:
                    bot_response = response.choices[0].message.content.strip()

                    if bot_response:
                        print(f"DEBUG: GPT Response: {bot_response}")
                        dispatcher.utter_message(text=bot_response)  # Send GPT response directly to the user
                    else:
                        print("⚠️ OpenAI returned an empty response.")
                        dispatcher.utter_message(text="I'm not sure how to answer that. Can you rephrase?")

                else:
                    print("⚠️ No valid choices in OpenAI response.")
                    dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")
                    return [UserUtteranceReverted()]

            except openai.RateLimitError as e:
                print("⚠️ OpenAI RateLimitError: Hit rate limit.")
                dispatcher.utter_message(text="I'm experiencing high traffic. Please try again later.")
            except openai.OpenAIError as e:
                print(f"❌ OpenAI API Error: {e}")  # Print exact API error message
                dispatcher.utter_message(text=f"OpenAI error: {str(e)}")  # Show error to user

            return [UserUtteranceReverted()]  # Ensure no further Rasa processing after OpenAI fallback

        # ✅ If confidence is sufficient, let Rasa handle it (no fallback)
        print(f"DEBUG: Handling by Rasa (Confidence: {confidence})")
        return []