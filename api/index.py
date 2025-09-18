from dotenv import load_dotenv
from fastapi import FastAPI
from api.routes.v1.class_ import router as class_router
from api.routes.v1.false_report import router as false_report_router
from api.routes.v1.grade import router as grade_router
from api.routes.v1.homework import router as homework_router
from api.routes.v1.school import router as school_router

_ = load_dotenv()

app = FastAPI()
app.include_router(school_router, prefix='/api', tags=['school'])
app.include_router(homework_router, prefix='/api', tags=['homework'])
app.include_router(grade_router, prefix='/api', tags=['grade'])
app.include_router(class_router, prefix='/api', tags=['class'])
app.include_router(false_report_router, prefix='/api', tags=['false_report'])


@app.get('/health')
def read_health():
    return {'status': 'healthy'}
