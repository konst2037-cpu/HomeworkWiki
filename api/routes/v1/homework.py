from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlmodel import select

from api.db import get_session as SessionDep
from api.models import Homework

router = APIRouter(prefix="/v1", tags=["homework"])


@router.get("/homeworks", response_model=list[Homework], status_code=200)
def read_homeworks(
    session: SessionDep = Depends(SessionDep),
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 10,
):
    return session.exec(select(Homework).offset(offset).limit(limit)).all()


@router.post("/homeworks", response_model=Homework, status_code=201)
def create_homework(
    homework: Homework,
    session: SessionDep = Depends(SessionDep),
):
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


@router.get(
    "/homeworks/by_delivery_date/{delivery_date}",
    response_model=list[Homework],
    status_code=200,
)
def read_homeworks_by_delivery_date(
    delivery_date: str,
    session: SessionDep = Depends(SessionDep),
):
    return session.exec(
        select(Homework).where(Homework.delivery_date == delivery_date)
    ).all()


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
