from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlmodel import select

from api.db import get_session as SessionDep
from api.models import School

router = APIRouter(prefix="/v1", tags=["school"])


@router.get("/schools", response_model=list[School], status_code=200)
def read_schools(
    session: SessionDep = Depends(SessionDep),
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 10,
):
    schools = session.exec(select(School).offset(offset).limit(limit)).all()
    return schools


@router.post("/schools", response_model=School, status_code=201)
def create_school(
    school: School,
    session: SessionDep = Depends(SessionDep),
):
    session.add(school)
    session.commit()
    session.refresh(school)
    return school


@router.get("/schools/{school_id}", response_model=School, status_code=200)
def read_school(
    school_id: int,
    session: SessionDep = Depends(SessionDep),
):
    school = session.get(School, school_id)
    return school


@router.delete("/schools/{school_id}", status_code=204)
def delete_school(
    school_id: int,
    session: SessionDep = Depends(SessionDep),
):
    school = session.get(School, school_id)
    if school:
        session.delete(school)
        session.commit()


@router.put("/schools/{school_id}", response_model=School, status_code=200)
def update_school(
    school_id: int,
    school: School,
    session: SessionDep = Depends(SessionDep),
):
    existing_school: School | None = session.get(School, school_id)
    if existing_school:
        update_data = school.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(existing_school, key, value)
        session.commit()
        session.refresh(existing_school)
        return existing_school
    return None
