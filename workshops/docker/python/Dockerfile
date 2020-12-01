FROM python:3.7-slim

# Adding application code to the Docker Image
COPY ./app.py /app.py
COPY ./fizzbuzz.py /fizzbuzz.py

# Updating pip
RUN pip3 install --upgrade pip

# Installing python dependencies
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# Running as a non-root USER
RUN adduser --uid 1000 --system user
USER 1000

# Exposing port 8080 to network traffic
EXPOSE 8080

# Command to start the docker container
ENTRYPOINT ["python", "app.py"]
