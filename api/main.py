from contextlib import asynccontextmanager

from fastapi import FastAPI

from api.db import engine
from api.models import SQLModel, School, Homework, GPTStatus
from api.routes.v1.school import router as school_router
from api.routes.v1.homework import router as homework_router
from sqlmodel import Session
from datetime import date, timedelta


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs at startup
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Create 5 schools
        schools = [
            School(name="Greenwood High"),
            School(name="Riverdale Academy"),
            School(name="Sunrise Public School"),
            School(name="Hilltop School"),
            School(name="Maple Leaf School"),
        ]
        session.add_all(schools)
        session.commit()

        # Create 5 homeworks
        # Get school ids from the created schools
        school_ids = [school.id for school in schools]

        today = date.today()
        homeworks = [
            Homework(
                subject="Math",
                delivery_date=(today + timedelta(days=10)).isoformat(),
                content="Algebra exercises",
                user_id="user1",
                school_id=school_ids[0],
                gpt_reasoning="Relevant to curriculum",
                gpt_status=GPTStatus.APPROVED,
            ),
            Homework(
                subject="Science",
                delivery_date=(today + timedelta(days=11)).isoformat(),
                content="Physics lab report",
                user_id="user2",
                school_id=school_ids[1],
                gpt_reasoning="Well structured",
                gpt_status=GPTStatus.APPROVED,
            ),
            Homework(
                subject="History",
                delivery_date=(today + timedelta(days=12)).isoformat(),
                content="Essay on World War II",
                user_id="user3",
                school_id=school_ids[2],
                gpt_reasoning="Needs more detail",
                gpt_status=GPTStatus.REJECTED,
            ),
            Homework(
                subject="English",
                delivery_date=(today + timedelta(days=13)).isoformat(),
                content="Book review",
                user_id="user4",
                school_id=school_ids[3],
                gpt_reasoning="Excellent analysis",
                gpt_status=GPTStatus.APPROVED,
            ),
            Homework(
                subject="Art",
                delivery_date=(today + timedelta(days=14)).isoformat(),
                content="Draw a landscape",
                user_id="user5",
                school_id=school_ids[4],
                gpt_reasoning="Creative approach",
                gpt_status=GPTStatus.APPROVED,
            ),
        ]
        session.add_all(homeworks)
        session.commit()
    yield

    # Runs at shutdown
    SQLModel.metadata.drop_all(engine)


app = FastAPI(lifespan=lifespan)
app.include_router(school_router, prefix="/api", tags=["school"])
app.include_router(homework_router, prefix="/api", tags=["homework"])


@app.get("/health")
def read_health():
    return {"status": "healthy"}
