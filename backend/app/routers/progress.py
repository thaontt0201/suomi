from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.user import User
from app.models.practice_result import PracticeResult
from app.routers.deps import get_current_user

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/summary")
async def get_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PracticeResult)
        .where(PracticeResult.user_id == current_user.id)
        .order_by(PracticeResult.created_at.desc())
        .limit(50)
    )
    records = result.scalars().all()

    speaking = [r for r in records if r.skill == "speaking"]
    writing = [r for r in records if r.skill == "writing"]

    return {
        "total_sessions": len(records),
        "speaking": {
            "count": len(speaking),
            "avg_score": round(sum(r.score or 0 for r in speaking) / len(speaking), 2) if speaking else 0,
            "recent_scores": [{"score": r.score, "type": r.type, "created_at": r.created_at} for r in speaking[:10]],
        },
        "writing": {
            "count": len(writing),
            "avg_score": round(sum(r.score or 0 for r in writing) / len(writing), 2) if writing else 0,
            "recent_scores": [{"score": r.score, "created_at": r.created_at} for r in writing[:10]],
        },
        "level_estimate": current_user.level_estimate or "B1",
    }


@router.get("/history")
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PracticeResult)
        .where(PracticeResult.user_id == current_user.id)
        .order_by(PracticeResult.created_at.desc())
        .limit(100)
    )
    records = result.scalars().all()
    return [
        {
            "id": str(r.id),
            "skill": r.skill,
            "type": r.type,
            "score": r.score,
            "feedback": r.feedback,
            "created_at": r.created_at,
        }
        for r in records
    ]
