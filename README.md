# Cheatsheet
# Cheatsheet comandos

**bind mount:**

Copiar arquivos do host para dentro do container

**Exemplo:**

docker run nginx -v /usr/github/fullcycle/docker/html:/usr/share/nginx/html

---

**docker ps -flags**

Exibe os containers que estão rodando

**Flags:**

- -a → Exibe todos os containers, ativos e inativos
- -q → Lista somente os ids

---

**docker run -flags <nome imagem>:<versao> <comando a rodar no container>**

Irá criar um container com a imagem escolhida para rodar

**Flags:**

- -i → Modo interativo, irá deixar o stdin aberto
- -t → tty, permitir digitar algo no terminal
- -p → qual a porta irá utilizar na máquina que roda os containers, exemplo: 8080:80 → <porta do host>:<porta do container>
- -d → detached, desacopla o terminal do processo do container
- `--mount type=bind,source=<local_path>,target=<container_path>` → cria um volume copiando arquivos do host para o container
    
    **Dica:** source=”$(pwd)”/ para pegar o diretório atual
    
- `--rm` → cria o container e remove ele quando o processo encerrar
- `--name` → seta o nome do container

**Exemplos:**

- docker run -it ubuntu bash

---

**docker start/stop <nome container>**

Iniciar/para um container criado anteriormente

---

**docker rm -flags <nome|id container>**

Remover um container criado anteriormente

**Flags:**

- -f → força a remoção

**Removendo vários containers de uma vez**

```docker
docker rm $(docker ps -a -q) -f
```

---

**docker exec -flags <nome|id container> <comando>**

Executa um comando no container

**Flags:**

- -i → Modo interativo, irá deixar o stdin aberto
- -t → tty, permitir digitar algo no terminal

**Exemplo:**

docker exec -it nginx bash

---

**docker rmi <nome da imagem>**

Remove uma imagem baixada

# Criando uma aplicação com Docker

1. Criar a pasta no host onde estará o código fonte, nesse exemplo será `./node`
2. Criar o container fazendo o bind da pasta com uma pasta do container:
    
    ```docker
    docker run -dit -p 3000:3000 --name node -v $(pwd)/node:/usr/src/app node:15
    ```
    
3. Rodar o container:
    
    ```docker
    docker exec -it node bash
    ```
    
4. Criar arquivo de teste em `node/index.js`
    
    ```jsx
    const express = require("express");
    const server = express();
    
    server.use(express.json());

    server.get("/", (req, res) => {
    	return res.send({
    		message: "Hello World 2"
    	})
    })
    
    server.listen(3000, () => {
    	console.log("Server is running on port 3000");
    })
    ```
    
5. Rodar o node no container
    
    ```jsx
    node index.js
    ```
    
6. Acessar no browser o server em `http://localhost:3000`

# Docker compose

Serve para subir vários containers em um arquivo de config apenas

**Up:** sobe os containers do arquivo docker-compose.yaml

```docker
docker-compose up -d
# -d -> detached
# --build -> rebuilda as imagens dos containers
```

**Down:** derruba os containers que estão rodando

```docker
docker-compose down
```

# Imagens

**Criando uma imagem através de uma Dockerfile**

```docker
# imagem base
FROM nginx:latest

# diretorio que irá se posicionar
WORKDIR /app

# comandos que irá rodar ao criar a imagem
RUN apt-get update && \
	  apt-get install nano -y

# copia a pasta html do host para a pasta nginx do container
COPY html/ /usr/share/nginx
```

Rodar o comando: 

```docker
docker build -t md91/nginx-com-nano:latest .
```

**Publicando imagem no docker hub**

```docker
docker login
docker push <user>/<imagem>:<versao>
```

**Removendo todas imagens**

```docker
docker image prune -a
```

**Criando imagens mais leves**

Usar multistage build e usar a imagem ‘scratch’ para criar o container 

