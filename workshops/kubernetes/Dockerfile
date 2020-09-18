FROM python:3.7-slim

COPY ./fizzbuzz.py /fizzbuzz.py

RUN adduser --uid 1000 --system user

# Update pip
RUN pip3 install --upgrade pip

# Install python dependencies
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
RUN pip3 install pipenv --no-cache-dir && \
    pipenv install --system && \
    rm -f Pipfile Pipfile.lock

EXPOSE 8080

USER 1000

ENTRYPOINT ["python", "fizzbuzz.py"]
