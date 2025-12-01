#!/bin/bash
# Applies SQL migrations and seed data when the PostgreSQL volume is first created.

set -euo pipefail

ASSETS_DIR="/docker-entrypoint-initdb.d/assets"
MIGRATIONS_DIR="${ASSETS_DIR}/migrations"
SEED_FILE="${ASSETS_DIR}/seed.sql"

echo "📦 Applying LexiFlow migrations and seed data..."

if [ -d "$MIGRATIONS_DIR" ]; then
  shopt -s nullglob
  for migration in "$MIGRATIONS_DIR"/*.sql; do
    echo "➡️  Running migration: $(basename "$migration")"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$migration"
  done
fi

if [ -f "$SEED_FILE" ]; then
  echo "🌱 Loading seed data from $(basename "$SEED_FILE")"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$SEED_FILE"
fi

echo "✅ Database migrations and seed data applied successfully."
