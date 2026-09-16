"""Pydantic v2 schemas for request/response validation."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRead(BaseModel):
    id: uuid.UUID
    email: str
    display_name: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Projects ──────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str = Field(default="Untitled circuit", max_length=200)
    board_type: str = Field(default="breadboard", max_length=50)
    goal: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    board_type: str | None = Field(default=None, max_length=50)
    goal: str | None = None


class ProjectRead(BaseModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    title: str
    board_type: str
    goal: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Parts ─────────────────────────────────────────────────────────────────────

class PartRead(BaseModel):
    id: uuid.UUID
    part_id: str
    name: str
    category: str
    description: str | None
    symbol_svg: str | None
    params_schema: dict | None
    pins: dict | None

    model_config = {"from_attributes": True}


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
