import json, os

def load_data(caminho):
    if not os.path.exists(caminho):
        os.makedirs(os.path.dirname(caminho), exist_ok=True)
        return []
    with open(caminho, 'r', encoding='utf-8') as file:
        return (json.load(file))
    
def save_data(data, caminho):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)