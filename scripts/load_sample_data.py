
from sqlmodel import Session

from api.data import (
    generate_classes_data,
    generate_grades_data,
    generate_homework_data,
    generate_schools_data,
)
from api.db import engine

def run():
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

if __name__ == '__main__':
    run()
