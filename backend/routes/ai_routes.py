from flask import Blueprint, request, jsonify
from services.mistral_service import generate_ai_response

ai_bp = Blueprint("ai", __name__)


@ai_bp.route("/generate", methods=["POST"])
def generate():
    data = request.json

    user_prompt = data.get("prompt", "")

    if not user_prompt:
        return jsonify({
            "error": "Prompt is required"
        }), 400

    ai_response = generate_ai_response(user_prompt)

    return jsonify({
        "response": ai_response
    })