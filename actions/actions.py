#
# from rasa_sdk import Action
# from rasa_sdk.executor import CollectingDispatcher
# from rasa_sdk.events import UserUtteranceReverted
# import openai
# import os
# from dotenv import load_dotenv
#
# # Load environment variables from .env
# dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
# load_dotenv(dotenv_path)
#
# # Get the API Key from the environment
# openai.api_key = os.getenv("OPENAI_API_KEY")
#
# # Check if the OPENAI_API_KEY is loaded
# print("Loaded OPENAI_API_KEY:", openai.api_key)
#
# class ActionFallbackLLM(Action):
#     def name(self) -> str:
#         return "action_fallback_llm"
#
#     async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
#         user_message = tracker.latest_message.get("text")
#         intent_ranking = tracker.latest_message.get("intent_ranking", [])
#
#         # If the intent confidence is high enough, don't call OpenAI
#         if intent_ranking and intent_ranking[0]["confidence"] > 0.4:
#             dispatcher.utter_message(text="I'm not sure, but I can try to help.")
#             return [UserUtteranceReverted()]
#
#         try:
#             # Make the API call to OpenAI without any conversation history
#             response = openai.ChatCompletion.create(
#                 model="gpt-3.5-turbo",
#                 messages=[{"role": "user", "content": user_message}],
#                 max_tokens=300,
#             )
#
#             # Log the response (for debugging purposes)
#             print(response)
#
#             # Extract response message safely
#             if "choices" in response and len(response["choices"]) > 0:
#                 message_content = response["choices"][0]["message"]["content"].strip()
#
#                 if message_content:  # Ensure the response is not empty
#                     dispatcher.utter_message(text=message_content)
#                 else:
#                     dispatcher.utter_message(text="Sorry, I couldn't find an answer to that.")
#             else:
#                 dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")
#
#         except openai.OpenAIError as e:
#             print("OpenAI Error:", e)  # Log error for debugging
#             dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")
#
#



from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
import openai
import os
from dotenv import load_dotenv
from rapidfuzz import process  # Efficient typo correction

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Get the API Key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

# Check if the OPENAI_API_KEY is loaded
print("Loaded OPENAI_API_KEY:", openai.api_key)

# Define a list of common medical terms related to PCOS
MEDICAL_TERMS = [
    "PCOS", "ovulation", "hormonal imbalance", "estrogen", "testosterone",
    "menstrual cycle", "infertility", "follicle", "cysts", "androgen",
    "insulin resistance", "weight gain", "acne", "irregular periods",
    "metformin", "birth control", "lifestyle changes", "hirsutism",
    "ultrasound", "ovarian dysfunction", "reproductive health"
]

def correct_typo(user_input):
    """
    Uses rapidfuzz to find the closest match to a medical term.
    Returns the corrected term if confidence is high.
    """
    match, score = process.extractOne(user_input, MEDICAL_TERMS, score_cutoff=80)
    return match if match else None  # Return corrected word if similarity is high

class ActionFallbackLLM(Action):
    def name(self) -> str:
        return "action_fallback_llm"

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_message = tracker.latest_message.get("text")
        intent_ranking = tracker.latest_message.get("intent_ranking", [])

        # Handle typo correction
        corrected_term = correct_typo(user_message)
        if corrected_term:
            response_text = f"Did you mean '{corrected_term}'? Here is some information:\n\n"
            if corrected_term.lower() == "pcos":
                response_text += "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder common among women of reproductive age."
            elif corrected_term.lower() == "ovulation":
                response_text += "Ovulation is the release of an egg from the ovary, typically occurring in the middle of the menstrual cycle."
            elif corrected_term.lower() == "hormonal imbalance":
                response_text += "Hormonal imbalance refers to fluctuations in hormone levels that can affect various bodily functions."
            else:
                response_text += f"{corrected_term} is a medical term related to PCOS. Let me know if you need more details!"

            dispatcher.utter_message(text=response_text)
            return []

        # If the intent confidence is high enough, don't call OpenAI
        if intent_ranking and intent_ranking[0]["confidence"] > 0.4:
            dispatcher.utter_message(text="I'm not sure, but I can try to help.")
            return [UserUtteranceReverted()]

        try:
            # Make the API call to OpenAI without any conversation history
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}],
                max_tokens=300,
            )

            # Log the response (for debugging purposes)
            print(response)

            # Extract response message safely
            if "choices" in response and len(response["choices"]) > 0:
                message_content = response["choices"][0]["message"]["content"].strip()

                if message_content:  # Ensure the response is not empty
                    dispatcher.utter_message(text=message_content)
                else:
                    dispatcher.utter_message(text="Sorry, I couldn't find an answer to that.")
            else:
                dispatcher.utter_message(text="I didn't receive a valid response from OpenAI.")

        except openai.OpenAIError as e:
            print("OpenAI Error:", e)  # Log error for debugging
            dispatcher.utter_message(text="An issue occurred with OpenAI. Please try again later.")
