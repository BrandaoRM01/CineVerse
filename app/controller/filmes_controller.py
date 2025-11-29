from app.utils.data_utils import load_data, save_data
from app.utils.requisicao_utils import fazer_requisicao
from app.utils.imagens_utils import upload_imagem
from app.config.config import Config
from concurrent.futures import ThreadPoolExecutor
from flask import session
import requests
import os

class FilmesController:

    def __init__(self):
        self.api_key = Config.TMDB_API_KEY
        self.caminho_filmes = Config.DATA_FILMES
        self.caminho_usuarios = Config.DATA_USERS

    def pegar_filme(self, titulo):
        base_url = 'https://api.themoviedb.org/3'

        url_busca = f'{base_url}/search/movie?api_key={self.api_key}&language=pt-BR&query={titulo}'
        resposta = requests.get(url_busca)

        if resposta.status_code != 200:
            return []

        dados = resposta.json()
        if not dados.get('results'):
            return []

        filme_base = dados['results'][0]
        tmdb_id = filme_base['id']

        url_detalhes = f'{base_url}/movie/{tmdb_id}?api_key={self.api_key}&language=pt-BR'
        url_creditos = f'{base_url}/movie/{tmdb_id}/credits?api_key={self.api_key}&language=pt-BR'
        url_videos = f'{base_url}/movie/{tmdb_id}/videos?api_key={self.api_key}&language=pt-BR'

        with ThreadPoolExecutor() as executor:
            detalhes, creditos, videos = executor.map(fazer_requisicao, [url_detalhes, url_creditos, url_videos])

        diretor = None
        for pessoa in creditos.get('crew', []):
            if pessoa.get('job') == 'Director':
                diretor = pessoa.get('name')
                break

        atores_principais = [ator.get('name') for ator in creditos.get('cast', [])[:5]]

        trailer = None
        for video in videos.get('results', []):
            if video.get('type') == 'Trailer' and video.get('site') == 'YouTube':
                trailer = f'https://www.youtube.com/watch?v={video.get('key')}'
                break

        generos = [g.get('name') for g in detalhes.get('genres', [])]

        filme = {
            'tmdb_id': tmdb_id,
            'titulo': filme_base.get('title'),
            'descricao': filme_base.get('overview'),
            'data_lancamento': filme_base.get('release_date'),
            'avaliacao': filme_base.get('vote_average'),
            'poster_path': filme_base.get('poster_path'),
            'poster_custom': None,
            'generos': generos,
            'diretor': diretor,
            'atores_principais': atores_principais,
            'trailer_url': trailer
        }

        return filme

    def cadastrar_filme(self, filme_data):
        filmes = load_data(self.caminho_filmes)

        for filme in filmes:
            if filme['tmdb_id'] == filme_data['tmdb_id']:
                return {'erro': 'Filme já cadastrado.'}, 400

        filmes.append(filme_data)
        save_data(filmes, self.caminho_filmes)

        return {'sucesso': 'Filme cadastrado com sucesso!'}, 200

    def listar_filmes(self):
        filmes = load_data(self.caminho_filmes)
        filmes.sort(key=lambda x: (x['titulo'].lower(), x['avaliacao']))
        return filmes

    def listar_filmes_top10(self):
        filmes = load_data(self.caminho_filmes)
        filmes.sort(key=lambda x: (-float(x['avaliacao']), x['titulo'].lower()))
        return filmes[:10]

    def editar_filme(self, tmdb_id, dados_atualizados, novo_poster=None):
        filmes = load_data(self.caminho_filmes)

        for filme in filmes:
            if filme['tmdb_id'] == tmdb_id:

                if novo_poster:
                    if filme.get('poster_custom'):
                        caminho_antigo = os.path.join(Config.BASE_DIR, filme['poster_custom'].lstrip('/'))
                        if os.path.exists(caminho_antigo):
                            os.remove(caminho_antigo)

                    novo_poster_url = upload_imagem(novo_poster, Config.UPLOAD_POSTER)

                    if novo_poster_url:
                        filme['poster_custom'] = novo_poster_url
                    else:
                        filme['poster_custom'] = '/static/img/default_movie.png'

                for campo in ['generos', 'atores_principais']:
                    if campo in dados_atualizados:
                        valor = dados_atualizados[campo]
                        if isinstance(valor, str):
                            dados_atualizados[campo] = [v.strip() for v in valor.split(',') if v.strip()]

                if 'trailer_url' in dados_atualizados:
                    valor = dados_atualizados['trailer_url'].strip()
                    dados_atualizados['trailer_url'] = valor if valor else None

                filme.update(dados_atualizados)

                save_data(filmes, self.caminho_filmes)
                return {'sucesso': 'Filme atualizado com sucesso!'}, 200

        return {'erro': 'Filme não encontrado.'}, 400

    def deletar_filme(self, tmdb_id):
        filmes = load_data(self.caminho_filmes)

        for filme in filmes:
            if filme['tmdb_id'] == tmdb_id:

                if filme.get('poster_custom'):
                    caminho = os.path.join(Config.BASE_DIR, filme['poster_custom'].lstrip('/'))
                    if os.path.exists(caminho):
                        os.remove(caminho)

                filmes.remove(filme)
                save_data(filmes, self.caminho_filmes)

                usuarios = load_data(self.caminho_usuarios)
                mudou_algo = False

                for usuario in usuarios:

                    if tmdb_id in usuario.get('assistidos', []):
                        usuario['assistidos'].remove(tmdb_id)
                        mudou_algo = True

                    if tmdb_id in usuario.get('assistir_mais_tarde', []):
                        usuario['assistir_mais_tarde'].remove(tmdb_id)
                        mudou_algo = True

                    if tmdb_id in usuario.get('favoritos', []):
                        usuario['favoritos'].remove(tmdb_id)
                        mudou_algo = True

                if mudou_algo:
                    save_data(usuarios, self.caminho_usuarios)

                usuario_logado = session.get('user_logado')

                if usuario_logado:
                    usuarios_atualizados = load_data(self.caminho_usuarios)
                    usuario_atualizado = next(
                        (u for u in usuarios_atualizados if u['id'] == usuario_logado['id']),
                        None
                    )
                    if usuario_atualizado:
                        session['user_logado'] = usuario_atualizado

                return {'sucesso': 'Filme deletado com sucesso!'}, 200

        return {'erro': 'Filme não encontrado.'}, 400

    def buscar_filme_por_id(self, tmdb_id):
        filmes = load_data(self.caminho_filmes)
        return next((f for f in filmes if f['tmdb_id'] == tmdb_id), None)