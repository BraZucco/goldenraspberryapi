
# Movie Producers API

API que retorna os produtores que demoraram mais tempo e os que demoraram menos tempo para ser bicampeão do *Golden Raspberry Awards*

## Tecnologias Utilizadas

- **Docker**
- **Node.js**
- **Express**
- **SQLite**
- **CSV Parser**
- **Nodemon**
- **Jest**

## Funcionalidades

- **Cadastrar filmes e produtores**: A partir de um arquivo CSV, a API popula uma base de dados com filmes, estúdios e seus respectivos produtores assim que a aplicação é iniciada.
- **Consultar produtores que ganharam mais de um ano**: Endpoint que retorna todos os produtores que tiveram, pelo menos, duas vitórias
- **Consultar todos os produtores**: Endpoint que retorna todos os produtores ordenados pelo nome.
- **Consultar intervalos entre vitórias**: Endpoint que retorna o intervalo entre vitórias de produtores que ganharam mais de uma vez.

## Estrutura do Projeto

A estrutura do projeto é organizada da seguinte forma:

```
/app
  /src
    /config
      - database.js
    /routes
      - producers.js
    - server.js
    - data
      - movielist.csv
    - tests
      - api.test.js
    - Dockerfile
  - .gitignore
  - docker-compose.yml
  - README.md
```

### 1. **Configuração do Banco de Dados** (`app/src/config/database.js`)

Este arquivo contém a lógica de inicialização do banco de dados SQLite e a importação dos dados a partir do arquivo CSV. Os dados dos filmes e produtores são inseridos na base de dados.

### 2. **Rotas** (`app/src/routes/producers.js`)

Aqui estão as rotas que expõem a API. Elas permitem que você consulte informações sobre os produtores, como os que têm múltiplas vitórias e os intervalos entre vitórias.

### 3. **Servidor** (`app/src/server.js`)

Este arquivo contém a lógica para inicializar o servidor Express e configurar as rotas.

### 4. **Testes de Integração** (`app/tests/api.test.js`)

Utilizando Jest e Supertest, este arquivo garante que os endpoints da API funcionem corretamente, simulando requisições HTTP e verificando as respostas.

## Instruções de Instalação

### Pré-requisitos

- **Docker**: Certifique-se de ter o Docker e docker-compose instalado em seu sistema. Você pode verificar isso com os comandos:

  ```bash
  docker -v
  docker compose
  ```

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/movie-producers-api.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd movie-producers-api
   ```

3. Inicie o container:

    Na raiz do projeto execute os comandos:
    ```
    docker compose build
    docker compose up -d
    ```
   

4. Certifique-se de que o arquivo `app/src/data/movielist.csv` está presente na pasta do projeto ou modifique o caminho do arquivo CSV na inicialização do banco de dados para um arquivo válido.

    O servidor estará rodando em http://localhost:32300.

## Testes

Conecte no container para executar os comandos

```bash
docker exec -it goldenraspberryapi-app-1 sh
```
*Confirmar se o name do container é goldenraspberryapi-app-1, caso não seja, alterar*

```bash
npm test
```

Ou com **yarn**:

```bash
yarn test
```

Os testes serão executados utilizando o Jest.
