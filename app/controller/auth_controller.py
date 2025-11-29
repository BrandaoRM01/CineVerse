from app.utils.data_utils import load_data, save_data
from app.utils.enviar_email_utils import enviar_email
from app.utils.imagens_utils import upload_imagem
from app.config.config import Config
from datetime import datetime, timedelta
from email_validator import validate_email, EmailNotValidError
from flask import render_template
import uuid, hashlib

class AuthController:

    def __init__(self):
        self.caminho_usuarios = Config.DATA_USERS

    def cadastrar_usuario(self, username, email, senha, confirmar_senha, imagem):
        usuarios = load_data(self.caminho_usuarios)

        try:
            email = validate_email(email, check_deliverability=True).email
        except EmailNotValidError as e:
            return {'erro': f'Email inválido: {str(e)}'}, 400

        if senha != confirmar_senha:
            return {'erro': 'As senhas não coincidem.'}, 400

        for usuario in usuarios:
            if usuario['username'] == username:
                return {'erro': 'Nome de usuário já existe.'}, 400
            if usuario['email'] == email:
                return {'erro': 'Email já cadastrado.'}, 400

        imagem_url = upload_imagem(imagem, Config.UPLOAD_IMAGEM)

        if not imagem_url:
            imagem_url = '/static/img/default_user.jpg'

        senha_hash = hashlib.sha256(senha.encode()).hexdigest()

        novo_usuario = {
            'id': str(uuid.uuid4()),
            'username': username,
            'email': email,
            'senha': senha_hash,
            'senhas': [],
            'imagem_url': imagem_url,
            'admin': False,
            'principal': False,
            'favoritos': [],
            'assistidos': [],
            'assistir_mais_tarde': [],
            'token_recuperacao': None,
            'token_expira': None
        }

        novo_usuario['senhas'].append(senha_hash)

        usuarios.append(novo_usuario)
        save_data(usuarios, self.caminho_usuarios)

        return {'sucesso': 'Usuário cadastrado com sucesso!'}, 200

    def login_usuario(self, email, senha):
        usuarios = load_data(self.caminho_usuarios)

        try:
            email = validate_email(email, check_deliverability=True).email
        except EmailNotValidError:
            return {'erro': 'Email inválido.'}, 400

        senha_hash = hashlib.sha256(senha.encode()).hexdigest()

        for usuario in usuarios:
            if usuario['email'] == email and usuario['senha'] == senha_hash:
                return usuario, 200

        return {'erro': 'Email ou senha incorretos.'}, 400
    
    def recuperar_senha(self, email):
        usuarios = load_data(self.caminho_usuarios)

        try:
            email = validate_email(email, check_deliverability=True).email
        except EmailNotValidError:
            return {'erro': 'Email inválido.'}, 400

        usuario = next((u for u in usuarios if u['email'] == email), None)
        if not usuario:
            return {'erro': 'Email não encontrado.'}, 400

        token = uuid.uuid4().hex
        expira = (datetime.utcnow() + timedelta(minutes=15)).isoformat()

        usuario['token_recuperacao'] = token
        usuario['token_expira'] = expira
        save_data(usuarios, self.caminho_usuarios)

        link = f'http://localhost:5000/redefinir_senha?token={token}'

        html_email = render_template(
            'email/email_redefinir_senha.html',
            link=link
        )

        enviar_email(
            destinatario=email,
            assunto='CineVerse - Recuperação de Senha',
            html=html_email
        )

        return {'sucesso': 'Email enviado! Verifique sua caixa de entrada.'}, 200
    
    def redefinir_senha(self, token, nova_senha, confirmar_senha):
        usuarios = load_data(self.caminho_usuarios)

        token = token.strip() 

        usuario = next(
            (u for u in usuarios if u.get('token_recuperacao', '') == token),
            None
        )
        if not usuario:
            return {'erro': 'Token inválido.'}, 400

        token_expira = usuario.get('token_expira')
        if not token_expira:
            return {'erro': 'Token expirado.'}, 400

        try:
            expira = datetime.fromisoformat(token_expira)
        except ValueError:
            return {'erro': 'Token inválido.'}, 400

        if expira < datetime.utcnow():
            return {'erro': 'Token expirado.'}, 400

        if nova_senha != confirmar_senha:
            return {'erro': 'As senhas não coincidem.'}, 400
        
        senha_hash = hashlib.sha256(nova_senha.encode()).hexdigest()

        if len(usuario['senhas']) >= 5:
            usuario['senhas'].pop(0)
            if senha_hash in usuario['senhas']:
                return {'erro': 'Você não pode reutilizar suas últimas 5 senhas.'}, 400
            else:
                usuario['senhas'].append(senha_hash)
        else:
            if senha_hash in usuario['senhas']:
                return {'erro': 'Você não pode reutilizar suas últimas 5 senhas.'}, 400
            else:
                usuario['senhas'].append(senha_hash)

        usuario['senha'] = senha_hash
                
        usuario['token_recuperacao'] = None
        usuario['token_expira'] = None

        save_data(usuarios, self.caminho_usuarios)

        return {'sucesso': 'Senha redefinida com sucesso!'}, 200