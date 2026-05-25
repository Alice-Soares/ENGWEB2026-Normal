const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

// GET /categorias - Lista de categorias
router.get('/', jogoController.getCategorias);

module.exports = router;
