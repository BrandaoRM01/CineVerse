from flask import Blueprint, render_template, jsonify, session, url_for, redirect
from app.utils.login_utils import verificar_logado
from app.utils.admin_utils import verificar_admin

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/')
def index():
    return render_template('/filmes/index.html')

@main_bp.route('/filmes')
def filmes():
    return render_template('/filmes/filmes.html')

@main_bp.route('/meus_filmes')
def meus_filmes():
    if not verificar_logado():
        return redirect(url_for('main_bp.login'))
    return render_template('/user/meus_filmes.html')

@main_bp.route('/painel_admin')
def painel_admin():
    if not verificar_logado() or not verificar_admin():
        return redirect(url_for('main_bp.index'))
    return render_template('/admin/painel_admin.html')

@main_bp.route('/login')
def login():
    if verificar_logado():
        return redirect(url_for('main_bp.index'))
    return render_template('/auth/login.html')

@main_bp.route('/cadastro')
def cadastro():
    if verificar_logado():
        return redirect(url_for('main_bp.index'))
    return render_template('/auth/cadastro.html')

@main_bp.route('/recuperar_senha')
def recuperar_senha():
    if verificar_logado():
        return redirect(url_for('main_bp.index'))
    return render_template('/auth/recuperar_senha.html')

@main_bp.route('/adicionar_filme')
def adicionar_filme():
    if not verificar_logado() or not verificar_admin():
        return redirect(url_for('main_bp.index'))
    return render_template('/admin/adicionar_filme.html')

@main_bp.route('/editar_filme/<int:tmdb_id>')
def editar_filme(tmdb_id):
    if not verificar_logado() or not verificar_admin():
        return redirect(url_for('main_bp.index'))
    return render_template('/admin/editar_filme.html')

@main_bp.route('/detalhes_filme/<int:tmdb_id>')
def detalhes_filme(tmdb_id):
    return render_template('/filmes/detalhes_filme.html')

@main_bp.route('/gerenciar_usuarios')
def gerenciar_usuarios():
    if not verificar_logado() or not verificar_admin():
        return redirect(url_for('main_bp.index'))
    return render_template('/admin/gerenciar_usuarios.html')

@main_bp.route('/redefinir_senha')
def redefinir_senha():
    if verificar_logado():
        return redirect(url_for('main_bp.index'))
    return render_template('/auth/redefinir_senha.html')

@main_bp.route('/editar_perfil')
def editar_perfil():
    if not verificar_logado():
        return redirect(url_for('main_bp.login'))
    return render_template('/user/editar_perfil.html')