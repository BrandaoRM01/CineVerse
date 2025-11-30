from pathlib import Path
import os
from sib_api_v3_sdk import Configuration

class Config:
    SECRET_KEY = 'sua_chave_secreta_aqui'
    DEBUG = True

    BASE_DIR = Path(__file__).resolve().parent.parent

    DATA_USERS = os.path.join(BASE_DIR, 'model', 'data', 'usuarios.json')
    DATA_FILMES = os.path.join(BASE_DIR, 'model', 'data', 'filmes.json')

    UPLOAD_IMAGEM = os.path.join(BASE_DIR, 'static', 'uploads', 'image')
    UPLOAD_POSTER = os.path.join(BASE_DIR, 'static', 'uploads', 'poster')

    TIPOS_IMAGEM = {'png', 'jpg', 'jpeg', 'webp'}

    TMDB_API_KEY = 'sua_chave_api_tmdb_aqui'
    BREVO_API_KEY = 'sua_chave_api_brevo_aqui'

    USERNAME_ADMIN = 'seu_username_admin_aqui'
    EMAIL_ADMIN = 'seu_email_admin_aqui'
    SENHA_ADMIN = 'sua_senha_admin_aqui'

brevo_config = Configuration()
brevo_config.api_key['api-key'] = Config.BREVO_API_KEY