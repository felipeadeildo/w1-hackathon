#!/bin/sh
set -e

echo "Waiting for database to be ready..."

# Install PostgreSQL client for health check
apk add --no-cache postgresql-client

# Properly check PostgreSQL availability
until pg_isready -h db -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Running database migrations"
alembic upgrade head

echo "Starting application"
exec "$@"