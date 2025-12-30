from flask import Flask, jsonify
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate, jwt, bcrypt
from .auth.routes import auth_bp
from .users.routes import users_bp


def create_app(config_class: type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api")

    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "user-management-api"}), 200

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": {"code": "not_found", "message": "Route not found"}}), 404

    @app.errorhandler(400)
    def bad_request(err):
        return jsonify({"error": {"code": "bad_request", "message": str(err)}}), 400

    @app.errorhandler(500)
    def server_error(err):
        return jsonify({"error": {"code": "server_error", "message": "Unexpected error"}}), 500

    return app
