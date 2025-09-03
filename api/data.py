from datetime import datetime, timedelta

from api.models import GPTStatus, Homework, School


def generate_schools_data():
    return [
        School(name="Greenwood High"),
        School(name="Riverdale Academy"),
        School(name="Sunrise Public School"),
        School(name="Hilltop School"),
        School(name="Maple Leaf School"),
    ]


def generate_homework_data(school_ids, total=100, same_date_count=20):
    homework_data = []
    today = datetime.now()
    user_ids = ["user1", "user2", "user3"]  # Example user IDs
    subjects = ["Math", "Science", "History", "English"]
    contents = [
        "Algebra exercises",
        "Physics lab",
        "World War II essay",
        "Poetry analysis",
    ]

    # Only generate homework for the next 14 days
    max_days = 14
    entries_to_generate = min(total, max_days)
    same_date_count = min(same_date_count, entries_to_generate)

    # Generate homework entries with the same delivery date
    same_date = (today + timedelta(days=1)).strftime("%Y-%m-%d")
    for i in range(same_date_count):
        homework_data.append(
            Homework(
                subject=subjects[i % len(subjects)],
                delivery_date=same_date,
                content=contents[i % len(contents)],
                user_id=user_ids[i % len(user_ids)],
                school_id=school_ids[i % len(school_ids)],
                gpt_reasoning="Relevant to curriculum",
                gpt_status=GPTStatus.APPROVED,
            )
        )
    # Generate the rest with unique future delivery dates (up to 14 days)
    for i in range(same_date_count, entries_to_generate):
        future_date = (today + timedelta(days=(i % max_days))).isoformat()
        homework_data.append(
            Homework(
                subject=subjects[i % len(subjects)],
                delivery_date=future_date,
                content=contents[i % len(contents)],
                user_id=user_ids[i % len(user_ids)],
                school_id=school_ids[i % len(school_ids)],
                gpt_reasoning="Relevant to curriculum",
                gpt_status=GPTStatus.APPROVED,
            )
        )
    return homework_data
