from flask import Flask
from flask_cors import CORS
from routes.ai_routes import ai_bp
from routes.voice_routes import voice_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(ai_bp, url_prefix="/api")

app.register_blueprint(
    voice_bp,
    url_prefix="/api"
)


@app.route("/")
def home():
    return {
        "status": "running",
        "message": "Voice Programming Agent Backend Active"
    }


if __name__ == "__main__":
    app.run(debug=True)