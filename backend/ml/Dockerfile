FROM python:3.11

RUN apt-get update --yes --quiet && DEBIAN_FRONTEND=noninteractive apt-get install --yes --quiet --no-install-recommends 

COPY requirements.txt .

RUN python3.11 -m pip install --ignore-installed --upgrade pip
RUN python3.11 -m pip install --ignore-installed --no-cache-dir -r requirements.txt
RUN python3.11 -m pip install --ignore-installed torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN python3.11 -m pip uninstall numpy -y
RUN python3.11 -m pip install "numpy<1.26.4" scikit-learn accelerate tensorboardX

COPY . .

EXPOSE 17708

ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=17708"]