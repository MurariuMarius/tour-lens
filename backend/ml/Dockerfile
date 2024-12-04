FROM nvidia/cuda:12.6.3-cudnn-devel-ubuntu24.04


RUN apt-get update --yes --quiet && DEBIAN_FRONTEND=noninteractive apt-get install --yes --quiet --no-install-recommends \
    software-properties-common \
    build-essential apt-utils \
    wget curl vim git ca-certificates kmod \
    nvidia-driver-525 \
    && rm -rf /var/lib/apt/lists/*

    RUN add-apt-repository --yes ppa:deadsnakes/ppa && apt-get update --yes --quiet

RUN apt-get update \
    #  && dpkg -i libgl1-mesa-glx_23.0.4-0ubuntu1.24.04.1_amd64.deb \
     && apt-get install -y \
         libx11-xcb1 \
     && apt-get clean all \
     && rm -r /var/lib/apt/lists/*

     RUN add-apt-repository ppa:deadsnakes/ppa -y

COPY requirements.txt .

     RUN apt-key update
     RUN apt remove pipx
     RUN apt-get install -y python3.11 python3.11-dev python3.11-distutils
     RUN apt-get remove --purge pip
     RUN apt-get install -y python3-pip
     RUN python3.11 -m pip install --ignore-installed --upgrade pip
    RUN python3.11 -m pip install --ignore-installed --no-cache-dir -r requirements.txt
    RUN python3.11 -m pip install --ignore-installed torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
    RUN python3.11 -m pip uninstall numpy -y
    RUN python3.11 -m pip install "numpy<1.26.4" scikit-learn accelerate tensorboardX



# RUN pip install -r requirements.txt

# Copy project
COPY . .

# Expose the port Flask is running on
EXPOSE 5000

# Set environment variable for Flask
ENV FLASK_APP=app.py

# Command to run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]