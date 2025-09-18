from fastapi import APIRouter, Depends, Query
from sqlmodel import select, Session

from api.db import get_session
from api.models import Grade


router = APIRouter(prefix='/v1', tags=['grade'])


@router.get('/grades', response_model=list[Grade], status_code=200)
def read_grades(
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = Query(default=None, le=100),
):
    query = select(Grade).offset(offset)
    if limit:
        query = query.limit(limit)
    return session.exec(query).all()
