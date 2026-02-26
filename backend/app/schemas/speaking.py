from pydantic import BaseModel
from typing import Literal


class SpeakingGenerateRequest(BaseModel):
    level: Literal["A2", "B1", "B2"] = "B1"
    type: Literal["kertominen", "keskustelu", "tilanne", "mielipide"] = "kertominen"
    topic: str | None = None


class SpeakingTask(BaseModel):
    title: str
    instructions: str
    prompt: str
    hints: list[str] = []
    prep_time_seconds: int
    speak_time_seconds: int
    task_type: str
    level: str


class GrammarCorrection(BaseModel):
    original: str
    corrected: str
    explanation: str | None = None


class BetterExpression(BaseModel):
    original: str
    better: str
    explanation: str | None = None


class SpeakingFeedback(BaseModel):
    strengths: list[str] = []
    improvements: list[str] = []
    grammarCorrections: list[GrammarCorrection] = []
    betterExpressions: list[BetterExpression] = []


class SpeakingEvaluationResult(BaseModel):
    score: int
    levelEstimate: str
    feedback: SpeakingFeedback
    transcript: str
