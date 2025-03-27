# import os
# from dotenv import load_dotenv
#
# # Load environment variables
# dotenv_path = os.path.join(os.path.dirname(__file__), "chatbot-backend", ".env")
# load_dotenv(dotenv_path)
#
# # Test if the key is loaded
# api_key = os.getenv("OPENAI_API_KEY")
# if api_key:
#     print(f"OPENAI_API_KEY is loaded: {api_key[:10]}********")  # Masked for security
# else:
#     print("OPENAI_API_KEY is NOT loaded. Check your .env file and path.")



#
# import os
# import openai
# from dotenv import load_dotenv
#
# # Load .env file
# dotenv_path = os.path.join(os.path.dirname(__file__), "chatbot-backend", ".env")
# load_dotenv(dotenv_path)
#
# # Check API Key
# api_key = os.getenv("OPENAI_API_KEY")
# if not api_key:
#     print("❌ OPENAI_API_KEY is NOT loaded. Check your .env file!")
#     exit()
#
# openai.api_key = api_key
#
# # Test OpenAI API call
# try:
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[{"role": "user", "content": "Hello, how are you?"}],
#         max_tokens=50
#     )
#     print("✅ OpenAI Response:", response["choices"][0]["message"]["content"])
# except openai.error.OpenAIError as e:
#     print(f"❌ OpenAI API Error: {e}")



import os
from dotenv import load_dotenv
import openai

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), "actions", ".env")
load_dotenv(dotenv_path)

# Check if the OPENAI_API_KEY is loaded correctly
openai_api_key = os.getenv("OPENAI_API_KEY")

if openai_api_key:
    print("OpenAI API key loaded successfully!")
else:
    print("Error: OPENAI_API_KEY not found in .env file.")

# Optional: Test OpenAI API connectivity by making a request
if openai_api_key:
    openai.api_key = openai_api_key
    try:
        # Make a simple API call to verify it's working
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use the correct model for chat completions
            messages=[
                {"role": "user", "content": "is pcos life threatening"}
            ],
            max_tokens=80
        )

        # Print the response to check if everything is working
        print("OpenAI API response:", response.choices[0].message["content"].strip())

    except openai.OpenAIError as e:
        print("Error with OpenAI API:", e)