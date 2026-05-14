import os

os.environ["HF_HUB_DISABLE_SSL_VERIFY"] = "1"
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

import queue
import tempfile
import sounddevice as sd
import scipy.io.wavfile as wav
from faster_whisper import WhisperModel

# -----------------------------
# CONFIG
# -----------------------------
SAMPLE_RATE = 16000
DURATION = 1.5  # seconds per chunk

# -----------------------------
# LOAD WHISPER MODEL
# -----------------------------
print("Loading Whisper model...")

model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8",
    cpu_threads=2
)

print("Whisper loaded.")

# -----------------------------
# AUDIO QUEUE
# -----------------------------
audio_queue = queue.Queue()

# -----------------------------
# CALLBACK
# -----------------------------
def audio_callback(indata, frames, time, status):
    if status:
        print(status)

    audio_queue.put(indata.copy())

# -----------------------------
# MAIN LISTENER
# -----------------------------
def start_voice_listener():
    print("Listening for 'voxcode'...")

    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        callback=audio_callback
    ):

        while True:
            print("\nRecording chunk...")

            recording = []

            # Collect audio for DURATION seconds
            for _ in range(int(SAMPLE_RATE / 1024 * DURATION)):
                data = audio_queue.get()
                recording.append(data)

            # Combine chunks
            import numpy as np
            audio_data = np.concatenate(recording, axis=0)

            # Save temp wav
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmpfile:
                wav.write(tmpfile.name, SAMPLE_RATE, audio_data)
                
                if np.abs(audio_data).mean() < 0.01:
                    print("Silence detected...")
                    continue

                # Transcribe
                segments, _ = model.transcribe(
                    tmpfile.name,
                    language="en"
                )

                transcript = ""

                for segment in segments:
                    transcript += segment.text.lower()

                transcript = transcript.strip()

                print(f"Transcript: {transcript}")

                audio_data = np.concatenate(recording, axis=0)

                # Wake word detection
                if "alex" in transcript:
                    print("\nWake word detected!")
                    print("Assistant Activated.\n")