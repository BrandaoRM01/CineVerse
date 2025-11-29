from pathlib import Path
import os
from sib_api_v3_sdk import Configuration

class Config:
    SECRET_KEY = 'CHAVE_DE_EXEMPLO'
    DEBUG = True

    BASE_DIR = Path(__file__).resolve().parent.parent

    DATA_USERS = os.path.join(BASE_DIR, 'model', 'data', 'usuarios.json')
    DATA_FILMES = os.path.join(BASE_DIR, 'model', 'data', 'filmes.json')

    UPLOAD_IMAGEM = os.path.join(BASE_DIR, 'static', 'uploads', 'image')
    UPLOAD_POSTER = os.path.join(BASE_DIR, 'static', 'uploads', 'poster')

    TIPOS_IMAGEM = {'png', 'jpg', 'jpeg', 'webp'}

    TMDB_API_KEY = 'TMDB_API_KEY_EXEMPLO'
    BREVO_API_KEY = 'BREVO_API_KEY_EXEMPLO'

brevo_config = Configuration()
brevo_config.api_key['api-key'] = Config.BREVO_API_KEY