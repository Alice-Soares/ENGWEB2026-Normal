#!/bin/bash

mongoimport \
  --db leituras \
  --collection livros \
  --file /docker-entrypoint-initdb.d/dataset_livros.json \
  --jsonArray
