FROM nginx:latest

COPY html /usr/share/nginx/html

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]

# BUILD: docker build -t md91/nginx-fullcycle -f Dockerfile.publicando.imagem .
# RUN: docker run -d -p 8080:80 md91/nginx-fullcycle:latest