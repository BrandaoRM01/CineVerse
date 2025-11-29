import uuid, os
from app.config.config import Config

def upload_imagem(imagem, pasta_destino):
    os.makedirs(pasta_destino, exist_ok=True)

    if not imagem or not getattr(imagem, 'filename', ''):
        return None

    if not verificar_arquivos(imagem):
        return None

    filename = f"{uuid.uuid4()}.{imagem.filename.rsplit('.', 1)[1].lower()}"
    filepath = os.path.join(pasta_destino, filename)
    imagem.save(filepath)

    nome_pasta = os.path.basename(pasta_destino)
    return f"/static/uploads/{nome_pasta}/{filename}"

def verificar_arquivos(imagem):
    return (
        '.' in imagem.filename and
        imagem.filename.rsplit('.', 1)[1].lower() in Config.TIPOS_IMAGEM
    )