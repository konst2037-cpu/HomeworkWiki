from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from sqlmodel import Session

from api.data import (
    generate_classes_data,
    generate_grades_data,
    generate_homework_data,
    generate_schools_data,
)
from api.db import engine
from api.routes.v1.class_ import router as class_router
from api.routes.v1.false_report import router as false_report_router
from api.routes.v1.grade import router as grade_router
from api.routes.v1.homework import router as homework_router
from api.routes.v1.school import router as school_router

_ = load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _ = app  # Suppress unused variable warning

    # Runs at startup
    with Session(engine) as session:
        # Create 5 schools
        schools = generate_schools_data()
        grades = generate_grades_data()
        classes = generate_classes_data()
        session.add_all(schools)
        session.add_all(grades)
        session.add_all(classes)
        session.commit()

        # Create 5 homeworks
        # Get school ids from the created schools
        school_ids = [school.id for school in schools]

        homeworks = generate_homework_data(school_ids=school_ids, total=100000)
        session.add_all(homeworks)
        session.commit()
    yield


app = FastAPI()
app.include_router(school_router, prefix='/api', tags=['school'])
app.include_router(homework_router, prefix='/api', tags=['homework'])
app.include_router(grade_router, prefix='/api', tags=['grade'])
app.include_router(class_router, prefix='/api', tags=['class'])
app.include_router(false_report_router, prefix='/api', tags=['false_report'])


@app.get('/health')
def read_health():
    return {'status': 'healthy'}
