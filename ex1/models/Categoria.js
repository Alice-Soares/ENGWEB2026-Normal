var mongoose = require('mongoose');

// Coleção de Categorias
var categoriaSchema = new mongoose.Schema({
  _id: String,
  categoria: String,
  jogos: [{
    id: String,
    nome: String
  }]
});

categoriaSchema.index({ categoria: 1 });

const Categoria = mongoose.model('Categoria', categoriaSchema, 'categorias');

module.exports = Categoria;
