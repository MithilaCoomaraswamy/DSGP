# from rasa_sdk import Action
# from rasa_sdk.executor import CollectingDispatcher
# from rasa_sdk.events import UserUtteranceReverted
# import openai
# import os
# from dotenv import load_dotenv
#
# # Load environment variables from .env
# dotenv_path = os.path.join(os.path.dirname(__file__), "actions/.env")
# load_dotenv(dotenv_path)
#
# # Get the OpenAI API Key from the environment
# openai.api_key = os.getenv("OPENAI_API_KEY")
#
# class ActionFallbackLLM(Action):
#     def name(self) -> str:
#         return "action_fallback_llm"
#
#     def run(self, dispatcher: CollectingDispatcher, tracker, domain):
#         user_message = tracker.latest_message.get("text")
#         intent_ranking = tracker.latest_message.get("intent_ranking", [])
#         print(f"Intent confidence: {intent_ranking[0]['confidence'] if intent_ranking else 'No intent detected'}")
#
#
#         # If the intent confidence is low (below 0.4), handle fallback
#         if intent_ranking and intent_ranking[0]["confidence"] < 0.4:
#             print(f"⚠️ Fallback triggered! Forwarding to OpenAI: {user_message}")
#             dispatcher.utter_message(text="I'm not sure about that. Let me try my best to help you.")
#
#             # Call OpenAI API to handle untrained queries
#             try:
#                 response = openai.ChatCompletion.create(
#                     model="gpt-3.5-turbo",
#                     messages=[{"role": "user", "content": user_message}],
#                     max_tokens=300
#                 )
#
#                 # Debugging: Print the full response from OpenAI
#                 print(f"✅ OpenAI API Response: {response}")
#
#                 if "choices" in response and response["choices"]:
#                     message_content = response["choices"][0]["message"]["content"].strip()
#
#                     # If OpenAI response is empty, use a default message
#                     if not message_content:
#                         message_content = "I'm sorry, but I couldn't find an answer to your question."
#
#                     dispatcher.utter_message(text=message_content)
#                     print(f"📝 Bot Response: {message_content}")  # Log the response
#
#                 else:
#                     dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")
#                     print("⚠️ No valid 'choices' found in OpenAI response.")
#
#             except openai.OpenAIError as e:
#                 print(f"❌ OpenAI API Error: {e}")
#                 dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")




#

#
#
# from rasa_sdk import Action
# from rasa_sdk.executor import CollectingDispatcher
# from rasa_sdk.events import UserUtteranceReverted
# import openai
# import os
# from dotenv import load_dotenv
#
# # Load environment variables from .env
# dotenv_path = os.path.join(os.path.dirname(__file__), "actions/.env")
# load_dotenv(dotenv_path)
#
# # Get the OpenAI API Key from the environment
# openai.api_key = os.getenv("OPENAI_API_KEY")
#
# class ActionFallbackLLM(Action):
#     def name(self) -> str:
#         return "action_fallback_llm"
#
#     def run(self, dispatcher: CollectingDispatcher, tracker, domain):
#         user_message = tracker.latest_message.get("text")
#         intent_ranking = tracker.latest_message.get("intent_ranking", [])
#         print(f"Intent confidence: {intent_ranking[0]['confidence'] if intent_ranking else 'No intent detected'}")
#
#         # If the intent confidence is low (below 0.4), handle fallback
#         if intent_ranking and intent_ranking[0]["confidence"] < 0.4:
#             print(f"⚠️ Fallback triggered! Forwarding to OpenAI: {user_message}")
#             dispatcher.utter_message(text="I'm not sure about that. Let me try my best to help you.")
#
#             # Call OpenAI API to handle untrained queries
#             try:
#                 response = openai.ChatCompletion.create(
#                     model="gpt-3.5-turbo",
#                     messages=[{"role": "user", "content": user_message}],
#                     max_tokens=300
#                 )
#
#                 # Debugging: Print the full response from OpenAI
#                 print(f"✅ OpenAI API Response: {response}")
#
#                 if "choices" in response and response["choices"]:
#                     message_content = response["choices"][0]["message"]["content"].strip()
#
#                     if message_content:
#                         dispatcher.utter_message(text=message_content)
#                         print(f"📝 Bot Response: {message_content}")  # Log the response
#                     else:
#                         dispatcher.utter_message(text="Sorry, I couldn't generate a response for that.")
#                         print("⚠️ OpenAI response was empty.")
#                 else:
#                     dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")
#                     print("⚠️ No valid 'choices' found in OpenAI response.")
#
#             except openai.error.OpenAIError as e:
#                 print(f"❌ OpenAI API Error: {e}")
#                 dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")
#
#             return [UserUtteranceReverted()]
#
#         # Handle other scenarios where intent confidence is high or fallback isn't triggered
#         dispatcher.utter_message(text="I'm sorry, I didn't understand your request.")
#         return []




from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Initialize OpenAI client ✅
openai.api_key = os.getenv("OPENAI_API_KEY")


class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text")
        intent_ranking = tracker.latest_message.get("intent_ranking", [])

        confidence = intent_ranking[0]["confidence"] if intent_ranking else 0
        print(f"🛑 Intent Confidence: {confidence}")

        # Fallback when intent confidence is below 0.4
        if confidence < 0.4:
            print(f"⚠️ Low confidence! Forwarding to OpenAI: {user_message}")
            dispatcher.utter_message(text="I'm not sure about that. Let me try my best to help you.")

            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "system", "content": "You are a helpful assistant."},
                              {"role": "user", "content": user_message}],
                    temperature=0.7,
                    max_tokens=300
                )

                # Debugging OpenAI response
                print(f"✅ OpenAI Response: {response}")

                # Extracting response text
                if "choices" in response and response["choices"]:
                    bot_response = response["choices"][0]["message"]["content"].strip()
                    if bot_response:
                        dispatcher.utter_message(text=bot_response)
                    else:
                        dispatcher.utter_message(text="Sorry, I couldn't generate a response.")
                        print("⚠️ OpenAI returned an empty response.")
                else:
                    dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")
                    print("⚠️ No valid choices from OpenAI.")

            except Exception as e:
                print(f"❌ OpenAI API Error: {e}")
                dispatcher.utter_message(
                    text="An issue occurred while processing your request. Please try again later.")

            return [UserUtteranceReverted()]

        # If intent confidence is high but no correct intent found
        dispatcher.utter_message(text="I'm sorry, I didn't understand your request.")
        return []
