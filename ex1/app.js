const express = require('express');
const app = express();
const mongoose = require('mongoose');
const setupSwagger = require('./swagger');

const jogoRouter = require('./routes/jogoRouter');
const autorRouter = require('./routes/autorRouter');
const categoriaRouter = require('./routes/categoriaRouter');

// Middleware
app.use(express.json());

// MongoDB connection
const nomeBD = "jogostabuleiro";
const mongoHost = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/${nomeBD}`;
mongoose.connect(mongoHost)
    .then(() => console.log(`MongoDB: liguei-me à base de dados ${nomeBD}.`))
    .catch(err => console.error('Erro:', err));

// Registar modelos
require('./models/Jogo');
require('./models/Autor');
require('./models/Categoria');

// Swagger
setupSwagger(app);

// Routes
app.use('/jogos', jogoRouter);
app.use('/autores', autorRouter);
app.use('/categorias', categoriaRouter);

// Health check
app.get('/', (req, res) => {
    res.json({ data: new Date().toISOString(), status: 'API de dados a correr...' });
});

const PORT = process.env.PORT || 17000;

// Start server
app.listen(PORT, () => {
    console.log(`Servidor ligado na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});
