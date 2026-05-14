import sounddevice as sd
from scipy.io.wavfile import write

fs = 16000

print("Recording for 5 seconds...")

audio = sd.rec(
    int(5 * fs),
    samplerate=fs,
    channels=1,
    dtype="int16",
    device=1
)

sd.wait()

write("output.wav", fs, audio)

print("Saved as output.wav")