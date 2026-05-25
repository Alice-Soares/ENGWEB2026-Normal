const Livro = require('../models/Livro');

const livroController = {

    // GET /api/livros - Listar todos os livros (com busca opcional)
    getAllLivros: async (req, res) => {
        try {
            const query = {};
            
            // Filtro de busca por texto
            if (req.query.search) {
                query.$or = [
                    { titulo: { $regex: req.query.search, $options: 'i' } },
                    { autor: { $regex: req.query.search, $options: 'i' } },
                    { genero: { $regex: req.query.search, $options: 'i' } }
                ];
            }
            
            const livros = await Livro.find(query);
            res.status(200).json(livros);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // POST /api/livros - Criar novo livro
    createLivro: async (req, res) => {
        try {
            const newLivro = new Livro(req.body);
            await newLivro.save();
            res.status(201).json(newLivro);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // PUT /api/livros/:id - Atualizar estado de leitura do livro
    updateLivro: async (req, res) => {
        try {
            const livro = await Livro.findByIdAndUpdate(
                req.params.id,
                { lido: req.body.lido },
                { new: true }
            );
            if (!livro) {
                return res.status(404).json({ message: 'Livro não encontrado' });
            }
            res.status(200).json(livro);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // DELETE /api/livros/:id - Eliminar livro por ID
    deleteLivro: async (req, res) => {
        try {
            const deletedLivro = await Livro.findByIdAndDelete(req.params.id);
            if (!deletedLivro) {
                return res.status(404).json({ message: 'Livro não encontrado' });
            }
            res.status(200).json({ message: 'Livro eliminado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = livroController;
