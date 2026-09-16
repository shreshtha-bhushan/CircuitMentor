"""CircuitMentor API — FastAPI application entry point."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.config import settings
from app.db import engine
from app.models import Base
from app.routers.parts import router as parts_router
from app.routers.projects import router as projects_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup (dev convenience). Use Alembic in production."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="CircuitMentor API",
    description="AI-mentored circuit simulation learning platform",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(parts_router)


@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok", "service": "circuitmentor-api"}
