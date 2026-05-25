const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const livroRouter = require('./routes/livroRouter');

// Middleware
app.use(express.json());

// CORS
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB connection
const nomeBD = "leituras";
const mongoHost = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/${nomeBD}`;
mongoose.connect(mongoHost)
    .then(() => console.log(`MongoDB: liguei-me à base de dados ${nomeBD}.`))
    .catch(err => console.error('Erro:', err));

// Registar modelo
require('./models/Livro');

// Routes
app.use('/api/livros', livroRouter);

// Health check
app.get('/', (req, res) => {
    res.json({ data: new Date().toISOString(), status: 'API de leituras a correr...' });
});

const PORT = process.env.PORT || 19020;

// Start server
app.listen(PORT, () => {
    console.log(`Servidor ligado na porta ${PORT}`);
});
