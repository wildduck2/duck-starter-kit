🛡️ Security & Production Tips
✅ Use a strong MongoDB password

✅ Add .dockerignore

✅ Avoid exposing MongoDB ports externally (unless needed)

✅ Use HTTPS and reverse proxy (e.g., Nginx or Caddy) in production

✅ Log properly and monitor the container with tools like Prometheus, Loki, etc.

✅ Add health checks (HEALTHCHECK in Dockerfile or x-healthcheck in docker-compose)


