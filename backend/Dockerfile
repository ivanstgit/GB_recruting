FROM python:3.9.11

RUN apt-get update \
    && apt-get install -y postgresql postgresql-contrib libpq-dev python3-dev

RUN pip3 install --upgrade pip

COPY ./ ./
RUN rm /config/settings.py

RUN pip3 install -r requirements.txt
RUN pip3 install gunicorn
