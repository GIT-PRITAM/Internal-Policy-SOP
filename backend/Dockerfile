# FROM php:8.3-cli-alpine

# # Install system dependencies and required PHP extensions for Laravel + PostgreSQL
# RUN apk add --no-cache \
#     bash \
#     curl \
#     git \
#     unzip \
#     libzip-dev \
#     oniguruma-dev \
#     postgresql-dev \
#   && docker-php-ext-configure zip \
#   && docker-php-ext-install zip pdo_pgsql bcmath \
#   && rm -rf /var/cache/apk/*

# # Install Composer
# COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# WORKDIR /var/www/html

# # Copy the application source before installing dependencies, so Composer scripts can access artisan
# COPY . .
# RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
# RUN chmod +x /usr/local/bin/docker-entrypoint

# # Ensure Laravel storage and cache directories are writable by PHP-FPM
# RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
#   && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# EXPOSE 8080

# CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}

FROM php:8.3-cli-alpine

RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    libzip-dev \
    oniguruma-dev \
    postgresql-dev \
  && docker-php-ext-configure zip \
  && docker-php-ext-install zip pdo_pgsql bcmath \
  && rm -rf /var/cache/apk/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}