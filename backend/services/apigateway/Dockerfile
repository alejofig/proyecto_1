FROM python:3.9
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
EXPOSE 3001
ENV FLASK_APP=app.py
CMD ["flask", "run", "--host=0.0.0.0", "--port=3001"]
