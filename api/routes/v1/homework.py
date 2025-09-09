from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlmodel import select

from api.db import get_session as SessionDep
from api.models import Homework, GPTStatus
from api.service import ContentValidator
from fastapi import HTTPException

router = APIRouter(prefix="/v1", tags=["homework"])


@router.get("/homeworks", response_model=list[Homework], status_code=200)
def read_homeworks(
    session: SessionDep = Depends(SessionDep),
    offset: int = 0,
    limit: int = Query(default=None, le=100),
    delivery_date: date | None = Query(default=None),
    school_id: int | None = Query(default=None),
    grade_id: int | None = Query(default=None),
    class_id: int | None = Query(default=None),
):
    query = select(Homework).offset(offset)
    if limit:
        query = query.limit(limit)
    filters = [
        (Homework.delivery_date == delivery_date) if delivery_date else None,
        (Homework.school_id == school_id) if school_id else None,
        (Homework.grade_id == grade_id) if grade_id else None,
        (Homework.class_id == class_id) if class_id else None,
    ]
    for f in filters:
        if f is not None:
            query = query.where(f)
    return session.exec(query).all()


@router.post("/homeworks", response_model=Homework, status_code=201)
def create_homework(
    homework: Homework,
    session: SessionDep = Depends(SessionDep),
    validator: ContentValidator = Depends(ContentValidator),
):
    try:
        response = validator.generate_response(
            f"Subject: {homework.subject}. Homework: {homework.content}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if response.status == GPTStatus.REJECTED:
        raise HTTPException(
            status_code=422,
            detail="Sorry, we cannot publish this record at the moment.",
        )

    homework.gpt_reasoning = response.reason
    homework.gpt_status = response.status
    homework.delivery_date = date.fromisoformat(homework.delivery_date)
    session.add(homework)
    session.commit()
    session.refresh(homework)
    return homework


@router.get(
    "/homeworks/{homework_id}", response_model=Homework, status_code=200
)
def read_homework(
    homework_id: int,
    session: SessionDep = Depends(SessionDep),
):
    homework = session.get(Homework, homework_id)
    return homework


@router.delete("/homeworks/{homework_id}", status_code=204)
def delete_homework(
    homework_id: int,
    session: SessionDep = Depends(SessionDep),
):
    homework = session.get(Homework, homework_id)
    if homework:
        session.delete(homework)
        session.commit()


@router.put(
    "/homeworks/{homework_id}", response_model=Homework, status_code=200
)
def update_homework(
    homework_id: int,
    homework: Homework,
    session: SessionDep = Depends(SessionDep),
):
    existing_homework: Homework | None = session.get(Homework, homework_id)
    if existing_homework:
        update_data = homework.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(existing_homework, key, value)
        session.commit()
        session.refresh(existing_homework)
        return existing_homework
    return None
