#!/bin/bash
# Run migrations
alembic upgrade head

# Then start the app
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
