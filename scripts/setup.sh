#!/usr/bin/env bash
# MATHO — one-command setup for beginners.
#
# What this does, step by step:
#   1. Checks Docker is installed and running.
#   2. Creates a .env file from .env.example if you don't have one yet,
#      and generates a real random JWT_SECRET for you (never use the
#      placeholder secret in anything other people can reach).
#   3. Builds and starts every service with Docker Compose:
#      Postgres, Redis, database migrations, the API, the web app, and
#      the admin app.
#   4. Prints the URLs you can open in your browser when it's done.
#
# Usage:
#   ./scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "🔎 Checking Docker..."
if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Docker is not installed. Install Docker Desktop first: https://www.docker.com/products/docker-desktop"
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker is installed but not running. Start Docker Desktop, then run this script again."
  exit 1
fi
echo "✅ Docker is ready."

echo ""
echo "🔎 Checking .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example."

  # Generate a real random secret instead of the placeholder one.
  if command -v openssl >/dev/null 2>&1; then
    GENERATED_SECRET=$(openssl rand -hex 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s#^JWT_SECRET=.*#JWT_SECRET=${GENERATED_SECRET}#" .env
    else
      sed -i "s#^JWT_SECRET=.*#JWT_SECRET=${GENERATED_SECRET}#" .env
    fi
    echo "✅ Generated a random JWT_SECRET for you."
  else
    echo "⚠️  openssl not found — please edit .env and set JWT_SECRET to a long random string yourself."
  fi
else
  echo "✅ .env already exists — leaving it as is."
fi

echo ""
echo "🚀 Building and starting MATHO (this can take a few minutes the first time)..."
docker compose up --build -d

echo ""
echo "⏳ Waiting for the API to become healthy..."
ATTEMPTS=0
until docker compose ps api --format '{{.Health}}' 2>/dev/null | grep -q healthy; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -gt 30 ]; then
    echo "⚠️  The API is taking longer than expected. Check logs with: docker compose logs -f api"
    break
  fi
  sleep 2
done

echo ""
echo "🎉 MATHO is running!"
echo "   Web app:        http://localhost:3000"
echo "   Admin app:       http://localhost:3002"
echo "   API + Swagger:  http://localhost:4000/api/docs"
echo ""
echo "Useful commands:"
echo "   docker compose logs -f        # watch logs from every service"
echo "   docker compose down           # stop everything"
echo "   docker compose down -v        # stop everything AND delete the database"
