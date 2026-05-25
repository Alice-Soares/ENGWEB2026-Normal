# Exercício 2: A Minha Lista de Leituras

## Descrição

API de dados para gerir uma lista de livros a ler (Reading List), com interface Vue.js.

## Estrutura do Projeto

```
ex2/
├── models/
│   └── Livro.js              # Modelo Mongoose para Livros
├── controllers/
│   └── livroController.js    # Controlador com lógica da API
├── routes/
│   └── livroRouter.js        # Definição das rotas
├── public/
│   └── index.html            # Interface Vue.js
├── mongo-init/
│   └── import.sh             # Script de importação de dados
├── nginx/
│   └── nginx.conf            # Configuração do servidor Nginx
├── app.js                    # Aplicação Express
├── package.json              # Dependências Node.js
├── dataset_livros.json       # Dataset com 8 livros exemplificativos
├── Dockerfile                # Dockerfile para API
├── Dockerfile.mongo          # Dockerfile para MongoDB
├── Dockerfile.nginx          # Dockerfile para Nginx
└── docker-compose.yml        # Orquestração dos serviços

```

## Modelo de Dados (Livro)

```javascript
{
  _id: ObjectId,           // Gerado automaticamente pelo MongoDB
  titulo: String,          // Título do livro (obrigatório)
  autor: String,           // Nome do autor (obrigatório)
  paginas: Number,         // Número de páginas
  genero: String,          // Género do livro
  lido: Boolean            // Estado de leitura (padrão: false)
}
```

## Endpoints da API

A API está acessível em `http://localhost:19020/api/livros`

### GET /api/livros
Retorna a lista de todos os livros.

**Query string opcional:**
- `?search=X` - Filtra livros por título, autor ou género (busca case-insensitive)

**Exemplo:**
```bash
curl http://localhost:19020/api/livros
curl http://localhost:19020/api/livros?search=Machado
```

### POST /api/livros
Adiciona um novo livro à base de dados.

**Body esperado:**
```json
{
  "titulo": "O Cortiço",
  "autor": "Aluísio Azevedo",
  "paginas": 300,
  "genero": "Romance Naturalista"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:19020/api/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Saramago","autor":"Memorial de Aires","paginas":320,"genero":"Romance"}'
```

### PUT /api/livros/:id
Atualiza o estado de leitura (campo `lido`) de um livro.

**Body esperado:**
```json
{
  "lido": true
}
```

**Exemplo:**
```bash
curl -X PUT http://localhost:19020/api/livros/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"lido":true}'
```

### DELETE /api/livros/:id
Remove um livro da base de dados.

**Exemplo:**
```bash
curl -X DELETE http://localhost:19020/api/livros/507f1f77bcf86cd799439011
```

## Dataset

O arquivo `dataset_livros.json` contém 8 livros exemplificativos:

- Dom Casmurro (Machado de Assis)
- O Cortiço (Aluísio Azevedo)
- Memórias Póstumas de Brás Cubas (Machado de Assis)
- O Homem Duplicado (José Saramago)
- Capitães da Areia (Jorge Amado)
- O Grande Gatsby (F. Scott Fitzgerald)
- 1984 (George Orwell)
- O Silmarillion (J.R.R. Tolkien)

## Interface Web

A interface Vue.js está acessível em `http://localhost:19021`

Funcionalidades:
- - Listar todos os livros
- - Procurar livros por título, autor ou género
- - Adicionar novos livros
- - Marcar livros como lidos/por ler
- - Eliminar livros

## Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos

1. **Posicionar-se na pasta ex2:**
```bash
cd ex2
```

2. **Construir e iniciar os serviços:**
```bash
docker-compose up --build
```

Isto vai:
- Construir a imagem do MongoDB com o dataset pré-carregado
- Construir a imagem da API Node.js
- Construir a imagem do Nginx com a interface web
- Iniciar os três serviços conectados à rede `leitures-network`

3. **Aceder aos serviços:**
- **Interface Web:** http://localhost:19021
- **API de dados:** http://localhost:19020/api/livros

### Paragens

Para parar todos os serviços:
```bash
docker-compose down
```

## Requisitos Docker Cumpridos

- MongoDB não está exposto para o exterior (apenas acessível internamente pela API)
- API de dados exposta na porta 19020
- Interface Nginx (index.html) exposta na porta 19021
- Todos os serviços conectados à rede interna `leitures-network`
- Docker Compose com orquestração adequada

## Notas Técnicas

- **Base de Dados:** MongoDB com nome `leituras`
- **Coleção:** `livros`
- **ORM:** Mongoose para interação com MongoDB
- **Framework Web:** Express.js
- **Frontend:** Vue.js 3 com Axios para requests HTTP
- **Servidor de Ficheiros Estáticos:** Nginx

