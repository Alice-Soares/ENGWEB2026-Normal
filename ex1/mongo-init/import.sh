#!/bin/bash
# Importa os datasets para a base de dados jogostabuleiro

# Coleção jogos
mongoimport --host localhost --db jogostabuleiro --collection jogos --file /docker-entrypoint-initdb.d/dataset_jogos_tratado.json --jsonArray

# Coleção autores
mongoimport --host localhost --db jogostabuleiro --collection autores --file /docker-entrypoint-initdb.d/dataset_autores_tratado.json --jsonArray

# Coleção categorias
mongoimport --host localhost --db jogostabuleiro --collection categorias --file /docker-entrypoint-initdb.d/dataset_categorias_tratado.json --jsonArray
