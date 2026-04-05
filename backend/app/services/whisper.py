import tempfile
import os
from faster_whisper import WhisperModel
from app.config import settings

_model = None


def get_model():
    global _model
    if _model is None:
        _model = WhisperModel(settings.whisper_model, device="cpu", compute_type="int8")
    return _model


async def transcribe(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    model = get_model()
    suffix = os.path.splitext(filename)[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    try:
        segments, _ = model.transcribe(tmp_path, language="fi")
        return " ".join(segment.text for segment in segments).strip()
    finally:
        os.unlink(tmp_path)
