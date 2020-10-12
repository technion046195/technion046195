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
        locales \
        jq \
        && \
    rm -rf /var/lib/apt/lists/*

## Set locale
## ==========
RUN sudo sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    sudo locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8  

## Install Node.js + npm
## =====================
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 10.22.0
RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
RUN npm install -g gatsby-cli@^2.12.77

# ## Create a non-root user
# ## ======================
# ARG USERNAME=user
# ARG USER_UID=1000
# ARG USER_GID=$USER_UID
# RUN groupadd --gid $USER_GID $USERNAME \
#     && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
#     && apt-get update \
#     && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
#     && chmod 0440 /etc/sudoers.d/$USERNAME
# USER $USERNAME

## Setup project folder
## ====================
# RUN sudo mkdir /project && \
#     sudo chmod 777 /project && \
#     mkdir -p /project/app
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

# ## Install Oh-My-Zsh
# ## =================
# RUN sudo chsh -s $(which zsh) user
# RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
#     git clone https://github.com/zsh-users/zsh-syntax-highlighting $HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting && \
#     git clone https://github.com/zsh-users/zsh-autosuggestions $HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions && \
#     sed -i "s/^plugins=(\(.*\))$/plugins=(\1 zsh-autosuggestions zsh-syntax-highlighting)/" /home/user/.zshrc
# # RUN sed -i -e "s/ZSH_THEME=.*/ZSH_THEME=garyblessington/" ~/.zshrc 

RUN echo 'echo "It seems like the project folder was not mounted into the container. Please run the container using the following command:\n"' > /project/app/docker-entrypoint.sh && \
    echo 'echo "    $ docker run -it --rm -v "$PWD:/project/app" --net=host omeryair/technion_course:v0.1"' >> /project/app/docker-entrypoint.sh
CMD ["/usr/bin/dumb-init", "--", "/project/app/docker-entrypoint.sh"]