# import os
# from dotenv import load_dotenv
# from mistralai.client import MistralClient
# from mistralai.models.chat_completion import ChatMessage

# load_dotenv()

# api_key = os.getenv("MISTRAL_API_KEY")

# client = MistralClient(api_key=api_key)


# def generate_ai_response(user_prompt):
#     try:
#         messages = [
#             ChatMessage(
#                 role="user",
#                 content=user_prompt
#             )
#         ]

#         response = client.chat(
#             model="codestral-latest",
#             messages=messages
#         )

#         return response.choices[0].message.content

#     except Exception as e:
#         return str(e)

import os
from dotenv import load_dotenv
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")

client = MistralClient(api_key=api_key)

SYSTEM_PROMPT = """
You are an AI coding agent.

IMPORTANT:
Always return generated code in this exact structure:

FILE: filename.ext

<CODE_BLOCK_START>
language
code here
<CODE_BLOCK_END>

You may generate multiple files.

Example:

FILE: app.py

<CODE_BLOCK_START>
python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Hello"}
<CODE_BLOCK_END>

FILE: requirements.txt

<CODE_BLOCK_START>
text
flask
flask-cors
<CODE_BLOCK_END>

Rules:
- Always include filenames
- Always separate files clearly
- Use realistic filenames
- Prefer modular project structures
- Keep output machine-readable
- Do not add explanations before files
"""


def generate_ai_response(user_prompt):
    try:
        messages = [
            ChatMessage(
                role="system",
                content=SYSTEM_PROMPT
            ),
            ChatMessage(
                role="user",
                content=user_prompt
            )
        ]

        response = client.chat(
            model="codestral-latest",
            messages=messages
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"