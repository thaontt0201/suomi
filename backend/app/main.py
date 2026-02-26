from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, speaking, writing, vocabulary, progress

app = FastAPI(title="Suomi YKI Practice API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(speaking.router, prefix="/api")
app.include_router(writing.router, prefix="/api")
app.include_router(vocabulary.router, prefix="/api")
app.include_router(progress.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
