import uuid
import json
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.practice_result import PracticeResult
from app.routers.deps import get_current_user
from app.schemas.speaking import SpeakingGenerateRequest, SpeakingTask, SpeakingEvaluationResult
from app.services import ollama, whisper

router = APIRouter(prefix="/speaking", tags=["speaking"])


@router.post("/generate", response_model=SpeakingTask)
async def generate_task(
    body: SpeakingGenerateRequest,
    _: User = Depends(get_current_user),
):
    prompt = ollama.speaking_generate_prompt(body.level, body.type, body.topic)
    data = await ollama.generate_json(prompt)
    return SpeakingTask(
        **data,
        task_type=body.type,
        level=body.level,
    )


@router.post("/evaluate", response_model=SpeakingEvaluationResult)
async def evaluate_speaking(
    audio: List[UploadFile] = File(...),
    questions: str = Form("[]"),  # JSON array of question strings, used for keskustelu
    task_type: str = Form("kertominen"),
    level: str = Form("B1"),
    task_prompt: str = Form(""),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    parsed_questions: list[str] = json.loads(questions)

    if task_type == "keskustelu" and len(audio) > 1:
        # Transcribe each answer turn separately so the evaluator knows which answer belongs to which question
        turn_transcripts = []
        for i, audio_file in enumerate(audio):
            audio_bytes = await audio_file.read()
            transcript = await whisper.transcribe(audio_bytes, audio_file.filename or f"turn_{i}.webm")
            question = parsed_questions[i] if i < len(parsed_questions) else ""
            turn_transcripts.append({"question": question, "answer": transcript})

        full_transcript = "\n".join(
            f"Q{i+1}: {t['question']}\nA{i+1}: {t['answer']}"
            for i, t in enumerate(turn_transcripts)
        )
        prompt = ollama.speaking_evaluate_prompt(full_transcript, task_type, level, task_prompt, turn_transcripts)
    else:
        audio_bytes = await audio[0].read()
        full_transcript = await whisper.transcribe(audio_bytes, audio[0].filename or "audio.webm")
        prompt = ollama.speaking_evaluate_prompt(full_transcript, task_type, level, task_prompt)

    data = await ollama.generate_json(prompt, model="mistral")

    result = PracticeResult(
        id=uuid.uuid4(),
        user_id=current_user.id,
        skill="speaking",
        type=task_type,
        score=data.get("score"),
        feedback=data.get("feedback"),
        transcript=full_transcript,
    )
    db.add(result)
    await db.commit()

    return SpeakingEvaluationResult(**data, transcript=full_transcript)
