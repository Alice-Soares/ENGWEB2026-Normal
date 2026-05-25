# ENGWEB2026 - Exame de Época Normal

Repositório contendo a resolução de dois exercícios práticos de Engenharia Web: desenvolvimento de uma API de dados sobre jogos de tabuleiro (Exercício 1) e implementação de uma aplicação de gestão de listas de leitura através de engenharia reversa (Exercício 2).

---

## Estrutura do Repositório

```
ENGWEB2026-Normal/
├── README.md                    # Este ficheiro
├── enunciado.md                 # Enunciado da prova
├── engweb2026_normal.pdf        # Especificações em PDF
├── ex1/                         # Exercício 1: API Jogos de Tabuleiro
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── Dockerfile.mongo
│   ├── app.js
│   ├── package.json
│   ├── README.md
│   ├── queries.txt
│   ├── dataset_jogos_tratado.json
│   ├── dataset_autores_tratado.json
│   ├── dataset_categorias_tratado.json
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── mongo-init/
└── ex2/                         # Exercício 2: Lista de Leituras
    ├── docker-compose.yml
    ├── Dockerfile
    ├── Dockerfile.mongo
    ├── Dockerfile.nginx
    ├── app.js
    ├── package.json
    ├── README.md
    ├── dataset_livros.json
    ├── nginx/
    ├── public/
    ├── controllers/
    ├── models/
    ├── routes/
    └── mongo-init/
```

---

## Exercício 1: API de Dados - Jogos de Tabuleiro

### 1. Persistência de Dados

A persistência de dados para o Exercício 1 é realizada através de:

**MongoDB em Docker:** Base de dados NoSQL executada num container Docker isolado

**Estrutura da Base de Dados:**
- **Database:** `jogostabuleiro`
- **Collections:**
  - `jogos` - Contém todos os 27 jogos de tabuleiro com campos: name, year, category, minPlayers, maxPlayers, playingTimeMinutes, descriptionEN, autores[], editoras[], mecanicas[], premios[]
  - `autores` - 27 autores únicos (um por jogo)
  - `categorias` - 3 categorias (Family, Strategy, War)

**Dataset Inicial:**
O dataset original foi processado e dividido em 3 ficheiros JSON:
- `dataset_jogos_tratado.json` - 27 jogos
- `dataset_autores_tratado.json` - 27 autores (um por jogo, extraídos da coleção autores de cada jogo)
- `dataset_categorias_tratado.json` - 3 categorias

Os dados são automaticamente importados para MongoDB durante a inicialização do container através do script `mongo-init/import.sh`.

### 2. Setup de Base de Dados

O setup é completamente automatizado através do Docker:

```bash
cd ex1
docker-compose up --build
```

Este comando:
1. Constrói a imagem Node.js com a API Express
2. Constrói a imagem MongoDB com os dados pré-carregados
3. Inicia ambos os containers numa rede privada Docker
4. Importa automaticamente os 3 ficheiros JSON nas coleções respetivas

**Portas:**
- API: `17000` (exposta ao exterior)
- MongoDB: `27017` (apenas interna, não exposta)

### 3. Queries MongoDB

As seguintes queries responderam aos requisitos especificados no enunciado:

**Q1: Quantos jogos estão registados?**
```javascript
db.jogos.countDocuments()
```

**Q2: Quantos jogos pertencem à categoria "Family"?**
```javascript
db.jogos.countDocuments({ category: "Family" })
```

**Q3: Lista de autores (alfabeticamente, sem repetições)?**
```javascript
db.autores.find({}, { name: 1 }).sort({ name: 1 })
```

