# Homework Wiki

## Getting Started

### Prerequisites

Ensure you have [Python 3.11+](https://www.python.org/downloads/) and [Node.js 20+](https://nodejs.org/) installed on your system before proceeding.

### Create python environment

1. Create a virtual environment:

    ```bash
    python3 -m venv venv
    ```

2. Activate the virtual environment:

    - On macOS/Linux:

        ```bash
        source venv/bin/activate
        ```

    - On Windows:

        ```bash
        .\venv\Scripts\activate
        ```

### Run backend (FastAPI)

1. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

2. Run the FastAPI server:

    ```bash
    uvicorn api.index:app --reload
    ```

3. The API will be available at [http://localhost:8000](http://localhost:8000)

### Run frontend (NextJS)

> **Note:** Open a new terminal window before starting the frontend server.

1. Change directory

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the Next.js development server:

    ```bash
    npx next dev
    ```

4. The frontend will be available at [http://localhost:3000](http://localhost:3000)

### How to run migrations?

1. Make sure your virtual environment is activated.

2. Run the following command to apply migrations:

    ```bash
    alembic upgrade head
    ```

3. To create a new migration after modifying models:

    ```bash
    alembic revision --autogenerate -m "your message here"
    ```

4. Then apply the new migration:

    ```bash
    alembic upgrade head
    ```
