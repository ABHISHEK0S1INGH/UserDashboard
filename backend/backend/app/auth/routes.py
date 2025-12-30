from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..services import auth_service
from ..models.user import User
from ..extensions import db
from ..schemas.auth import SignupInput, LoginInput


auth_bp = Blueprint("auth", __name__)


def _auth_response(user: User, token: str):
    return jsonify({"user": user.to_dict(), "token": token})


@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        payload = SignupInput.from_json(request.get_json(force=True))
    except Exception as err:
        return jsonify({"error": {"code": "validation_error", "message": str(err)}}), 400
    try:
        user, token = auth_service.signup(payload.full_name, payload.email, payload.password)
        return _auth_response(user, token), 201
    except auth_service.AuthError as err:
        return jsonify({"error": {"code": "auth_error", "message": str(err)}}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        payload = LoginInput.from_json(request.get_json(force=True))
    except Exception as err:
        return jsonify({"error": {"code": "validation_error", "message": str(err)}}), 400
    try:
        user, token = auth_service.login(payload.email, payload.password)
        return _auth_response(user, token)
    except auth_service.AuthError as err:
        return jsonify({"error": {"code": "auth_error", "message": str(err)}}), 400


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404
    return jsonify(user.to_dict())


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWT is stateless; client should drop token. Endpoint kept for parity with frontend.
    return jsonify({"message": "Logged out"})
