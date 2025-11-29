from flask import session

def verificar_logado():
    if not session.get('user_logado'):
        return False
    return True