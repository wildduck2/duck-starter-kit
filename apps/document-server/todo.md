🛡️ Security & Production Tips
✅ Use a strong MongoDB password

✅ Add .dockerignore

✅ Avoid exposing MongoDB ports externally (unless needed)

✅ Use HTTPS and reverse proxy (e.g., Nginx or Caddy) in production

✅ Log properly and monitor the container with tools like Prometheus, Loki, etc.

✅ Add health checks (HEALTHCHECK in Dockerfile or x-healthcheck in docker-compose)



 sudo docker build -f apps/document-server/docker/Dockerfile.dev -t test .

# Rebuild
sudo docker-compose -f docker/docker-compose.dev.yml build --no-cache

# Run again
sudo docker-compose -f docker/docker-compose.dev.yml up

curl -XPOST 'http://localhost:5000' \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from NestJS!"}'

