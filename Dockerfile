FROM arm32v7/python:3

WORKDIR /usr/src/app
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
RUN . $HOME/.cargo/env
RUN pip install --upgrade pip setuptools
COPY *.txt ./
RUN export PATH="$HOME/.cargo/bin:$PATH" && pip install --no-cache-dir -r requirements.txt



ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
COPY opyweb ./opyweb/
COPY opyweb.egg-info ./opyweb.egg-info/
COPY .coveragerc ./.coveragerc/
COPY *.ini *.in setup.py ./

RUN pip install -e .
CMD [ "pserve", "production.ini", "--reload" ]