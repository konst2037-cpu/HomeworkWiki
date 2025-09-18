from sqlmodel import Session, create_engine, SQLModel
import os

sqlite_file_name = 'database.db'
sqlite_url = f'sqlite:///{sqlite_file_name}'
DATABASE_URL = os.getenv('PGDATABASE_URL', sqlite_url)
engine = create_engine(DATABASE_URL, echo=True)


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
