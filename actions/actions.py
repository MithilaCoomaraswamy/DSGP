# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []


from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher

class ActionPredictPCOS(Action):

    def name(self) -> str:
        return "action_predict_pcos"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        # Retrieve slot values (age, bmi, symptoms)
        age = tracker.get_slot("age")
        bmi = tracker.get_slot("bmi")
        symptoms = tracker.get_slot("symptoms")

        # Basic logic for risk prediction (replace with real logic)
        risk_level = "low"
        if bmi and float(bmi) > 30:
            risk_level = "high"
        elif symptoms and "irregular" in symptoms.lower():
            risk_level = "moderate"

        # Send response back to the user
        dispatcher.utter_message(
            text=f"Based on your inputs, your PCOS risk is {risk_level}."
        )
        return []
