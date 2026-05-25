const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

// GET /jogos - Listar todos os jogos (com filtro opcional por editora)
router.get('/', jogoController.getAllJogos);

// GET /jogos/:id - Obter jogo por ID
router.get('/:id', jogoController.getJogoById);

// POST /jogos - Criar novo jogo
router.post('/', jogoController.createJogo);

// PUT /jogos/:id - Atualizar jogo por ID
router.put('/:id', jogoController.updateJogo);

// DELETE /jogos/:id - Eliminar jogo por ID
router.delete('/:id', jogoController.deleteJogo);

module.exports = router;
