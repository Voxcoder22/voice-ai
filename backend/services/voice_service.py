# import os

# # -----------------------------------
# # SSL FIXES
# # -----------------------------------
# os.environ["HF_HUB_DISABLE_SSL_VERIFY"] = "1"
# os.environ["CURL_CA_BUNDLE"] = ""
# os.environ["REQUESTS_CA_BUNDLE"] = ""
# os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# import sounddevice as sd
# from scipy.io.wavfile import write
# from faster_whisper import WhisperModel

# # -----------------------------------
# # IMPORT AI SERVICE
# # -----------------------------------
# from services.mistral_service import generate_ai_response

# # -----------------------------------
# # CONFIG
# # -----------------------------------
# SAMPLE_RATE = 16000

# # Recording duration
# RECORD_SECONDS = 8

# # -----------------------------------
# # LOAD WHISPER MODEL
# # -----------------------------------
# print("Loading Whisper model...")

# model = WhisperModel(
#     "small",
#     device="cpu",
#     compute_type="int8",
#     cpu_threads=2
# )

# print("Whisper loaded.")

# # -----------------------------------
# # MAIN FUNCTION
# # -----------------------------------
# def start_voice_listener():

#     print("\nPress ENTER to start recording...")
#     input()

#     print(f"\nRecording for {RECORD_SECONDS} seconds...\n")

#     # -----------------------------------
#     # RECORD AUDIO
#     # -----------------------------------
#     audio = sd.rec(
#         int(RECORD_SECONDS * SAMPLE_RATE),
#         samplerate=SAMPLE_RATE,
#         channels=1,
#         dtype="int16",
#         device=1
#     )

#     sd.wait()

#     print("\nRecording complete.")

#     # -----------------------------------
#     # SAVE AUDIO
#     # -----------------------------------
#     audio_path = "recording.wav"

#     write(
#         audio_path,
#         SAMPLE_RATE,
#         audio
#     )

#     print("Transcribing...\n")

#     # -----------------------------------
#     # TRANSCRIBE AUDIO
#     # -----------------------------------
#     segments, _ = model.transcribe(
#         audio_path,
#         language="en",
#         beam_size=5,
#         vad_filter=True
#     )

#     transcript = ""

#     for segment in segments:
#         transcript += " " + segment.text.lower()

#     transcript = transcript.strip()

#     # -----------------------------------
#     # SHOW FINAL PROMPT
#     # -----------------------------------
#     print("======================")
#     print("FINAL PROMPT:")
#     print(transcript)
#     print("======================\n")

#     # -----------------------------------
#     # SEND TO AI
#     # -----------------------------------
#     print("Sending prompt to AI...\n")

#     ai_response = generate_ai_response(transcript)

#     # -----------------------------------
#     # SHOW AI RESPONSE
#     # -----------------------------------
#     print("======================")
#     print("AI RESPONSE:")
#     print(ai_response)
#     print("======================")

# import os
# import queue
# import tempfile
# import numpy as np
# import sounddevice as sd
# import scipy.io.wavfile as wav

# # -----------------------------------
# # SSL FIXES
# # -----------------------------------
# os.environ["HF_HUB_DISABLE_SSL_VERIFY"] = "1"
# os.environ["CURL_CA_BUNDLE"] = ""
# os.environ["REQUESTS_CA_BUNDLE"] = ""
# os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# from faster_whisper import WhisperModel
# from services.mistral_service import generate_ai_response

# # -----------------------------------
# # CONFIG
# # -----------------------------------
# SAMPLE_RATE = 16000
# BLOCKSIZE = 4096

# # Silence detection
# SILENCE_THRESHOLD = 0.02

# # How many silent chunks before stopping
# MAX_SILENT_CHUNKS = 10

# # -----------------------------------
# # LOAD WHISPER MODEL
# # -----------------------------------
# print("Loading Whisper model...")

# model = WhisperModel(
#     "small",
#     device="cpu",
#     compute_type="int8",
#     cpu_threads=2
# )

# print("Whisper loaded.")

# # -----------------------------------
# # AUDIO QUEUE
# # -----------------------------------
# audio_queue = queue.Queue()

