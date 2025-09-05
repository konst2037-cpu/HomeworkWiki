from openai import OpenAI
from pydantic import BaseModel
from api.models import GPTStatus


prompt = """You are managing a public record of school homework. Pupils are submitting homework records for school subjects. Your task is to analyse the proposed records and decide if they should be published in the public record. The homework is: “XXX”. The subject is “YYY”. Here are some criteria: 
It should be plausible that the record is a homework for the given subject. 
The suggested record must not use strong language and must not be insulting to anyone. 
The suggested record must not mention attributes or give names to any person. """


class ContentResponse(BaseModel):
    status: GPTStatus
    reason: str


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
