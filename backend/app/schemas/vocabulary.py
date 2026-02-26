from pydantic import BaseModel
from typing import Literal
import uuid
from datetime import datetime


class VocabularyGenerateRequest(BaseModel):
    level: Literal["A2", "B1", "B2"] = "B1"
    theme: str = "arki"


class WordItem(BaseModel):
    word: str
    translation: str
    example_sentence: str | None = None
    synonyms: str | None = None


class VocabularyGenerateResponse(BaseModel):
    words: list[WordItem]


class FlashcardCreate(BaseModel):
    word: str
    translation: str
    example_sentence: str | None = None
    synonyms: str | None = None
    difficulty: int = 1


class FlashcardResponse(BaseModel):
    id: uuid.UUID
    word: str
    translation: str
    example_sentence: str | None
    synonyms: str | None
    difficulty: int
    next_review: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True
