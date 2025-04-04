from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import sys

# Get the parent directory of chatbot-backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from actions.typo_correction import correct_typo

app = Flask(__name__)
CORS(app)  # Allow requests from React frontends

# Rasa Server URL
RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json  # Get user message from frontend
        user_message = data.get("message", "").strip()

        if not user_message:
            print("⚠️ No message received from the frontend.")
            return jsonify({"response": "No message received."}), 400

        print(f"Original user message: '{user_message}'")  # Debug statement

        # Check for typos
        corrected_message = correct_typo(user_message)

        # Only show "Did you mean?" if a correction was actually made
        if corrected_message.lower() != user_message.lower():
            response_prefix = f" 'Did you mean {corrected_message}'? "
        else:
            response_prefix = ""  # No typo correction, no "Did you mean?"

        # Send the corrected or original message to Rasa
        user_message_to_send = corrected_message if corrected_message.lower() != user_message.lower() else user_message
        print(f"Sending message to Rasa: '{user_message_to_send}'")

        rasa_response = requests.post(RASA_SERVER_URL, json={"sender": "user", "message": user_message_to_send})

        if rasa_response.status_code == 200:
            rasa_messages = rasa_response.json()
            print(f"Rasa response: {rasa_messages}")

            # Extract bot messages
            bot_responses = [msg["text"] for msg in rasa_messages if "text" in msg]

            if bot_responses:
                # Add "Did you mean" only if there was a correction
                full_response = response_prefix + " ".join(bot_responses)
                print(f"Bot response to send: '{full_response}'")
                return jsonify({"response": full_response})
            else:
                print("⚠️ No text found in Rasa response.")
                return jsonify({"response": "Sorry, I couldn't understand your query."}), 500
        else:
            print(f"⚠️ Rasa request failed with status code {rasa_response.status_code}")
            return jsonify({"response": "Sorry, I couldn't connect to the chatbot."}), 500

    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error connecting to Rasa: {str(e)}")
        return jsonify({"response": f"Error connecting to Rasa: {str(e)}"}), 500
    except Exception as e:
        print(f"⚠️ An error occurred: {str(e)}")
        return jsonify({"response": f"An error occurred: {str(e)}"}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Server is running"})

if __name__ == '__main__':
    app.run(debug=True)  # Change port if needed
