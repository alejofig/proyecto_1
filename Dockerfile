FROM python:3.9
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt
RUN pip3 install gunicorn

COPY . /app

RUN export FLASK_APP=app.py

CMD ["gunicorn", "--bind", "0.0.0.0:3003", "--workers", "4", "app.app:app"]