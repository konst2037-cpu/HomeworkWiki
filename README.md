# Homework Wiki

## Getting Started

### Docker development

> **Note:** Assuming, that you have docker desktop installed in your system.

```bash
docker compose up -d
```

Above command bring up all the required service and you can access the HomeworkWiki application at [http://localhost:3000](http://localhost:3000)

**Load sample data using this command:**

Its create sample schools, grades, classes and 100k homeworks.

```bash
docker compose run --rm api bash -c "cd /app && python scripts/load_sample_data.py"
```

### Local Developement

Ensure you have [Python 3.11+](https://www.python.org/downloads/) and [Node.js 20+](https://nodejs.org/) installed on your system before proceeding.

#### Create python environment

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

#### Run backend (FastAPI)

1. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

2. Run the FastAPI server:

    ```bash
    uvicorn api.index:app --reload
    ```

3. The API will be available at [http://localhost:8000](http://localhost:8000)

#### Run frontend (NextJS)

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

## Infrastructure

| Component | Service                | Azure Resource Type         | Notes                        |
|-----------|------------------------|-----------------------------|------------------------------|
| Frontend  | Next.js App            | Azure Web App (App Service) | Deployed via container image |
| API       | FastAPI                | Azure Container Apps         | Deployed via container image |
| Database  | PostgreSQL             | Azure Database for PostgreSQL| Managed database service     |

## Deployment

### Build container image

Log in to Azure Container Registry (ACR):

```bash
az acr login --name homeworkwiki
```

### For API and upload to ACR

1. Build the Docker image:

    ```bash
    docker build -t homeworkwiki.azurecr.io/homework-wiki-api:<tag> --platform linux/amd64 -f Dockerfile.api .
    ```

2. Push the image to ACR:

    ```bash
    docker push homeworkwiki.azurecr.io/homework-wiki-api:<tag>
    ```

### For Frontend and upload to ACR

1. Build the Docker image:

    ```bash
    docker build -t homeworkwiki.azurecr.io/homework-wiki:<tag> --platform linux/amd64 -f Dockerfile.api .
    ```

2. Push the image to ACR:

    ```bash
    docker push homeworkwiki.azurecr.io/homework-wiki:<tag>
    ```

> **Note:**
> Update new image version in for both frontend and backend.
