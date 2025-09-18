import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from api.db import get_session
from api.models import FalseReport

router = APIRouter(prefix='/v1', tags=['false_report'])

logger = logging.getLogger(__name__)


@router.post(
    '/false_reports',
    response_model=FalseReport,
    status_code=201,
    summary='Create a new false report',
    description='Create a new false report entry in the database.',
    response_description='The created false report.',
)
def create_false_report(
    false_report: FalseReport,
    session: Session = Depends(get_session),
) -> FalseReport:
    try:
        session.add(false_report)
        session.commit()
        session.refresh(false_report)
        return false_report
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=400,
            detail='Integrity error occurred while creating false report.',
        )
