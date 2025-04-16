# Use an official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY Backend/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install psycopg2-binary

# Copy project files
COPY . /app/

# Run migrations and start server (for production use gunicorn instead)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