# # -----------------------------------
# # AUDIO CALLBACK
# # -----------------------------------
# def audio_callback(indata, frames, time, status):

#     if status:
#         print(status)

#     audio_queue.put(indata.copy())

# # -----------------------------------
# # TRANSCRIBE AUDIO
# # -----------------------------------
# def transcribe_audio(audio_data):

#     with tempfile.NamedTemporaryFile(
#         suffix=".wav",
#         delete=False
#     ) as tmpfile:

#         wav.write(
#             tmpfile.name,
#             SAMPLE_RATE,
#             audio_data
#         )

#         segments, _ = model.transcribe(
#             tmpfile.name,
#             language="en",
#             beam_size=5,
#             vad_filter=True
#         )

#         transcript = ""

#         for segment in segments:
#             transcript += " " + segment.text

#         return transcript.strip()

# # -----------------------------------
# # MAIN VOICE SESSION
# # -----------------------------------
# def start_voice_listener():

#     print("\nPress ENTER to start listening...")
#     input()

#     print("\nListening...\n")

#     recorded_audio = []

#     silence_counter = 0
#     speech_detected = False

#     with sd.InputStream(
#         samplerate=SAMPLE_RATE,
#         channels=1,
#         callback=audio_callback,
#         blocksize=BLOCKSIZE,
#         dtype="float32",
#         device=1
#     ):

#         while True:

#             audio_chunk = audio_queue.get()

#             volume = np.abs(audio_chunk).mean()

#             # -----------------------------------
#             # DETECT SPEECH
#             # -----------------------------------
#             if volume > SILENCE_THRESHOLD:

#                 speech_detected = True
#                 silence_counter = 0

#                 recorded_audio.append(audio_chunk)

#                 print("Recording...")

#             # -----------------------------------
#             # DETECT SILENCE
#             # -----------------------------------
#             else:

#                 # Only count silence AFTER speech starts
#                 if speech_detected:

#                     silence_counter += 1

#                     print(
#                         f"Silence {silence_counter}/{MAX_SILENT_CHUNKS}"
#                     )

#                     recorded_audio.append(audio_chunk)

#             # -----------------------------------
#             # LONG SILENCE = STOP
#             # -----------------------------------
#             if (
#                 speech_detected and
#                 silence_counter >= MAX_SILENT_CHUNKS
#             ):

#                 print("\nFinalizing prompt...\n")

#                 break

#     # -----------------------------------
#     # COMBINE AUDIO
#     # -----------------------------------
#     final_audio = np.concatenate(
#         recorded_audio,
#         axis=0
#     )

#     # -----------------------------------
#     # TRANSCRIBE ONCE
#     # -----------------------------------
#     transcript = transcribe_audio(
#         final_audio
#     )

#     print("======================")
#     print("FINAL PROMPT:")
#     print(transcript)
#     print("======================\n")

#     # -----------------------------------
#     # SEND TO AI
#     # -----------------------------------
#     print("Sending prompt to AI...\n")

#     ai_response = generate_ai_response(
#         transcript
#     )

#     print("======================")
#     print("AI RESPONSE:")
#     print(ai_response)
#     print("======================")

import os
import queue
import tempfile
import numpy as np
import sounddevice as sd
import scipy.io.wavfile as wav

# -----------------------------------
# SSL FIXES
# -----------------------------------
os.environ["HF_HUB_DISABLE_SSL_VERIFY"] = "1"
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from faster_whisper import WhisperModel

from services.orchestrator_service import (
    process_prompt
)

# -----------------------------------
# CONFIG
# -----------------------------------
SAMPLE_RATE = 16000
BLOCKSIZE = 4096

# -----------------------------------
# SILENCE DETECTION
# -----------------------------------
SILENCE_THRESHOLD = 0.02

# -----------------------------------
# LONG SILENCE ENDS RECORDING
# -----------------------------------
MAX_SILENT_CHUNKS = 10

# -----------------------------------
# FILLER WORD CLEANER
# -----------------------------------
FILLER_WORDS = [
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

# -----------------------------------
# LOAD WHISPER MODEL
# -----------------------------------
print(
    "\nLoading Whisper model...\n"
)

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8",
    cpu_threads=2
)

