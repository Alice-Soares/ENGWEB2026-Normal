const Jogo = require('../models/Jogo');
const Autor = require('../models/Autor');
const Categoria = require('../models/Categoria');

const jogoController = {

    // GET /jogos - Listar todos os jogos (campos: id, name, year, category, minPlayers)
    getAllJogos: async (req, res) => {
        try {
            const query = {};
            
            // Filtro por editora (GET /jogos?editora=EEEE)
            if (req.query.editora) {
                query['editoras.name'] = req.query.editora;
            }
            
            const jogos = await Jogo.find(query);
            
            // Se tem filtro de editora, retorna id, name, year
            if (req.query.editora) {
                const resultado = jogos.map(j => ({
                    _id: j._id,
                    name: j.name,
                    year: j.year
                }));
                return res.status(200).json(resultado);
            }
            
            // Caso geral: retorna id, name, year, category, minPlayers
            const resultado = jogos.map(j => ({
                _id: j._id,
                name: j.name,
                year: j.year,
                category: j.category,
                minPlayers: j.minPlayers
            }));
            res.status(200).json(resultado);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /jogos/:id - Obter jogo por ID com todos os campos
    getJogoById: async (req, res) => {
        try {
            const jogo = await Jogo.findById(req.params.id);
            if (!jogo) {
                return res.status(404).json({ message: 'Jogo não encontrado' });
            }
            res.status(200).json(jogo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /autores - Lista de autores ordenada alfabeticamente (query simples)
    getAutores: async (req, res) => {
        try {
            const autores = await Autor.find({}).sort({ name: 1 });
            res.status(200).json(autores);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /categorias - Lista de categorias ordenada alfabeticamente (query simples)
    getCategorias: async (req, res) => {
        try {
            const categorias = await Categoria.find({}).sort({ categoria: 1 });
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // POST /jogos - Criar novo jogo
    createJogo: async (req, res) => {
        try {
            // Converter "id" para "_id" se vem no request
            if (req.body.id && !req.body._id) {
                req.body._id = req.body.id;
                delete req.body.id;
            }
            
            const newJogo = new Jogo(req.body);
            await newJogo.save();
            res.status(201).json(newJogo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // PUT /jogos/:id - Atualizar jogo por ID
    updateJogo: async (req, res) => {
        try {
            const jogo = await Jogo.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!jogo) {
                return res.status(404).json({ message: 'Jogo não encontrado' });
            }
            res.status(200).json(jogo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // DELETE /jogos/:id - Eliminar jogo por ID
    deleteJogo: async (req, res) => {
        try {
            const deletedJogo = await Jogo.findByIdAndDelete(req.params.id);
            if (!deletedJogo) {
                return res.status(404).json({ message: 'Jogo não encontrado' });
            }
            res.status(200).json({ message: 'Jogo eliminado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = jogoController;