```docker
# Imagem base da linguagem go
FROM golang:1.19-alpine as build-step

# Seta o diretório base da aplicação
WORKDIR /go/src/app

# Copia o arquivo para o WORKDIR
COPY src/main.go .

# Roda o build da aplicação
RUN go build /go/src/app/main.go

# Minimal image do docker
# Utilizada para criar a imagem com o mínimo de recursos
# Aqui é o que faz a imagem ser mais leve
FROM scratch

# Copia o arquivo do step anterior para a pasta 
COPY --from=build-step /go/src/app /go/src/app

# Roda o arquivo buildado
CMD ["/go/src/app/main"]

# Comando para criar container:
# docker run --rm -it --name golang md91/golang-fullcycle
## --rm: Cria e remove o container
## -it: Cria em modo interativo, irá exibir o output do container ao encerrar a execução
## --name: Nome do container
## md91/golang-fullcycle: Nome da imagem utilizada
```

# Networks

### Bridge

É a rede criada por default caso nenhum outro tipo seja informado ao criar o container

### Host

Mescla a rede do docker com a rede do host. A porta do container fica acessível diretamente do host sem precisar fazer o mapping de portas

### Overlay

Não é tão comum, usado para conseguir comunicar entre containers que estão em redes diferentes, o Docker Swarm utiliza isso

**Criando uma network**

```docker
# Irá criar no modo bridge
docker network create minharede
```

**Criando um container em uma network específica**

```docker
# Irá criar um container com a imagem 'bash' na network 'minharede'
docker run -dit --name ubuntu1 --network minharede bash

# Ao conectar um container em uma rede criada, a resolução de nomes será feita, ou seja, se criar outro container na mesma rede, ele poderá fazer um ping 'ubuntu1'
```

**Conectando um container em uma rede**

```docker
docker network connect minharede ubuntu3
```

**Inspecionando a network**

```docker
docker network inspect minharede
[
    {
        "Name": "minharede",
        "Id": "ece31d0100886e0b4d2ec8acd7a8b5eff65e50918cf4c3a9297d67390ae92754",
        "Created": "2022-09-02T01:52:19.528459631Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",
                    "Gateway": "172.18.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "0b4e09ba1859a01b6da4056efb2d102719075ebebe1388312686b8426f92ebc0": {
                "Name": "ubuntu3",
                "EndpointID": "3e402e5a37ab193c02fcaec5034dac30c1654c063043b5c4534c4420a0ef706f",
                "MacAddress": "02:42:ac:12:00:04",
                "IPv4Address": "172.18.0.4/16",
                "IPv6Address": ""
            },
            "4ed899767000b8737fd4a6d855d0f3a72bef6b256696925bd6a115fdd176d043": {
                "Name": "ubuntu1",
                "EndpointID": "be941d4374f720adc1839d3340ecdae524cb39f47dab13594e67cdb19491ae1d",
                "MacAddress": "02:42:ac:12:00:03",
                "IPv4Address": "172.18.0.3/16",
                "IPv6Address": ""
            },
            "86e8d5e9675047be90d272640508b5e719057b143c65fc3d7dfdec74d0b53589": {
                "Name": "ubuntu2",
                "EndpointID": "d2fdee0f3b2d42540e28e883f25144ba8a661ce534d7b8ea12aa23663682864c",
                "MacAddress": "02:42:ac:12:00:02",
                "IPv4Address": "172.18.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

**Acessando o host a partir do container**

- PHP server rodado no host (WSL2): `php -S 0.0.0.0:8000`
- Criar container para testar: `docker run -it --rm --name ubuntu ubuntu bash`
- `apt-get update && apt-get install curl`
- Rodar curl para http://host.docker.internal:8000, deve retornar uma resposta. Essa url é uma url especial do docker para acessar o host a partir do container

# Volumes

Ao criar outro container com o mesmo volume, o novo container irá receber a versão atual do volume

**Criando um volume:**

```json
docker volume create <nome_volume>
```

**Inspecionando um volume:**

```json
docker volume inspect <nome_volume>
```

```json
[
    {
        "CreatedAt": "2022-08-31T00:19:43Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/meuvolume/_data", // local que está armazeado
        "Name": "meuvolume",
        "Options": {},
        "Scope": "local"
    }
]
```

**Criando um container com um volume**

```json
docker run --name nginx -d --mount type=volume,source=meuvolume,target=/app nginx
```

**Removendo todos volumes**

```json
docker volume prune
```
