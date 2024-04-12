# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r backend/services/planes/requirements.txt

# Make port 80 available to the world outside   container
EXPOSE 80

# Define environment variables
ENV MODULE_NAME=app.main

# Run app.py when the container launches
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "3002", "main:app"]
