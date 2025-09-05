from openai import OpenAI
from pydantic import BaseModel
from enum import Enum


prompt = (
    "You are a validator. Check if the provided content is related to homework. "
    "Do not allow strong language or adult content. "
)


class ContentResponse(BaseModel):
    class StatusEnum(str, Enum):
        APPROVED = "Approved"
        REJECTED = "Rejected"

    status: StatusEnum
    reason: str | None = None


class ContentValidator:
    def __init__(self):
        self.client = OpenAI()

    def generate_response(self, query: str) -> ContentResponse:
        try:
            response = self.client.responses.parse(
                model="gpt-4o",
                input=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": query},
                ],
                text_format=ContentResponse,
            )
            return response.output_parsed
        except Exception as e:
            raise e
