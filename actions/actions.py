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

        # Check if the highest intent has low confidence (< 0.35)
        if intent_ranking and intent_ranking[0]["confidence"] > 0.35:
            # The intent was classified with enough confidence, do NOT use GPT-3.5
            dispatcher.utter_message(text="I'm not sure, but I can try to help.")
            return [UserUtteranceReverted()]

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


        except openai.error.AuthenticationError as e:

            print("Authentication failed. Please check your OpenAI API key.")

            dispatcher.utter_message(text="There was an authentication issue with the API.")

        except openai.error.RateLimitError as e:

            print("Rate limit exceeded. Try again later.")

            dispatcher.utter_message(text="The API rate limit was exceeded. Please try again later.")

        except openai.error.OpenAIError as e:

            print(f"General OpenAI error: {str(e)}")

            dispatcher.utter_message(text="An error occurred with OpenAI. Please try again later.")

        except Exception as e:

            print(f"General error: {str(e)}")

            dispatcher.utter_message(text="Sorry, I encountered an error. Please try again later.")

        return []