import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.practice_result import PracticeResult
from app.routers.deps import get_current_user
from app.schemas.writing import (
    WritingGenerateRequest, WritingTask,
    WritingSubmitRequest, WritingEvaluationResult,
)
from app.services import ollama

router = APIRouter(prefix="/writing", tags=["writing"])


@router.post("/generate", response_model=WritingTask)
async def generate_task(
    body: WritingGenerateRequest,
    _: User = Depends(get_current_user),
):
    prompt = ollama.writing_generate_prompt(body.level, body.writing_type, body.topic)
    data = await ollama.generate_json(prompt)
    return WritingTask(**data, writing_type=body.writing_type, level=body.level)


@router.post("/submit", response_model=WritingEvaluationResult)
async def submit_writing(
    body: WritingSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prompt = ollama.writing_evaluate_prompt(body.text, body.prompt_text, body.level)
    data = await ollama.generate_json(prompt, model="llama3.1")

    result = PracticeResult(
        id=uuid.uuid4(),
        user_id=current_user.id,
        skill="writing",
        score=data.get("score"),
        feedback=data.get("feedback"),
        prompt_text=body.prompt_text,
    )
    db.add(result)
    await db.commit()

    return WritingEvaluationResult(**data)
