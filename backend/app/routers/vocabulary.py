import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.flashcard import Flashcard
from app.routers.deps import get_current_user
from app.schemas.vocabulary import (
    VocabularyGenerateRequest, VocabularyGenerateResponse,
    FlashcardCreate, FlashcardResponse,
)
from app.services import ollama

router = APIRouter(prefix="/vocabulary", tags=["vocabulary"])


@router.post("/generate", response_model=VocabularyGenerateResponse)
async def generate_vocabulary(
    body: VocabularyGenerateRequest,
    _: User = Depends(get_current_user),
):
    prompt = ollama.vocabulary_generate_prompt(body.level, body.theme)
    data = await ollama.generate_json(prompt)
    return VocabularyGenerateResponse(**data)


@router.get("/flashcards", response_model=list[FlashcardResponse])
async def get_flashcards(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Flashcard).where(Flashcard.user_id == current_user.id).order_by(Flashcard.created_at.desc())
    )
    return result.scalars().all()


@router.post("/flashcards", response_model=FlashcardResponse)
async def create_flashcard(
    body: FlashcardCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    card = Flashcard(id=uuid.uuid4(), user_id=current_user.id, **body.model_dump())
    db.add(card)
    await db.commit()
    await db.refresh(card)
    return card


@router.delete("/flashcards/{card_id}")
async def delete_flashcard(
    card_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Flashcard).where(Flashcard.id == card_id, Flashcard.user_id == current_user.id)
    )
    card = result.scalar_one_or_none()
    if card:
        await db.delete(card)
        await db.commit()
    return {"ok": True}
