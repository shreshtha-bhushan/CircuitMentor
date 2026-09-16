"""Parts catalog router: search and detail."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Part
from app.schemas import PaginatedResponse, PartRead

router = APIRouter(prefix="/v1/parts", tags=["parts"])


@router.get("", response_model=PaginatedResponse)
async def list_parts(
    q: str | None = Query(default=None, description="Search query"),
    category: str | None = Query(default=None, description="Filter by category"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Search parts catalog with optional query and category filter."""
    stmt = select(Part)
    count_stmt = select(func.count()).select_from(Part)

    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(Part.name.ilike(pattern) | Part.part_id.ilike(pattern))
        count_stmt = count_stmt.where(Part.name.ilike(pattern) | Part.part_id.ilike(pattern))

    if category:
        stmt = stmt.where(Part.category == category)
        count_stmt = count_stmt.where(Part.category == category)

    # Total count
    total = (await db.execute(count_stmt)).scalar() or 0

    # Paginated results
    offset = (page - 1) * page_size
    stmt = stmt.order_by(Part.category, Part.name).offset(offset).limit(page_size)
    result = await db.execute(stmt)
    items = [PartRead.model_validate(p) for p in result.scalars().all()]

    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/{part_id}", response_model=PartRead)
async def get_part(
    part_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single part by its slug (e.g. 'resistor.axial')."""
    result = await db.execute(select(Part).where(Part.part_id == part_id))
    part = result.scalar_one_or_none()
    if not part:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Part not found")
    return part
