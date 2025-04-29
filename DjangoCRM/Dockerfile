# Usa una imagen oficial de Python como base
FROM python:3.13.2-slim-bookworm



ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


WORKDIR /app


RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    apt-get clean


COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt


COPY . .

RUN python manage.py collectstatic --noinput


EXPOSE 8000


CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers=4", "--threads=2", "--timeout=120"]

