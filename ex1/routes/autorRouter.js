const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

// GET /autores - Lista de autores
router.get('/', jogoController.getAutores);

module.exports = router;
