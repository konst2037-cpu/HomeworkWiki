from fastapi import APIRouter, Depends, Query
from sqlmodel import select

from api.db import get_session as SessionDep
from api.models import Class


router = APIRouter(prefix="/v1", tags=["class"])


@router.get("/classes", response_model=list[Class], status_code=200)
def read_classes(
    session: SessionDep = Depends(SessionDep),
    offset: int = 0,
    limit: int = Query(default=None, le=100),
):
    query = select(Class).offset(offset)
    if limit:
        query = query.limit(limit)
    return session.exec(query).all()
