from datetime import datetime, timedelta
from typing import List

from api.models import Class, GPTStatus, Grade, Homework, School


def generate_schools_data():
    return [
        School(name='Greenwood High'),
        School(name='Riverdale Academy'),
        School(name='Sunrise Public School'),
        School(name='Hilltop School'),
        School(name='Maple Leaf School'),
    ]


def generate_grades_data():
    return [Grade(name=str(i)) for i in range(1, 13)]


def generate_classes_data():
    return [Class(name=c.lower()) for c in ['A', 'B', 'C', 'D', 'E', 'F']]


def generate_homework_data(
    school_ids: List[int], total: int = 100, same_date_count: int = 20
) -> List[Homework]:
    homework_data: List[Homework] = []
    today = datetime.now()
    user_ids = ['user1', 'user2', 'user3']  # Example user IDs
    subjects = ['Math', 'Science', 'History', 'English']
    contents = [
        'Algebra exercises',
        'Physics lab',
        'World War II essay',
        'Poetry analysis',
    ]
    grade_levels = [i for i in range(1, 13)]
    class_ids = [i for i in range(1, 7)]

    # Only generate homework for the next 14 days
    max_days = 14

    # Generate homework entries with the same delivery date
    same_date = (today + timedelta(days=1)).date()
    for i in range(same_date_count):
        homework_data.append(
            Homework(
                subject=subjects[i % len(subjects)],
                delivery_date=same_date,
                content=contents[i % len(contents)],
                user_id=user_ids[i % len(user_ids)],
                school_id=school_ids[i % len(school_ids)],
                grade_id=grade_levels[i % len(grade_levels)],
                class_id=class_ids[i % len(class_ids)],
                gpt_reasoning='Relevant to curriculum',
                gpt_status=GPTStatus.APPROVED,
            )
        )

    # Generate the rest with unique future delivery dates (up to 14 days)
    for i in range(same_date_count, total):
        future_date = (today + timedelta(days=(i % max_days))).date()
        homework_data.append(
            Homework(
                subject=subjects[i % len(subjects)],
                delivery_date=future_date,
                content=contents[i % len(contents)],
                user_id=user_ids[i % len(user_ids)],
                school_id=school_ids[i % len(school_ids)],
                grade_id=grade_levels[i % len(grade_levels)],
                class_id=class_ids[i % len(class_ids)],
                gpt_reasoning='Relevant to curriculum',
                gpt_status=GPTStatus.APPROVED,
            )
        )
    return homework_data
