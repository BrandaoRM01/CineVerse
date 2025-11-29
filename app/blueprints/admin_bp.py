from app.controller.admin_controller import AdminController
from app.controller.filmes_controller import FilmesController
from app.utils.login_utils import verificar_logado
from app.utils.admin_utils import verificar_admin
from app.utils.data_utils import load_data
from app.config.config import Config
from flask import Blueprint, jsonify, request, redirect, url_for, session

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/admin')
admin_controller = AdminController()
filmes_controller = FilmesController()

@admin_bp.route('/listar_usuarios', methods=['GET'])
def listar_usuarios():
    usuarios= admin_controller.obter_usuarios()
    return jsonify(usuarios), 200

@admin_bp.route('/alterar_permissao/<usuario_id>', methods=['GET', 'POST'])
def alterar_permissao(usuario_id):
    if request.method == 'GET':
        return redirect(url_for('main_bp.index'))

    tornar_admin = False
    if 'admin' in request.form:
        if request.form['admin'].lower() == 'true':
            tornar_admin = True

    mensagem, status = admin_controller.alterar_permissao_admin(usuario_id, tornar_admin)
    return jsonify(mensagem), status

@admin_bp.route('/adicionar', methods=['POST', 'GET'])
def adicionar():
    if not verificar_logado():
        return redirect(url_for('main_bp.login'))
    
    if verificar_logado() and not verificar_admin():
        return redirect(url_for('main_bp.index'))
    
    if request.method == 'GET':
        return redirect(url_for('main_bp.adicionar_filme'))

    if request.method == 'POST':
        titulo = request.form.get('titulo')
        filme = filmes_controller.pegar_filme(titulo)

        if not filme:
            return jsonify({'erro': 'Filme não encontrado.'}), 400
        
        mensagem, status = filmes_controller.cadastrar_filme(filme)
        return jsonify(mensagem),status
    
@admin_bp.route('/editar/<int:tmdb_id>', methods=['GET', 'POST'])
def editar(tmdb_id):
    if not verificar_logado():
        return redirect(url_for('main_bp.login'))
    
    if verificar_logado() and not verificar_admin():
        return redirect(url_for('main_bp.index'))

    if request.method == 'GET':
        filme = filmes_controller.buscar_filme_por_id(tmdb_id)
        if not filme:
            return redirect(url_for('main_bp.adicionar_filme'))
        return jsonify(filme), 200

    if request.method == 'POST':
        dados_atualizados = request.form.to_dict()

        poster = request.files.get('poster')

        mensagem, status = filmes_controller.editar_filme(
            tmdb_id,
            dados_atualizados,
            poster   
        )
        return jsonify(mensagem), status

@admin_bp.route('/deletar/<int:tmdb_id>', methods=['GET', 'POST'])
def deletar(tmdb_id):
    if not verificar_logado():
        return redirect(url_for('main_bp.login'))
    
    if verificar_logado() and not verificar_admin():
        return redirect(url_for('main_bp.index'))
    
    if request.method == 'GET':
        return redirect(url_for('main_bp.index'))

    mensagem, status = filmes_controller.deletar_filme(tmdb_id)

    usuario_logado = session.get('user_logado')

    if usuario_logado:
        usuarios = load_data(Config.DATA_USERS)
        usuario_atualizado = next(
            (u for u in usuarios if u['id'] == usuario_logado['id']),
            None
        )

        if usuario_atualizado:
            session['user_logado'] = usuario_atualizado

    return jsonify(mensagem), status