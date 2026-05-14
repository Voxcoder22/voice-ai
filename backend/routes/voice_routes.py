import os
import tempfile

from flask import (
    Blueprint,
    request,
    jsonify
)

from faster_whisper import (
    WhisperModel
)

from services.orchestrator_service import (
    process_prompt
)

# -----------------------------------
# SSL FIXES
# -----------------------------------
os.environ["HF_HUB_DISABLE_SSL_VERIFY"] = "1"

os.environ["CURL_CA_BUNDLE"] = ""

os.environ["REQUESTS_CA_BUNDLE"] = ""

os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# -----------------------------------
# VOICE BLUEPRINT
# -----------------------------------
voice_bp = Blueprint(
    "voice",
    __name__
)

# -----------------------------------
# LOAD WHISPER
# -----------------------------------
print(
    "\nLoading Whisper Model...\n"
)

model = WhisperModel(

    "small",

    device="cpu",

    compute_type="int8",

    cpu_threads=2
)

print(
    "\nWhisper Loaded.\n"
)

# -----------------------------------
# CLEAN PROMPT
# -----------------------------------
def clean_prompt(text):

    filler_words = [

        "okay",
        "ok",
        "you know",
        "like",
        "basically",
        "actually",
        "hmm",
        "uh",
        "umm"
    ]

    cleaned = text.lower()

    for word in filler_words:

        cleaned = cleaned.replace(
            word,
            ""
        )

    cleaned = " ".join(
        cleaned.split()
    )

    return cleaned.strip()

# -----------------------------------
# TRANSCRIBE AUDIO
# -----------------------------------
def transcribe_audio(audio_path):

    segments, _ = model.transcribe(

        audio_path,

        language="en",

        beam_size=5,

        vad_filter=True
    )

    transcript = ""

    for segment in segments:

        transcript += (
            " "
            + segment.text
        )

    return transcript.strip()

# -----------------------------------
# VOICE ROUTE
# -----------------------------------
@voice_bp.route(
    "/voice",
    methods=["POST"]
)
def voice_route():

    try:

        # -----------------------------------
        # CHECK AUDIO
        # -----------------------------------
        if "audio" not in request.files:

            return jsonify({

                "success": False,

                "message": "No audio uploaded"

            }), 400

        audio_file = request.files[
            "audio"
        ]

        # -----------------------------------
        # SAVE TEMP FILE
        # -----------------------------------
        with tempfile.NamedTemporaryFile(

            suffix=".wav",

            delete=False

        ) as tmpfile:

            audio_file.save(
                tmpfile.name
            )

            temp_path = tmpfile.name

        # -----------------------------------
        # TRANSCRIBE
        # -----------------------------------
        transcript = transcribe_audio(
            temp_path
        )

        # -----------------------------------
        # CLEAN TRANSCRIPT
        # -----------------------------------
        cleaned_prompt = clean_prompt(
            transcript
        )

        print(
            "\n======================"
        )

        print(
            "VOICE PROMPT:"
        )

        print(
            cleaned_prompt
        )

        print(
            "======================\n"
        )

        # -----------------------------------
        # PROCESS WITH VOXCODE
        # -----------------------------------
        result = process_prompt(
            cleaned_prompt
        )

        # -----------------------------------
        # DELETE TEMP FILE
        # -----------------------------------
        os.remove(temp_path)

        return jsonify({

            "success": True,

            "transcript": cleaned_prompt,

            "result": result
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)
        }), 500