git pull origin main
sleep 2
sudo docker build -t ghcr.io/ogwen123/home-api .
sleep 2
sudo docker push ghcr.io/ogwen123/home-api:latest

sudo docker compose down -v
sleep 2
sudo docker compose up --pull always -d
