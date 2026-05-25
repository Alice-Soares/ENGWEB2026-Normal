var mongoose = require('mongoose');

var livroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  paginas: Number,
  genero: String,
  lido: {
    type: Boolean,
    default: false
  }
});

// Índices para melhorar performance nas buscas
livroSchema.index({ titulo: 1 });
livroSchema.index({ autor: 1 });
livroSchema.index({ genero: 1 });

const Livro = mongoose.model('Livro', livroSchema, 'livros');

module.exports = Livro;
