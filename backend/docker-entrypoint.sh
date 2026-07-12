#!/bin/sh
set -eu

attempt=0
until php artisan migrate --force --no-interaction; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    echo "Database migrations did not complete after ${attempt} attempts." >&2
    exit 1
  fi

  echo "Database is not ready; retrying migrations..." >&2
  sleep 2
done

exec php-fpm
