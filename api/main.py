from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import Session

from api.data import generate_homework_data, generate_schools_data
from api.db import engine
from api.models import SQLModel
from api.routes.v1.homework import router as homework_router
from api.routes.v1.school import router as school_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs at startup
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Create 5 schools
        schools = generate_schools_data()
        session.add_all(schools)
        session.commit()

        # Create 5 homeworks
        # Get school ids from the created schools
        school_ids = [school.id for school in schools]

        homeworks = generate_homework_data(school_ids=school_ids)
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
