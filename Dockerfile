# imagem base
FROM nginx:latest

# diretorio que irá se posicionar
WORKDIR /app

# comandos que irá rodar ao criar a imagem
RUN apt-get update && \
	  apt-get install nano -y

# copia a pasta html do host para a pasta nginx do container
COPY html/ /usr/share/nginx