from flask import Blueprint, request, jsonify, redirect, url_for, session
from app.controller.user_controller import UserController
from app.utils.login_utils import verificar_logado

user_bp = Blueprint('user_bp', __name__, url_prefix='/user')
controller = UserController()

@user_bp.route('/filme/<filme_id>/<tipo>', methods=['GET', 'POST'])
def adicionar_filme_user(filme_id, tipo):
    if request.method == 'GET':
        return redirect(url_for('main_bp.index'))

    if not verificar_logado():
        return redirect(url_for('main_bp.login'))

    usuario_logado = session.get('user_logado')
    if not usuario_logado:
        return jsonify({'erro': 'Usuário não logado.'}), 400

    usuario_id = usuario_logado['id']

    resposta, status = controller.adicionar_filme_user(
        usuario_id=usuario_id,
        filme_id=filme_id,
        tipo=tipo
    )

    if status == 200:
        usuarios_atualizados = controller.carregar_todos()
        usuario_atualizado = next((u for u in usuarios_atualizados if u['id'] == usuario_id), None)
        if usuario_atualizado:
            session['user_logado'] = usuario_atualizado

    return jsonify(resposta), status

@user_bp.route('/remover_filme/<tipo>/<filme_id>', methods=['GET', 'POST'])
def remover_filme(tipo, filme_id):
    if request.method == 'GET':
        return redirect(url_for('main_bp.index'))

    if not verificar_logado():
        return redirect(url_for('main_bp.login'))

    usuario_logado = session.get('user_logado')
    if not usuario_logado:
        return jsonify({'erro': 'Usuário não logado.'}), 400

    usuario_id = usuario_logado['id']

    resposta, status = controller.remover_filme_user(
        usuario_id=usuario_id,
        filme_id=filme_id,
        tipo=tipo
    )

    if status == 200:
        usuarios_atualizados = controller.carregar_todos()
        usuario_atualizado = next((u for u in usuarios_atualizados if u['id'] == usuario_id), None)
        if usuario_atualizado:
            session['user_logado'] = usuario_atualizado

    return jsonify(resposta), status

@user_bp.route('/editar_perfil', methods=['GET', 'POST'])
def editar_perfil():
    if request.method == 'GET':
        return redirect(url_for('main_bp.editar_perfil'))

    if not verificar_logado():
        return redirect(url_for('main_bp.login'))

    usuario_logado = session.get('user_logado')
    if not usuario_logado:
        return jsonify({'erro': 'Usuário não logado.'}), 400

    novo_username = request.form.get('username')
    nova_imagem = request.files.get('imagem')

    resposta, status = controller.editar_perfil(
        usuario_id=usuario_logado['id'],
        novo_username=novo_username,
        nova_imagem=nova_imagem
    )

    if status == 200:
        usuarios_atualizados = controller.carregar_todos()
        usuario_atualizado = next((u for u in usuarios_atualizados if u['id'] == usuario_logado['id']), None)
        if usuario_atualizado:
            session['user_logado'] = usuario_atualizado

    return jsonify(resposta), status

@user_bp.route('/api/usuario', methods=['GET'])
def usuario():
    if not verificar_logado():
        return jsonify(None)

    user = session.get('user_logado')
    return jsonify({
        'usuario': user,
        'admin': session.get('admin', False)
    })