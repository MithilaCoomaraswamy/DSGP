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
import openai
from dotenv import load_dotenv

# Load .env file
dotenv_path = os.path.join(os.path.dirname(__file__), "actions", ".env")
load_dotenv(dotenv_path)

# Check API Key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("❌ OPENAI_API_KEY is NOT loaded. Check your .env file!")
    exit()

openai.api_key = api_key

# Test OpenAI API call (Updated for OpenAI >=1.0.0)
try:
    client = openai.OpenAI(api_key=api_key)  # Correct way to initialize client
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello, how are you?"}],
        max_tokens=50
    )

    print("✅ OpenAI Response:", response.choices[0].message.content)

except openai.OpenAIError as e:
    print(f"❌ OpenAI API Error: {e}")

