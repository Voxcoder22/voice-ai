from flask import Blueprint, request, jsonify

from services.orchestrator_service import (
    process_prompt
)

ai_bp = Blueprint(
    "ai",
    __name__
)

@ai_bp.route(
    "/generate",
    methods=["POST"]
)
def generate():

    data = request.json

    user_prompt = data.get(
        "prompt",
        ""
    )

    if not user_prompt:

        return jsonify({

            "error": "Prompt is required"

        }), 400

    result = process_prompt(
        user_prompt
    )

    return jsonify(result)