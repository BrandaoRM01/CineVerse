from flask import session
from app.config.config import Config
from app.utils.data_utils import load_data, save_data
import hashlib, uuid

def verificar_admin():
    if not session.get('admin'):
        return False
    return True

def criar_admin():
    usuarios = load_data(Config.DATA_USERS)

    for usuario in usuarios:
        if usuario['admin'] == True:
            return
    else:
        senha = 'sua_senha_admin_aqui'
        senha_hash = hashlib.sha256(senha.encode()).hexdigest()

        admin_usuario = {
            'id': str(uuid.uuid4()),
            'username': 'seu_username_admin_aqui',
            'email': 'seu_email_admin_aqui',
            'senha': senha_hash,
            'senhas': [],
            'imagem_url': '/static/img/default_user.jpg',
            'admin': True,
            'principal': True,
            'favoritos': [],
            'assistidos': [],
            'assistir_mais_tarde': [],
            'token_recuperacao': None,
            'token_expira': None
        }
        
        admin_usuario['senhas'].append(senha_hash)

        usuarios.append(admin_usuario)
        save_data(usuarios, Config.DATA_USERS)