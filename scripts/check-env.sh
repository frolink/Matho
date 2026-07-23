#!/usr/bin/env bash
# Verifies required local tooling and environment variables before `npm run dev`.
set -euo pipefail

echo "Checking Node.js..."
node -v

echo "Checking npm..."
npm -v

if [ ! -f .env ]; then
  echo "⚠️  .env not found — copy .env.example to .env first: cp .env.example .env"
  exit 1
fi

echo "Checking Docker..."
docker --version || { echo "⚠️  Docker is required for Postgres/Redis in local dev"; exit 1; }

echo "✅ Environment looks good."
