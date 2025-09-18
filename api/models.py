from datetime import date, datetime
from enum import StrEnum

from sqlalchemy import String
from sqlmodel import Field, SQLModel


class GPTStatus(StrEnum):
    APPROVED = 'approved'
    REJECTED = 'rejected'


class School(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, sa_type=String)


class Grade(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, sa_type=String)


class Class(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, sa_type=String)


class Homework(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    subject: str = Field(max_length=20, sa_type=String)
    delivery_date: date = Field(index=True)
    content: str = Field(max_length=100, sa_type=String)
    user_id: str = Field(sa_type=String)
    gpt_reasoning: str | None = Field(default=None, max_length=1000, sa_type=String)
    gpt_status: GPTStatus = Field(default=GPTStatus.APPROVED)
    created_date: datetime = Field(default_factory=datetime.now)
    updated_date: datetime = Field(default_factory=datetime.now)
    school_id: int = Field(foreign_key='school.id')
    grade_id: int = Field(foreign_key='grade.id')
    class_id: int = Field(foreign_key='class.id')


class FalseReport(SQLModel, table=True):
    __tablename__ = 'false_report'  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(sa_type=String)
    homework_id: int = Field(foreign_key='homework.id', unique=True)
    created_at: datetime = Field(default_factory=datetime.now)
