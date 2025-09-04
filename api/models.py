from enum import StrEnum

from sqlmodel import Field, SQLModel
from sqlalchemy import Column, Date
from datetime import datetime
from datetime import date


class GPTStatus(StrEnum):
    APPROVED = "approved"
    REJECTED = "rejected"


class School(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)


class Homework(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    subject: str = Field(max_length=100)
    delivery_date: date = Field(sa_column=Column(Date))
    content: str = Field(max_length=1000)
    user_id: str = Field()
    gpt_reasoning: str | None = Field(default=None, max_length=1000)
    gpt_status: GPTStatus = Field(default=GPTStatus.APPROVED)
    created_date: datetime = Field(default_factory=datetime.now)
    updated_date: datetime = Field(default_factory=datetime.now)
    school_id: int = Field(foreign_key="school.id")
    grade_id: int = Field()
    class_id: int = Field()
