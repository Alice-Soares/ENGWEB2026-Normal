var mongoose = require('mongoose');

// Coleção de Autores
var autorSchema = new mongoose.Schema({
  _id: String,
  name: String,
  jogos: [{
    id: String,
    nome: String
  }]
});

autorSchema.index({ name: 1 });

const Autor = mongoose.model('Autor', autorSchema, 'autores');

module.exports = Autor;
