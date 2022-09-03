FROM php:7.4-cli

WORKDIR /var/www/html

RUN apt-get update && \
	apt-get install	libzip-dev -y && \
	docker-php-ext-install zip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
	php composer-setup.php && \
	php -r "unlink('composer-setup.php');"

RUN php composer.phar create-project --prefer-dist laravel/laravel laravel

ENTRYPOINT ["php", "laravel/artisan", "serve"]

# É necessário para poder acessar o servidor do laravel a partir do host
# Por padrão o laravel usa o 127.0.0.1, mas não é possível acessar o container do host com esse ip
CMD ["--host=0.0.0.0"]

# BUILD: docker build -t md91/laravel-fullcycle -f Dockerfile.laravel .
# RUN docker run -dit -p 8000:8000 --name laravel md91/laravel-fullcycle:latest