# ENGWEB2026 - Exame de Época Normal

O repositório contém a resolução de dois exercícios práticos de Engenharia Web: desenvolvimento de uma API de dados sobre jogos de tabuleiro (Exercício 1) e implementação de uma aplicação de gestão de listas de leitura através de engenharia reversa (Exercício 2).

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
## Documentação Adicional

Para documentação específica de cada exercício, consultar:
- [ex1/README.md](ex1/README.md) - Detalhes do Exercício 1
- [ex2/README.md](ex2/README.md) - Detalhes do Exercício 2

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

1. Três ficheiros JSON são copiados para `/docker-entrypoint-initdb.d/`
2. MongoDB executa automaticamente os scripts nesta pasta
3. Os dados são importados nas coleções `jogos`, `autores` e `categorias`

Para limpar e recarregar:
```bash
docker-compose down -v
docker-compose up --build
```

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

Ver instruções completas em [ex1/README.md](ex1/README.md#como-executar) que incluem:
- Como construir e iniciar com Docker
- Como testar os endpoints através do **Swagger em `http://localhost:17000/api-docs`**
- Como parar os serviços


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
O ficheiro `dataset_livros.json` contém 9 livros exemplificativos. 

Os dados são importados automaticamente para MongoDB durante a inicialização através do script `mongo-init/import.sh`:

1. O ficheiro `dataset_livros.json` é copiado para `/docker-entrypoint-initdb.d/`
2. MongoDB executa o script de importação
3. Os dados são importados na coleção `livros`

Para limpar e recarregar:
```bash
docker-compose down -v
docker-compose up --build
```
**MongoDB Não Exposto:**
- MongoDB está configurado apenas para aceitar conexões da rede interna Docker
- A porta 27017 não é publicada
- Apenas a API pode comunicar com MongoDB através da rede `docker bridge`

### 3. Endpoints da API

A API responde em `http://localhost:19020/api/livros` com os seguintes endpoints:

- **GET /api/livros** - Lista todos os livros
- **GET /api/livros?search=X** - Pesquisa livros por título, autor ou género (case-insensitive)
- **POST /api/livros** - Cria um novo livro com campos: titulo, autor, paginas, genero
- **PUT /api/livros/:id** - Atualiza o estado lido (boolean) de um livro
- **DELETE /api/livros/:id** - Remove um livro

### 4. Servidor Web - Nginx

O Nginx funciona como servidor web estático para servir a interface Vue.js em `http://localhost:19021`.


**CORS Habilitado:**
A API está configurada com CORS habilitado para permitir requisições da interface web:

```javascript
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 5. Como Executar Exercício 2

Ver instruções completas em [ex2/README.md](ex2/README.md#como-executar) que incluem:
- Como construir e iniciar com Docker
- Como testar os endpoints
- Como parar os serviços


---

## Como Executar os Exercícios

Pré-requisitos: Docker e Docker Compose instalados

### Exercício 1

```bash
cd ex1
docker-compose up --build
```

Serviços disponíveis:
- **API Jogos:** http://localhost:17000
- **Swagger (Teste de Endpoints):** http://localhost:17000/api-docs

Para parar:
```bash
docker-compose down
```

Para limpar dados:
```bash
docker-compose down -v
```

### Exercício 2

```bash
cd ex2
docker-compose up --build
```

Serviços disponíveis:
- **Interface Web:** http://localhost:19021
- **API Livros:** http://localhost:19020/api/livros

Para parar:
```bash
docker-compose down
```

Para limpar dados:
```bash
docker-compose down -v
```

---

## Autor

A106804 - Alice Isabel Faria Soares 

Desenvolvido para a UC de Engenharia Web - 3º ano LEI
Data: 25 de Maio de 2026