**Q4: Distribuição de jogos por ano de lançamento?**
```javascript
db.jogos.aggregate([
  { $group: { _id: "$year", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

**Q5: Distribuição de jogos por editora?**
```javascript
db.jogos.aggregate([
  { $unwind: "$editoras" },
  { $group: { _id: "$editoras.name", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

Estas queries estão documentadas em `ex1/queries.txt`.

### 4. Endpoints da API

A API responde em `http://localhost:17000` com os seguintes endpoints:

- **GET /jogos** - Lista todos os 27 jogos com campos: _id, name, year, category, minPlayers
- **GET /jogos/:id** - Retorna toda a informação de um jogo específico
- **GET /jogos?editora=EEEE** - Lista jogos de uma editora específica com campos: _id, name, year
- **GET /autores** - Lista alfabética de autores com jogos que criaram
- **GET /categorias** - Lista alfabética de categorias com jogos em cada uma
- **POST /jogos** - Cria um novo jogo
- **PUT /jogos/:id** - Atualiza um jogo existente
- **DELETE /jogos/:id** - Remove um jogo
- **GET /api-docs** - Interface Swagger interativa

### 5. Como Executar Exercício 1

```bash
# Navegar para a pasta
cd ex1

# Construir e iniciar
docker-compose up --build

# A API fica disponível em http://localhost:17000
# Swagger disponível em http://localhost:17000/api-docs

# Para parar
docker-compose down

# Para parar e limpar dados
docker-compose down -v
```

**Testar endpoints:**
```bash
# Listar todos os jogos
curl http://localhost:17000/jogos | jq

# Listar autores
curl http://localhost:17000/autores | jq

# Listar categorias
curl http://localhost:17000/categorias | jq

# Pesquisar por editora
curl http://localhost:17000/jogos?editora=KOSMOS | jq
```

---

## Exercício 2: Engenharia Reversa - A Minha Lista de Leituras

### 1. Persistência de Dados

A persistência de dados para o Exercício 2 é realizada através de:

**MongoDB em Docker:** Base de dados NoSQL executada num container Docker isolado (não exposto ao exterior)

**Estrutura da Base de Dados:**
- **Database:** `leituras`
- **Collection:** `livros`

**Modelo de Dados (Livro):**
```javascript
{
  _id: ObjectId,
  titulo: String,          // Obrigatório
  autor: String,           // Obrigatório
  paginas: Number,
  genero: String,
  lido: Boolean            // Padrão: false
}
```

**Dataset Inicial:**
O ficheiro `dataset_livros.json` contém 9 livros exemplificativos que são automaticamente importados para MongoDB durante a inicialização.

### 2. Setup de Base de Dados

O setup é completamente automatizado através do Docker:

```bash
cd ex2
docker-compose up --build
```

Este comando:
1. Constrói a imagem Node.js com a API Express
2. Constrói a imagem MongoDB com dados pré-carregados
3. Constrói a imagem Nginx para servir a interface web estática
4. Inicia todos os 3 containers numa rede privada Docker
5. Importa automaticamente o dataset na coleção livros

**Portas:**
- API: `19020` (exposta ao exterior)
- Nginx (Frontend): `19021` (exposta ao exterior)
- MongoDB: `27017` (apenas interna, não exposta)

### 3. Endpoints da API

A API responde em `http://localhost:19020/api/livros` com os seguintes endpoints:

- **GET /api/livros** - Lista todos os livros
- **GET /api/livros?search=X** - Pesquisa livros por título, autor ou género (case-insensitive)
- **POST /api/livros** - Cria um novo livro com campos: titulo, autor, paginas, genero
- **PUT /api/livros/:id** - Atualiza o estado lido (boolean) de um livro
- **DELETE /api/livros/:id** - Remove um livro

### 4. Interface Web

A interface Vue.js está disponível em `http://localhost:19021` e oferece:

- Listagem de todos os livros em cards responsivos
- Pesquisa em tempo real por título, autor ou género
- Formulário para adicionar novos livros
- Checkbox para marcar livros como lidos/por ler
- Botão para eliminar livros com confirmação
- Design responsivo (funciona em desktop e mobile)
- Dark mode com gradiente púrpura

### 5. Como Executar Exercício 2

```bash
# Navegar para a pasta
cd ex2

# Construir e iniciar
docker-compose up --build

# A interface fica disponível em http://localhost:19021
# A API fica disponível em http://localhost:19020/api/livros

# Para parar
docker-compose down

# Para parar e limpar dados
docker-compose down -v
```

**Testar endpoints:**
```bash
# Listar todos os livros
curl http://localhost:19020/api/livros | jq

# Pesquisar por autor Machado
curl http://localhost:19020/api/livros?search=Machado | jq

# Adicionar novo livro
curl -X POST http://localhost:19020/api/livros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "O Alienista",
    "autor": "Machado de Assis",
    "paginas": 120,
    "genero": "Conto"
  }'

# Marcar livro como lido
curl -X PUT http://localhost:19020/api/livros/ID_DO_LIVRO \
  -H "Content-Type: application/json" \
  -d '{"lido": true}'

# Eliminar livro
curl -X DELETE http://localhost:19020/api/livros/ID_DO_LIVRO
```

---

## Instruções Gerais de Execução

### Pré-requisitos

```bash
# Docker deve estar instalado
docker --version

# Docker Compose deve estar disponível
docker-compose --version
```

### Executar Ambos os Exercícios

```bash
# Exercício 1
cd ex1
docker-compose up --build

# Em outro terminal, Exercício 2
cd ex2
docker-compose up --build
```

Depois de alguns segundos, os serviços estarão disponíveis:

| Exercício | Serviço | URL | Porta |
|-----------|---------|-----|-------|
| Ex1 | API Jogos | http://localhost:17000 | 17000 |
| Ex1 | Swagger | http://localhost:17000/api-docs | 17000 |
| Ex2 | Frontend | http://localhost:19021 | 19021 |
| Ex2 | API Livros | http://localhost:19020/api/livros | 19020 |

### Verificar Status dos Containers

```bash
# Para Ex1
docker ps | grep ex1

# Para Ex2
docker ps | grep ex2

# Ver logs de um serviço
docker logs nome_do_container -f
```

### Parar os Serviços

```bash
# Dentro da pasta ex1 ou ex2
docker-compose down

# Para remover também os volumes de dados
docker-compose down -v
```

---

## Stack Tecnológico

### Exercício 1

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| Runtime | Node.js | 18 (LTS) |
| Framework | Express.js | ^4.18.2 |
| Base de Dados | MongoDB | latest |
| ODM | Mongoose | ^7.0.0 |
| Documentação | Swagger/OpenAPI | - |
| Orquestração | Docker Compose | 3.8+ |

### Exercício 2

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| Runtime | Node.js | 18 (LTS) |
| Framework | Express.js | ^4.18.2 |
| Base de Dados | MongoDB | latest |
| ODM | Mongoose | ^7.0.0 |
| CORS | cors | ^2.8.5 |
| Frontend | Vue.js | 3.3.4 (CDN) |
| HTTP Client | Axios | latest (CDN) |
| Web Server | Nginx | latest |
| Orquestração | Docker Compose | 3.8+ |

---

## Persistência e Recuperação de Dados

### Exercício 1

Os dados são importados automaticamente em cada inicialização através do script `mongo-init/import.sh`:

1. Três ficheiros JSON são copiados para `/docker-entrypoint-initdb.d/`
2. MongoDB executa automaticamente os scripts nesta pasta
3. Os dados são importados nas coleções `jogos`, `autores` e `categorias`

Para limpar e recarregar:
```bash
docker-compose down -v
docker-compose up --build
```

### Exercício 2

Os dados são importados automaticamente em cada inicialização através do script `mongo-init/import.sh`:

1. O ficheiro `dataset_livros.json` é copiado para `/docker-entrypoint-initdb.d/`
2. MongoDB executa o script de importação
3. Os dados são importados na coleção `livros`

Para limpar e recarregar:
```bash
docker-compose down -v
docker-compose up --build
```

---

## Segurança

### MongoDB Não Exposto

Ambos os exercícios seguem a melhor prática de **não expor MongoDB para o exterior**:

- MongoDB está configurado apenas para aceitar conexões da rede interna Docker
- A porta 27017 não é publicada em nenhum dockerfile
- Apenas a API pode comunicar com MongoDB através da rede `docker bridge`

### CORS (Exercício 2)

A API está configurada com CORS habilitado para permitir requisições da interface web:

```javascript
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Troubleshooting

### Erro: "Porta já em uso"

Se a porta 17000, 19020 ou 19021 já estiver em uso:

```bash
# Verificar qual processo está usando a porta
lsof -i :17000
lsof -i :19020
lsof -i :19021

# Parar todos os containers Docker
docker stop $(docker ps -q)
```

### Erro: "MongoDB connection refused"

Aguardar alguns segundos após iniciar o docker-compose, pois MongoDB demora a iniciar:

```bash
# Ver logs do MongoDB
docker logs mongodb_jogostabuleiro -f
docker logs mongodb_leituras -f
```

### Erro: "Cannot GET /api-docs" (Ex1)

Verificar se a porta está correta (17000) e se o container está a correr:

```bash
docker ps | grep ex1
curl http://localhost:17000/
```

### Dados não aparecem na interface (Ex2)

Verificar se CORS está ativado e se a API está a responder:

```bash
# Testar CORS
curl -i http://localhost:19020/api/livros

# Ver logs da API
docker logs api_leituras -f
```

---

## Documentação Adicional

Para documentação específica de cada exercício, consultar:
- `ex1/README.md` - Detalhes do Exercício 1
- `ex2/README.md` - Detalhes do Exercício 2

---

## Requisitos Cumpridos

### Exercício 1

- Análise e processamento do dataset
- Importação em MongoDB com 3 coleções (jogos, autores, categorias)
- 5 queries MongoDB documentadas
- 8 endpoints da API (GET, POST, PUT, DELETE)
- Interface Swagger funcional
- Dockerização completa com docker-compose

### Exercício 2

- Modelo Mongoose derivado da interface Vue.js
- Dataset com 9 livros exemplificativos
- 4 endpoints da API totalmente funcionais
- Interface Vue.js completa em CORS habilitado
- Dockerfile para API, MongoDB e Nginx
- Docker-compose com 3 serviços orquestrados
- MongoDB não exposto ao exterior
- Nginx servindo ficheiro index.html estático

---

## Autor

A106804 - Alice Isabel Faria Soares 

Desenvolvido para a UC de Engenharia Web - 3º ano LEI
Data: 25 de Maio de 2026