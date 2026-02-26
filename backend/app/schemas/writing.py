from pydantic import BaseModel
from typing import Literal


class WritingGenerateRequest(BaseModel):
    level: Literal["A2", "B1", "B2"] = "B1"
    writing_type: Literal["informal", "formal", "mielipide"] = "informal"
    topic: str | None = None


class WritingTask(BaseModel):
    title: str
    instructions: str
    prompt: str
    min_words: int
    max_words: int
    writing_type: str
    level: str


class WritingSubmitRequest(BaseModel):
    text: str
    prompt_text: str
    level: Literal["A2", "B1", "B2"] = "B1"


class WritingCorrection(BaseModel):
    original: str
    corrected: str
    explanation: str | None = None


class WritingFeedbackDetail(BaseModel):
    grammar: str
    vocabulary: str
    register: str
    structure: str
    cohesion: str
    taskCompletion: str
    corrections: list[WritingCorrection] = []


class WritingEvaluationResult(BaseModel):
    score: int
    levelEstimate: str
    feedback: WritingFeedbackDetail
