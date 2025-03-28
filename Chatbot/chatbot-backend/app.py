from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import openai

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"


OPENAI_API_KEY = 'your-openai-api-key'  # Replace with your OpenAI API key

# OpenAI ChatGPT API URL
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

# Chat route - Handles user messages
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json  # Get user message from frontend
    user_message = data.get("message", "")

    # Send user message to Rasa
    rasa_response = requests.post(RASA_SERVER_URL, json={"sender": "user", "message": user_message})

    if rasa_response.status_code == 200:
        rasa_messages = rasa_response.json()  # Parse Rasa response

        # Extract bot messages from the response
        bot_responses = [msg["text"] for msg in rasa_messages if "text" in msg]

        return jsonify({"response": " ".join(bot_responses)})  # Return response to frontend
    else:
        return jsonify({"response": "Sorry, I couldn't connect to the chatbot."}), 500

# Ping route - Check if the API is running
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Server is running"})

if __name__ == '__main__':
    app.run(debug=True)

















