const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');

// GET /api/livros - Listar todos os livros (com busca opcional)
router.get('/', livroController.getAllLivros);

// POST /api/livros - Criar novo livro
router.post('/', livroController.createLivro);

// PUT /api/livros/:id - Atualizar livro por ID
router.put('/:id', livroController.updateLivro);

// DELETE /api/livros/:id - Eliminar livro por ID
router.delete('/:id', livroController.deleteLivro);

module.exports = router;
