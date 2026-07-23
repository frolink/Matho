# Redis (local development)

Used for caching and, in a later phase, session/rate-limit storage and the
job queue behind notifications. No custom `redis.conf` is required yet —
the stock `redis:7-alpine` defaults are used in `docker-compose.yml`.
