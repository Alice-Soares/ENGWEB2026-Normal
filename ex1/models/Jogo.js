var mongoose = require('mongoose');

var jogoSchema = new mongoose.Schema({
  _id: String,  // Usar o id do dataset como _id
  name: String,
  year: Number,
  category: String,
  minPlayers: Number,
  maxPlayers: Number,
  playingTimeMinutes: Number,
  descriptionEN: String,
  autores: [{
    id: String,
    name: String
  }],
  editoras: [{
    id: String,
    name: String,
    country: String
  }],
  mecanicas: [{
    id: String,
    name: String
  }],
  premios: [{
    id: String,
    name: String,
    year: Number
  }]
});

// Índices para facilitar queries comuns
jogoSchema.index({ category: 1 });
jogoSchema.index({ year: 1 });
jogoSchema.index({ 'autores.name': 1 });
jogoSchema.index({ 'editoras.name': 1 });

const Jogo = mongoose.model('Jogo', jogoSchema, 'jogos');

module.exports = Jogo;
