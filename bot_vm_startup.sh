sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
sudo systemctl start docker
sudo systemctl enable docker
docker login ghcr.io
# type in your github username and access token

# create a .env file with the following variables:
# USER_ID=your_whatsapp_username
# WHATSAPP_AUTH=remote
# MONGO_URI=your_mongodb_uri

docker run --env-file .env -d --name textcommander ghcr.io/eladkishon/textcommander:latest



