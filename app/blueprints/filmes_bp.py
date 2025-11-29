from flask import Blueprint, jsonify, request, redirect, url_for
from app.controller.filmes_controller import FilmesController

filmes_bp = Blueprint('filmes_bp', __name__, url_prefix='/filmes')
controller = FilmesController()

@filmes_bp.route('/listar', methods=['GET'])
def listar():
    filme, status = controller.listar_filmes(), 200
    return jsonify(filme), status

@filmes_bp.route('/top10', methods=['GET'])
def listar_top10():    
    filme, status = controller.listar_filmes_top10(), 200
    return jsonify(filme), status

@filmes_bp.route('/detalhes/<int:tmdb_id>')
def detalhes_filme(tmdb_id):
    filme = controller.buscar_filme_por_id(tmdb_id)
    if not filme:
        return jsonify({'erro': 'Filme não encontrado.'}), 400
    return jsonify(filme), 200