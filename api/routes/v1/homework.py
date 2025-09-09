from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlmodel import select

from api.db import get_session as SessionDep
from api.models import GPTStatus, Homework
from api.service import ContentValidator

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
    "/homeworks/stats",
    response_model=dict,
    status_code=200,
)
@router.get("/homeworks/stats")
def homework_stats(
    group_by: str = Query(
        ..., description="Field to group by, e.g. 'delivery_date'"
    ),
    metric: str = Query(
        "count", description="Aggregation metric: count, sum, avg"
    ),
    field: Optional[str] = Query(
        None, description="Field for sum/avg metrics"
    ),
    session: SessionDep = Depends(SessionDep),
    school_id: Optional[int] = Query(None, description="Filter by school_id"),
    grade_id: Optional[int] = Query(None, description="Filter by grade_id"),
    class_id: Optional[int] = Query(None, description="Filter by class_id"),
    delivery_date: Optional[date] = Query(
        None, description="Filter by delivery_date"
    ),
):
    column_map = {
        "delivery_date": Homework.delivery_date,
        "school_id": Homework.school_id,
        "grade_id": Homework.grade_id,
        "class_id": Homework.class_id,
    }

    if group_by not in column_map:
        raise HTTPException(status_code=400, detail="Invalid group_by field")

    group_col = column_map[group_by]

    # Select metric
    if metric == "count":
        agg = func.count()
    elif metric == "sum":
        if not field or field not in column_map:
            raise HTTPException(
                status_code=400, detail="Missing or invalid field for sum"
            )
        agg = func.sum(column_map[field])
    elif metric == "avg":
        if not field or field not in column_map:
            raise HTTPException(
                status_code=400, detail="Missing or invalid field for avg"
            )
        agg = func.avg(column_map[field])
    elif metric == "distinct":
        pass
    else:
        raise HTTPException(status_code=400, detail="Unsupported metric")

    if metric == "distinct":
        stmt = select(group_col).distinct()
    else:
        stmt = select(group_col, agg).group_by(group_col)

    # Apply filters
    filters = [
        (Homework.school_id == school_id) if school_id else None,
        (Homework.grade_id == grade_id) if grade_id else None,
        (Homework.class_id == class_id) if class_id else None,
        (Homework.delivery_date == delivery_date) if delivery_date else None,
    ]
    for f in filters:
        if f is not None:
            stmt = stmt.where(f)

    results = session.exec(stmt).all()

    if metric == "distinct":
        results = [g for g in results]
    else:
        results = [{group_by: g, metric: v} for g, v in results]

    return {
        "group_by": group_by,
        "metric": metric,
        "filters": {
            "school_id": school_id,
            "grade_id": grade_id,
            "class_id": class_id,
            "delivery_date": delivery_date,
        },
        "results": results,
    }


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
