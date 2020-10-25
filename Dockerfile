FROM ubuntu:18.04

## Install general packages
## ========================
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
    apt-get install -y \
        sudo \
        git \
        curl \
        dumb-init \
        python3 \
        python3-dev \
        python3-pip \
        pylint \
        pandoc \
        texlive-xetex \
        texlive-lang-arabic \
        locales \
        jq \
        fonts-humor-sans \
        && \
    rm -rf /var/lib/apt/lists/*

## Set locale
## ==========
RUN sudo sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    sudo locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8  

## Install Pandoc
## ==============
RUN curl -L https://github.com/jgm/pandoc/releases/download/2.10.1/pandoc-2.10.1-1-amd64.deb --output /tmp/pandoc-2.10.1-1-amd64.deb && \
    dpkg -i /tmp/pandoc-2.10.1-1-amd64.deb && \
    rm /tmp/pandoc-2.10.1-1-amd64.deb 

## Install Node.js + npm
## =====================
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 12.19.0
RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
RUN npm install -g gatsby-cli@^2.12.77

## Setup project folder
## ====================
RUN mkdir -p /project/app
WORKDIR /project/app

## Install site dependencies
## =========================
COPY ./package.json /project/app/package.json
RUN cd /project/app && \
    npm install && \
    npm cache clean --force && \
    mv node_modules ../
    # chmod ag+w -R /project/node_modules

## Setup python packages
## =====================
COPY ./pip_requirements.txt /project/app/pip_requirements.txt
RUN pip3 install -r /project/app/pip_requirements.txt && sudo rm -r /root/.cache/pip
ENV MPLBACKEND=Agg
## Import matplotlib the first time to build the font cache.
RUN python3 -c "import matplotlib.pyplot"

## Setup Jupyter extensions
## ------------------------
RUN jupyter contrib nbextension install --system && \
    jupyter nbextensions_configurator enable && \
    jupyter nbextension enable spellchecker/main

COPY ./src/styles/style.css /root/.jupyter/custom/custom.css

RUN echo 'echo "It seems like the project folder was not mounted into the container. Please run the container using the following command:\n"' > /project/app/docker-entrypoint.sh && \
    echo 'echo "    $ docker run -it --rm -v "$PWD:/project/app" --net=host omeryair/technion_course:v0.1"' >> /project/app/docker-entrypoint.sh
CMD ["/usr/bin/dumb-init", "--", "/project/app/docker-entrypoint.sh"]