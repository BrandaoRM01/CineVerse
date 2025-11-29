from flask import session
from app.utils.data_utils import load_data, save_data
from app.utils.imagens_utils import upload_imagem
from app.config.config import Config
import os

class UserController:

    def __init__(self):
        self.caminho_usuarios = Config.DATA_USERS

    def carregar_todos(self):
        return load_data(self.caminho_usuarios)

    def adicionar_filme_user(self, usuario_id, filme_id, tipo):
        usuarios = load_data(self.caminho_usuarios)
        usuario = next((u for u in usuarios if u['id'] == usuario_id), None)
        if not usuario:
            return {'erro': 'Usuário não encontrado.'}, 400

        tipos_validos = ['favorito', 'assistido', 'assistir_mais_tarde']
        if tipo not in tipos_validos:
            return {'erro': 'Tipo inválido.'}, 400

        filme_id = int(filme_id)
        marcado = False

        if tipo == 'favorito':
            if filme_id in usuario['favoritos']:
                usuario['favoritos'].remove(filme_id)
            else:
                usuario['favoritos'].append(filme_id)
                marcado = True
        elif tipo == 'assistido':
            if filme_id in usuario['assistidos']:
                usuario['assistidos'].remove(filme_id)
            else:
                usuario['assistidos'].append(filme_id)
                marcado = True
                if filme_id in usuario['assistir_mais_tarde']:
                    usuario['assistir_mais_tarde'].remove(filme_id)
        elif tipo == 'assistir_mais_tarde':
            if filme_id in usuario['assistir_mais_tarde']:
                usuario['assistir_mais_tarde'].remove(filme_id)
            else:
                usuario['assistir_mais_tarde'].append(filme_id)
                marcado = True
                if filme_id in usuario['assistidos']:
                    usuario['assistidos'].remove(filme_id)

        save_data(usuarios, self.caminho_usuarios)

        if 'user_logado' in session:
            session['user_logado']['favoritos'] = usuario['favoritos']
            session['user_logado']['assistidos'] = usuario['assistidos']
            session['user_logado']['assistir_mais_tarde'] = usuario['assistir_mais_tarde']

        return {
            'sucesso': 'Estado atualizado!',
            'marcado': marcado,
            'tipo': tipo,
            'favoritos': usuario['favoritos'],
            'assistidos': usuario['assistidos'],
            'assistir_mais_tarde': usuario['assistir_mais_tarde']
        }, 200

    def remover_filme_user(self, usuario_id, filme_id, tipo):
        usuarios = load_data(self.caminho_usuarios)
        usuario = next((u for u in usuarios if u['id'] == usuario_id), None)
        if not usuario:
            return {'erro': 'Usuário não encontrado.'}, 400

        tipos_validos = ['favorito', 'assistido', 'assistir_mais_tarde']
        if tipo not in tipos_validos:
            return {'erro': 'Tipo inválido.'}, 400

        filme_id = int(filme_id)
        marcado = False

        if tipo == 'favorito' and filme_id in usuario['favoritos']:
            usuario['favoritos'].remove(filme_id)
        elif tipo == 'assistido' and filme_id in usuario['assistidos']:
            usuario['assistidos'].remove(filme_id)
        elif tipo == 'assistir_mais_tarde' and filme_id in usuario['assistir_mais_tarde']:
            usuario['assistir_mais_tarde'].remove(filme_id)

        save_data(usuarios, self.caminho_usuarios)

        if 'user_logado' in session:
            session['user_logado']['favoritos'] = usuario['favoritos']
            session['user_logado']['assistidos'] = usuario['assistidos']
            session['user_logado']['assistir_mais_tarde'] = usuario['assistir_mais_tarde']

        return {
            'sucesso': 'Filme removido!',
            'marcado': marcado,
            'tipo': tipo,
            'favoritos': usuario['favoritos'],
            'assistidos': usuario['assistidos'],
            'assistir_mais_tarde': usuario['assistir_mais_tarde']
        }, 200

    def editar_perfil(self, usuario_id, novo_username=None, nova_imagem=None):
        usuarios = load_data(self.caminho_usuarios)
        usuario = next((u for u in usuarios if u['id'] == usuario_id), None)

        if not usuario:
            return {'erro': 'Usuário não encontrado.'}, 400

        if novo_username:
            if novo_username != usuario['username']:
                existe = next(
                    (u for u in usuarios 
                     if u['username'].lower() == novo_username.lower() 
                     and u['id'] != usuario_id),
                    None
                )
                if existe:
                    return {'erro': 'Username já está em uso.'}, 400

            usuario['username'] = novo_username

        if nova_imagem:
            caminho_antigo = usuario.get('imagem_url')

            if caminho_antigo and 'default_user.jpg' not in caminho_antigo:
                caminho_antigo_real = os.path.join(Config.BASE_DIR, caminho_antigo.lstrip('/'))
                if os.path.exists(caminho_antigo_real):
                    os.remove(caminho_antigo_real)

            url_imagem = upload_imagem(nova_imagem, Config.UPLOAD_IMAGEM)

            if url_imagem:
                usuario['imagem_url'] = url_imagem

        save_data(usuarios, self.caminho_usuarios)

        if 'user_logado' in session:
            session['user_logado'] = usuario

        return {'sucesso': 'Perfil atualizado com sucesso!', 'usuario': usuario}, 200