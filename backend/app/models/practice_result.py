import uuid
from datetime import datetime
from sqlalchemy import Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class PracticeResult(Base):
    __tablename__ = "practice_results"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    skill: Mapped[str] = mapped_column(Text, nullable=False)  # speaking | writing | vocabulary
    type: Mapped[str | None] = mapped_column(Text)            # kertominen | mielipide | etc.
    score: Mapped[int | None] = mapped_column(Integer)
    feedback: Mapped[dict | None] = mapped_column(JSONB)
    transcript: Mapped[str | None] = mapped_column(Text)
    prompt_text: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="practice_results")
