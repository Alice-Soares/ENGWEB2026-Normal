# Exercício 2: A Minha Lista de Leituras

## Descrição

Aplicação web completa para gerir uma lista de livros a ler com arquitetura de microserviços em Docker. Combina uma API Express.js com base de dados MongoDB, frontend Vue.js 3, e servidor de ficheiros estáticos Nginx.

---

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

---

## Modelo de Dados

### Esquema Livro

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

**Índices para otimização:**
- `titulo` - para pesquisa por nome
- `autor` - para filtrar por autor
- `genero` - para categorização

---

## Endpoints da API

**Base URL:** `http://localhost:19020/api/livros`

### GET /api/livros
Retorna lista de todos os livros.

**Query Parameters (opcional):**
- `search=X` - Pesquisa em titulo, autor e género (case-insensitive regex)

**Exemplo:**
```bash
# Listar todos (9 livros)
curl http://localhost:19020/api/livros

# Pesquisar por autor Saramago
curl http://localhost:19020/api/livros?search=Saramago

# Pesquisar por género
curl http://localhost:19020/api/livros?search=Ficção
```

**Resposta:**
```json
[
  {
    "_id": "6a141f11a4414da504955ba2",
    "titulo": "O Grande Gatsby",
    "autor": "F. Scott Fitzgerald",
    "paginas": 180,
    "genero": "Romance Clássico",
    "lido": false
  }
]
```

---

### POST /api/livros
Adiciona novo livro.

**Body obrigatório:**
```json
{
  "titulo": "Nome do Livro",
  "autor": "Nome do Autor",
  "paginas": 300,
  "genero": "Género do Livro"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:19020/api/livros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "O Alienista",
    "autor": "Machado de Assis",
    "paginas": 120,
    "genero": "Conto"
  }'
```

**Resposta de sucesso (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "titulo": "O Alienista",
  "autor": "Machado de Assis",
  "paginas": 120,
  "genero": "Conto",
  "lido": false
}
```

---

### PUT /api/livros/:id
Atualiza estado de leitura de um livro.

**Body obrigatório:**
```json
{
  "lido": true
}
```

**Exemplo:**
```bash
curl -X PUT http://localhost:19020/api/livros/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"lido": true}'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Livro atualizado"
}
```

---

### DELETE /api/livros/:id
Remove um livro.

**Exemplo:**
```bash
curl -X DELETE http://localhost:19020/api/livros/507f1f77bcf86cd799439011
```

**Resposta:**
```json
{
  "success": true,
  "message": "Livro removido"
}
```

---

## Dataset Inicial

9 livros de exemplo pré-carregados:

| Título | Autor | Páginas | Género | Lido |
|--------|-------|---------|--------|------|
| Dom Casmurro | Machado de Assis | 256 | Romance | Sim |
| O Cortiço | Aluísio Azevedo | 300 | Romance Naturalista | Não |
| Memórias Póstumas de Brás Cubas | Machado de Assis | 368 | Romance | Sim |
| O Homem Duplicado | José Saramago | 352 | Romance Contemporâneo | Não |
| Capitães da Areia | Jorge Amado | 344 | Romance | Sim |
| O Grande Gatsby | F. Scott Fitzgerald | 180 | Romance Clássico | Sim |
| 1984 | George Orwell | 328 | Ficção Científica | Sim |
| O Silmarillion | J.R.R. Tolkien | 365 | Fantasia | Não |
| Ensaio sobre a Cegueira | José Saramago | 310 | Romance Contemporâneo | Não |

---

## Interface Web

**URL:** `http://localhost:19021`

### Funcionalidades:

- **Listar livros** - Exibe todos os 9 livros em cards responsivos
- **Pesquisa em tempo real** - Filtra por título, autor ou género
- **Adicionar livros** - Formulário com validação
- **Marcar como lido** - Toggle checkbox para estado de leitura
- **Eliminar livros** - Com confirmação
- **Responsive Design** - Funciona em desktop e mobile
- **Dark Mode** - Gradiente púrpura sofisticado

---

## Como Executar

### Pré-requisitos

```bash
# Verificar Docker instalado
docker --version

# Verificar Docker Compose
docker-compose --version
```

### Instalação e Execução

```bash
# 1. Navegar para a pasta
cd ex2

# 2. Construir e iniciar os serviços
docker-compose up --build

# 3. Aguardar inicialização (~7s total)
# MongoDB com 9 livros será carregado
```

### Serviços Disponíveis

| Serviço | Porta | URL | Status |
|---------|-------|-----|--------|
| Interface Web | 19021 | http://localhost:19021 | Público |
| API REST | 19020 | http://localhost:19020 | Público |
| MongoDB | 27017 | Interno | Privado |

### Parar Serviços

```bash
docker-compose down

# Com remoção de volumes (limpa dados)
docker-compose down -v
```

---

## Verificação de Saúde

### Verificar Status dos Containers

```bash
docker ps | grep -E "nginx_leituras|api_leituras|mongodb_leituras"
```

### Testar API

```bash
# Health check
curl http://localhost:19020

# Obter todos os livros
curl http://localhost:19020/api/livros | jq

# Pesquisar
curl http://localhost:19020/api/livros?search=Machado | jq

# Ver logs da API
docker logs api_leituras -f

# Ver logs do MongoDB
docker logs mongodb_leituras -f
```

---

## Configuração de Segurança

### CORS (Cross-Origin Resource Sharing)

A API está configurada com CORS para aceitar requisições:

```javascript
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### MongoDB

- Não exposto para o exterior
- Acessível apenas através da API (por rede interna)
- Dados persistentes no container

### Nginx

- Serve ficheiros estáticos com cache adequado
- Fallback para `index.html` (SPA routing)
- Try_files para Vue.js routing funcionar corretamente

---


## Estrutura Docker

### Dockerfile (API)
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 19020
CMD ["npm", "start"]
```

### Dockerfile.mongo (MongoDB)
```dockerfile
FROM mongo:latest
COPY dataset_livros.json /docker-entrypoint-initdb.d/
COPY mongo-init/import.sh /docker-entrypoint-initdb.d/
EXPOSE 27017
```

### Dockerfile.nginx (Web Server)
```dockerfile
FROM nginx:latest
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY public/index.html /usr/share/nginx/html/
EXPOSE 19021
CMD ["nginx", "-g", "daemon off;"]
```

---

## Troubleshooting

### Problema: "Erro ao adicionar livro"

**Solução:** Verificar se CORS está ativado
```bash
curl -i http://localhost:19020/api/livros
# Procurar por headers: Access-Control-Allow-*
```

### Problema: Containers não iniciam

```bash
# Ver logs detalhados
docker-compose logs

# Verificar se portas estão livres
lsof -i :19020
lsof -i :19021
lsof -i :27017
```

### Problema: Dados não aparecem

```bash
# Verificar MongoDB
docker exec mongodb_leituras mongosh leituras --eval "db.livros.find()"

# Reconstruir e limpar
docker-compose down -v
docker-compose up --build
```

---

