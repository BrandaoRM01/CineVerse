from flask import Blueprint, request, jsonify, redirect, url_for, session
from app.controller.auth_controller import AuthController

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')
controller = AuthController()

@auth_bp.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'GET':
        return redirect(url_for('main_bp.cadastro'))

    username = request.form.get('username')
    email = request.form.get('email')
    senha = request.form.get('senha')
    confirmar_senha = request.form.get('confirmar_senha')
    imagem = request.files.get('imagem')

    mensagem, status = controller.cadastrar_usuario(
        username=username,
        email=email,
        senha=senha,
        confirmar_senha=confirmar_senha,
        imagem=imagem
    )

    return jsonify(mensagem), status

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return redirect(url_for('main_bp.login'))

    email = request.form.get('email')
    senha = request.form.get('senha')

    usuario, status = controller.login_usuario(email=email, senha=senha)

    if status == 200:
        session['user_logado'] = {
            'id': usuario['id'],
            'username': usuario['username'],
            'email': usuario['email'],
            'imagem_url': usuario['imagem_url'],
            'admin': usuario['admin'],
            'principal': usuario['principal'],
            'favoritos': usuario['favoritos'],
            'assistidos': usuario['assistidos'],
            'assistir_mais_tarde': usuario['assistir_mais_tarde']
        }
        session['admin'] = usuario['admin']
        return jsonify({'successo': True, 'usuario': usuario}), 200

    return jsonify({'successo': False, 'erro': 'Email ou senha incorretos'}), 400

@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    if request.method == 'GET':
        return redirect(url_for('main_bp.index'))
    
    session.pop('user_logado', None)
    session.pop('admin', None)
    return jsonify({'successo': True}), 200

@auth_bp.route('/recuperar_senha', methods=['GET', 'POST'])
def recuperar_senha():
    if request.method == 'GET':
        return redirect(url_for('main_bp.recuperar_senha'))

    email = request.form.get('email')
    mensagem, status = controller.recuperar_senha(email)
    return jsonify(mensagem), status

@auth_bp.route('/redefinir_senha', methods=['GET', 'POST'])
def redefinir_senha():
    if request.method == 'GET':
        return redirect(url_for('main_bp.index'))

    token = request.form.get('token')
    senha = request.form.get('senha')
    confirmar = request.form.get('confirmar_senha')

    mensagem, status = controller.redefinir_senha(
        token=token,
        nova_senha=senha,
        confirmar_senha=confirmar
    )

    return jsonify(mensagem), status