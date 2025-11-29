from flask import Flask
from app.config.config import Config
from app.utils.admin_utils import criar_admin

def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    from app.blueprints.main_bp import main_bp
    from app.blueprints.auth_bp import auth_bp
    from app.blueprints.filmes_bp import filmes_bp
    from app.blueprints.admin_bp import admin_bp
    from app.blueprints.user_bp import user_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(filmes_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_bp)

    criar_admin()

    return app