# garage-sale-n2

## Build Setup

### For Сontainerization (Docker)

```bash
# Star dev
$ docker-compose --env-file ./env/nuxt.env up garage-sale

# Stop
$ docker-compose down

# For update nuxt image. (Install new dependency or add new code)
$ docker-compose build garage-sale
```

```
Create env directory in project root. With files: db.env and nuxt.env.
| env
  | db.env
  | nuxt.env

Set env. vars for db.env:
MONGO_INITDB_ROOT_USERNAME=mongoadmin
MONGO_INITDB_ROOT_PASSWORD=secret

Set env. vars for nuxt.env:
MONGO_INITDB_ROOT_USERNAME=mongoadmin
MONGO_INITDB_ROOT_PASSWORD=secret
MONGO_INITDB_PROTOCOL=mongodb
MONGO_INITDB_CONNECTION=mongodb:27017/garage-sale?authSource=admin
FULL_HOST_NAME=http://localhost:3000
NODE_ENV=dev
PORT=3000
JWT_PASSWORD=secret
SENDGRID_KEY=******** (generate your own key on https://sendgrid.com/. In is need for mail sending)
MAX_UPLOAD_IMG_SIZE=4000000
SUPPORTED_IMAGE_FORMATS=jpg,jpeg,png
SITE_EMAIL=noreply@em5894.garage-sale.me
SITE_FB_EMAIL=egor.dorosh.v@gmail.com
NODE_EXTRA_CA_CERTS=/app/server/ssl/intermediate.pem
```

### For localhost (Without docker)

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## SSH connect

Use CLI.

Navigate to directoy with key-pair file.

```bash
# For first connection
$ chmod 400 garage-sale-1.pem

# Connection. use current IP from EC2
$ ssh -i "garage-sale.pem" ec2-user@ec2-3-9-113-229.eu-west-2.compute.amazonaws.com
```

## Install docker on EC2

```bash
# Update packages on remote machine
$ sudo yum update -y

# Docker install
$ sudo amazon-linux-extras install docker

# Start docker
$ sudo service docker start

# Check docker is installed.
$ docker --version

# Install composer
$ sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose

$ docker-compose version

# If docker compose Got permission denied
$ sudo groupadd docker

$ sudo usermod -aG docker $USER

$ newgrp docker

# Reboot if still got error
$ reboot
```

## Push image to Docker HUB

```bash
# Rename image. Image name should start from account name in repo
docker tag garage-sale:0.1.0 egordoroshv/garage-sale:0.1.0

# Use docker account name and pass
$ docker login

# Push to repo
$ docker push egordoroshv/garage-sale:0.1.0
```

## Run container on EC2

```bush
sudo docker run -d --rm -p 80:80 --env-file .env egordoroshv/garage-sale:0.1.0
```

## Deploy to prod

### Locale
```bash
# Build image
$ docker build -t egordoroshv/garage-sale:1.0.0 -f prod.dockerfile .

# Use docker account name and pass
$ docker login

# Push to repo
$ docker push egordoroshv/garage-sale:1.0.0
```

### EC2
#### Filezilla
- Protocol: SFTP
- HOST: 3.9.113.229
- Logon: Type: Key file
- User: ec2-user
- Key-file: use downloaded key file

**Copy .env file to EC2 /home/ec2-user**

**Copy docker-compose.prod.yaml file to EC2 /home/ec2-user**

#### Run docker container
```bash
# Start docker. If instance was shut down.
$ sudo service docker start

# Forced pull image for update image (docker or docker compose)
$ sudo docker pull egordoroshv/garage-sale:1.0.0

$ docker-compose -f docker-compose.prod.yaml pull garage-sale

# Run container (docker or docker compose)
sudo docker run -d --rm -p 80:80 -p 443:443 --name garage-sale --env-file ./.env egordoroshv/garage-sale:1.0.0

docker-compose -f docker-compose.prod.yaml up garage-sale -d

# Stop container (docker or docker compose)
sudo docker stop garage-sale

docker-compose -f docker-compose.prod.yaml down
```

### CLI in container
```bash
$ sudo docker exec -it garage-sale /bin/bash

$ sudo docker exec -it ec2-user-garage-sale-1 /bin/bash
```