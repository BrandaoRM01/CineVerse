from app.utils.data_utils import load_data, save_data
from app.config.config import Config

class AdminController:

    def __init__(self):
        self.caminho_usuarios = Config.DATA_USERS

    def obter_usuarios(self):
        usuarios = load_data(self.caminho_usuarios)
        return usuarios
    
    def alterar_permissao_admin(self, usuario_id, tornar_admin):
        usuarios = load_data(self.caminho_usuarios)

        for usuario in usuarios:
            if usuario['id'] == usuario_id:
                usuario['admin'] = tornar_admin
                save_data(usuarios, self.caminho_usuarios)
                return {'sucesso': 'Permissão alterada com sucesso!'}, 200
        else:
            return {'erro': 'Usuário não encontrado.'}, 400