# Exercício 1 - API de Dados (Jogos de Tabuleiro)

## Descrição
API REST para consultar informações sobre jogos de tabuleiro. Implementa endpoints para listar, consultar, criar e eliminar jogos, bem como listar autores e categorias.

## Setup da Base de Dados

### 1. Tratar o Dataset
O dataset original está em `../jogos.json`. Para gerar os datasets tratados para MongoDB:

```bash
python3 tratar_dataset.py
```

Isto irá gerar 3 ficheiros JSON:
- `dataset_jogos_tratado.json` - Coleção de jogos
- `dataset_autores_tratado.json` - Coleção de autores (pré-agregada e ordenada)
- `dataset_categorias_tratado.json` - Coleção de categorias (pré-agregada e ordenada)

### 2. Base de Dados
- **Nome da BD:** `jogostabuleiro`
- **Collections:** 
  - `jogos` - Informação completa dos jogos
  - `autores` - Lista de autores com seus jogos (pré-processado)
  - `categorias` - Lista de categorias com seus jogos (pré-processado)

### 3. Confirmação sobre _id
No MongoDB, `_id` é a chave primária obrigatória. O script converte o campo `id` do dataset original para `_id`, mantendo a mesma informação.

## Como Executar

### Com Docker (Recomendado)
Na pasta ex1:

```bash
docker-compose up --build
```

Isto irá:
- Criar a imagem MongoDB e importar automaticamente os 3 datasets
- Criar a imagem da API
- Iniciar ambos os serviços

A API estará disponível em `http://localhost:17000`
Swagger UI disponível em `http://localhost:17000/api-docs`

### Local (sem Docker)
1. Certificar que MongoDB está a correr em `localhost:27017`
2. Instalar dependências:
   ```bash
   npm install
   ```
3. Iniciar a API:
   ```bash
   npm start
   ```

## Endpoints da API

### GET /jogos
Lista todos os jogos com campos: _id, name, year, category, minPlayers

**Exemplo:**
```bash
curl http://localhost:17000/jogos
```

**Resposta:**
```json
[
  {
    "_id": "catan",
    "name": "Catan",
    "year": 1995,
    "category": "Family",
    "minPlayers": 3
  },
  ...
]
```

### GET /jogos?editora=EEEE
Lista jogos de uma editora específica (campos: _id, name, year)

**Exemplo:**
```bash
curl http://localhost:17000/jogos?editora=KOSMOS
```

**Resposta:**
```json
[
  {
    "_id": "catan",
    "name": "Catan",
    "year": 1995
  }
]
```

### GET /jogos/:id
Retorna toda a informação do jogo com o ID especificado

**Exemplo:**
```bash
curl http://localhost:17000/jogos/catan
```

**Resposta:** Jogo completo com todos os campos

### PUT /jogos/:id
Atualiza o jogo com o ID especificado

**Exemplo:**
```bash
curl -X PUT http://localhost:17000/jogos/catan \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Catan - Nova Edição",
    "year": 2024
  }'
```

**Resposta:** Jogo atualizado com os novos dados

### POST /jogos
Cria um novo jogo

**Exemplo:**
```bash
curl -X POST http://localhost:17000/jogos \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "novo-jogo",
    "name": "Novo Jogo",
    "year": 2024,
    "category": "Family",
    "minPlayers": 2,
    "maxPlayers": 4,
    "playingTimeMinutes": 60,
    "descriptionEN": "Um novo jogo de tabuleiro",
    "autores": [],
    "editoras": [],
    "mecanicas": [],
    "premios": []
  }'
```

### DELETE /jogos/:id
Elimina um jogo da base de dados

**Exemplo:**
```bash
curl -X DELETE http://localhost:17000/jogos/novo-jogo
```

### GET /autores
Lista de autores ordenada alfabeticamente com seus jogos

**Formato da Resposta:**
```json
[
  {
    "_id": "Alan R. Moon",
    "name": "Alan R. Moon",
    "jogos": [
      { "id": "ticket-to-ride", "nome": "Ticket to Ride" }
    ]
  },
  ...
]
```

**Exemplo:**
```bash
curl http://localhost:17000/autores
```

### GET /categorias
Lista de categorias ordenada alfabeticamente com seus jogos

**Formato da Resposta:**
```json
[
  {
    "_id": "Family",
    "categoria": "Family",
    "jogos": [
      { "id": "catan", "nome": "Catan" },
      { "id": "ticket-to-ride", "nome": "Ticket to Ride" },
      ...
    ]
  },
  ...
]
```

**Exemplo:**
```bash
curl http://localhost:17000/categorias
```

## Estrutura de Ficheiros

```
ex1/
├── app.js                              # Aplicação principal Express
├── package.json                        # Dependências Node.js
├── docker-compose.yml                  # Composição de serviços
├── Dockerfile                          # Dockerfile para a API
├── Dockerfile.mongo                    # Dockerfile para MongoDB
├── swagger.js                          # Configuração Swagger/OpenAPI
├── tratar_dataset.py                   # Script para processar dataset
├── dataset_jogos_tratado.json          # Dataset de jogos (gerado)
├── dataset_autores_tratado.json        # Dataset de autores (gerado)
├── dataset_categorias_tratado.json     # Dataset de categorias (gerado)
├── models/
│   ├── Jogo.js                         # Schema Mongoose para jogos
│   ├── Autor.js                        # Schema Mongoose para autores
│   └── Categoria.js                    # Schema Mongoose para categorias
├── controllers/
│   └── jogoController.js               # Controladores dos endpoints
├── routes/
│   ├── jogoRouter.js                   # Rotas para /jogos
│   ├── autorRouter.js                  # Rotas para /autores
│   └── categoriaRouter.js              # Rotas para /categorias
└── mongo-init/
    └── import.sh                       # Script de importação de dados MongoDB
```

## Detalhes Técnicos

- **Base de Dados:** MongoDB (jogostabuleiro) com 3 collections
- **Linguagem:** Node.js com Express
- **ORM:** Mongoose
- **Documentação API:** Swagger/OpenAPI

## Índices Criados

As collections possuem índices nos seguintes campos para otimizar as queries:
- `jogos`: category, year, autores.name, editoras.name
- `autores`: name
- `categorias`: categoria

## Vantagens da Arquitetura com 3 Collections

1. **Controllers simplificados:** Autores e categorias são queries diretas sem agregações
2. **Melhor performance:** Dados já pré-processados e armazenados nas collections
3. **Código limpo:** Lógica de negócio mais direta e fácil de manter
4. **Escalabilidade:** Separação de dados por domínio de negócio
5. **Flexibilidade:** Fácil adicionar novos campos em cada collection sem afetar outras
