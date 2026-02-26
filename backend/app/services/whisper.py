import tempfile
import os
from transformers import pipeline
from app.config import settings

_pipe = None


def get_pipe():
    global _pipe
    if _pipe is None:
        model_id = f"openai/whisper-{settings.whisper_model}"
        _pipe = pipeline(
            "automatic-speech-recognition",
            model=model_id,
            device="cpu",
        )
    return _pipe


async def transcribe(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    pipe = get_pipe()
    suffix = os.path.splitext(filename)[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    try:
        result = pipe(tmp_path, generate_kwargs={"language": "fi"})
        return result["text"].strip()
    finally:
        os.unlink(tmp_path)
