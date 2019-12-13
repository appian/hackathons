FROM python:3.6-slim

COPY ./server.py /server.py

RUN adduser --uid 1000 --system user
USER 1000

ENTRYPOINT ["python", "server.py"]