print(
    "\nWhisper loaded.\n"
)

# -----------------------------------
# AUDIO QUEUE
# -----------------------------------
audio_queue = queue.Queue()

# -----------------------------------
# AUDIO CALLBACK
# -----------------------------------
def audio_callback(
    indata,
    frames,
    time,
    status
):

    if status:

        print(status)

    audio_queue.put(
        indata.copy()
    )

# -----------------------------------
# CLEAN PROMPT
# -----------------------------------
def clean_prompt(text):

    cleaned = text.lower()

    for word in FILLER_WORDS:

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
def transcribe_audio(audio_data):

    with tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    ) as tmpfile:

        wav.write(
            tmpfile.name,
            SAMPLE_RATE,
            audio_data
        )

        segments, _ = model.transcribe(
            tmpfile.name,
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
# START LISTENING
# -----------------------------------
def listen_once():

    print(
        "\nPress ENTER to start listening..."
    )

    input()

    print(
        "\nListening...\n"
    )

    recorded_audio = []

    silence_counter = 0

    speech_detected = False

    with sd.InputStream(

        samplerate=SAMPLE_RATE,

        channels=1,

        callback=audio_callback,

        blocksize=BLOCKSIZE,

        dtype="float32"
    ):

        while True:

            audio_chunk = audio_queue.get()

            volume = np.abs(
                audio_chunk
            ).mean()

            # -----------------------------------
            # SPEECH DETECTED
            # -----------------------------------
            if volume > SILENCE_THRESHOLD:

                speech_detected = True

                silence_counter = 0

                recorded_audio.append(
                    audio_chunk
                )

                print(
                    "Recording..."
                )

            # -----------------------------------
            # SILENCE DETECTED
            # -----------------------------------
            else:

                if speech_detected:

                    silence_counter += 1

                    print(
                        f"Silence {silence_counter}/{MAX_SILENT_CHUNKS}"
                    )

                    recorded_audio.append(
                        audio_chunk
                    )

            # -----------------------------------
            # STOP AFTER LONG SILENCE
            # -----------------------------------
            if (

                speech_detected

                and

                silence_counter >= MAX_SILENT_CHUNKS

            ):

                print(
                    "\nFinalizing prompt...\n"
                )

                break

    # -----------------------------------
    # COMBINE AUDIO
    # -----------------------------------
    final_audio = np.concatenate(
        recorded_audio,
        axis=0
    )

    # -----------------------------------
    # TRANSCRIBE
    # -----------------------------------
    transcript = transcribe_audio(
        final_audio
    )

    # -----------------------------------
    # CLEAN TRANSCRIPT
    # -----------------------------------
    cleaned_prompt = clean_prompt(
        transcript
    )

    print("======================")
    print("FINAL PROMPT:")
    print(cleaned_prompt)
    print("======================\n")

    return cleaned_prompt

# -----------------------------------
# MAIN VOXCODE LOOP
# -----------------------------------
def start_voxcode():

    print(
        "\n=============================="
    )

    print(
        "   VOXCODE VOICE RUNTIME"
    )

    print(
        "==============================\n"
    )

    print(
        "Say 'exit' to stop VoxCode.\n"
    )

    while True:

        try:

            prompt = listen_once()

            if not prompt:

                continue

            # -----------------------------------
            # EXIT COMMAND
            # -----------------------------------
            if prompt.lower() == "exit":

                print(
                    "\nStopping VoxCode...\n"
                )

                break

            # -----------------------------------
            # SEND TO ORCHESTRATOR
            # -----------------------------------
            print(
                "\nSending Prompt To VoxCode...\n"
            )

            result = process_prompt(
                prompt
            )

            # -----------------------------------
            # SHOW RESULT
            # -----------------------------------
            print("======================")
            print("VOXCODE RESULT:")
            print(result)
            print("======================\n")

        except KeyboardInterrupt:

            print(
                "\n\nStopping VoxCode...\n"
            )

            break

        except Exception as e:

            print(
                f"\nVoice Runtime Error:\n{e}\n"
            )

# -----------------------------------
# ENTRY POINT
# -----------------------------------
if __name__ == "__main__":

    start_voxcode()