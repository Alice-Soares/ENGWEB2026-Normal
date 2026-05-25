import json

def open_json_file(filename):
    """Abre e lê um ficheiro JSON."""
    with open(filename, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def new_file(filename, content):
    """Cria um novo ficheiro e escreve o conteúdo nele."""
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(content, file, ensure_ascii=False, indent=2)

# Ler dataset original
input_path = "../jogos.json"

dados = open_json_file(input_path)

# 1. Processar e dividir em 3 collections
jogos_tratados = []
autores_map = {}
categorias_map = {}
editoras_map = {}

for jogo in dados:
    # Collection JOGOS
    jogo_mongodb = {
        "_id": jogo.get("id"),
        "name": jogo.get("name"),
        "year": jogo.get("year"),
        "category": jogo.get("category"),
        "minPlayers": jogo.get("minPlayers"),
        "maxPlayers": jogo.get("maxPlayers"),
        "playingTimeMinutes": jogo.get("playingTimeMinutes"),
        "descriptionEN": jogo.get("descriptionEN"),
        "autores": jogo.get("autores", []),
        "editoras": jogo.get("editoras", []),
        "mecanicas": jogo.get("mecanicas", []),
        "premios": jogo.get("premios", [])
    }
    jogos_tratados.append(jogo_mongodb)
    
    # Collection AUTORES
    for autor in jogo.get("autores", []):
        autor_name = autor.get("name")
        if autor_name not in autores_map:
            autores_map[autor_name] = {
                "_id": autor_name,
                "name": autor_name,
                "jogos": []
            }
        # Adicionar jogo se ainda não está na lista
        jogo_ref = {"id": jogo.get("id"), "nome": jogo.get("name")}
        if jogo_ref not in autores_map[autor_name]["jogos"]:
            autores_map[autor_name]["jogos"].append(jogo_ref)
    
    # Collection CATEGORIAS
    categoria = jogo.get("category")
    if categoria not in categorias_map:
        categorias_map[categoria] = {
            "_id": categoria,
            "categoria": categoria,
            "jogos": []
        }
    # Adicionar jogo se ainda não está na lista
    jogo_ref = {"id": jogo.get("id"), "nome": jogo.get("name")}
    if jogo_ref not in categorias_map[categoria]["jogos"]:
        categorias_map[categoria]["jogos"].append(jogo_ref)

# Converter maps para arrays e ordenar alfabeticamente
autores_array = sorted(list(autores_map.values()), key=lambda x: x["name"])
categorias_array = sorted(list(categorias_map.values()), key=lambda x: x["categoria"])

# Escrever ficheiros tratados
new_file("dataset_jogos_tratado.json", jogos_tratados)
new_file("dataset_autores_tratado.json", autores_array)
new_file("dataset_categorias_tratado.json", categorias_array)

print(f"Datasets tratados com sucesso!")
print(f"Total de jogos: {len(jogos_tratados)}")
print(f"Total de autores: {len(autores_array)}")
print(f"Total de categorias: {len(categorias_array)}")
