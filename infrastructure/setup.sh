#!/bin/bash

sudo su

# Update / Upgrade apt packages
apt update
apt dist-upgrade -y


# Install system dependencies

apt install -y \
  bash-completion \
  curl \
  fasd \
  gnome-tweak-tool \
  htop \
  moreutils \
  shellcheck \
  snapd \
  software-properties-common \
  tilix \
  tldr \
  tree \
  haproxy \
  git \
  nodejs \
  python3 \
  python3-venv \
  libaugeas0

# Install docker

apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
apt-key fingerprint 0EBFCD88 | grep docker@docker.com || exit 1
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce
docker run --rm hello-world


# Config docker

groupadd docker
usermod -aG docker $USER
systemctl restart docker


# Config Dev dependencies

npm install -g @angular/cli
npm i -g @nestjs/cli

# Config Firewall

firewall-cmd --permanent --zone=public --add-service=http

# Config and install Certbot

python3 -m venv /opt/certbot/
/opt/certbot/bin/pip install --upgrade pip
/opt/certbot/bin/pip install certbot certbot-apache
ln -s /opt/certbot/bin/certbot /usr/bin/certbot

# Create Certificate for domain, change $MyDomain and myEmail@email.com

certbot certonly --standalone -d $MyDomain --non-iteractive --agree-tos --email myEmail@email.com --http-01-port=8888