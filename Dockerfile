FROM arm32v7/python:3

WORKDIR /usr/src/app

RUN pip install --upgrade pip setuptools

COPY opyweb ./opyweb/
COPY opyweb.egg-info ./opyweb.egg-info/
COPY .coveragerc ./.coveragerc/
COPY *.ini *.in *.txt setup.py ./

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -e .  
CMD [ "pserve", "development.ini", "--reload" ]