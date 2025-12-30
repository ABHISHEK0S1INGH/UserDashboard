from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models.user import User
from ..core.decorators import role_required
from ..schemas.user import ProfileUpdateInput, PasswordChangeInput
from ..services import user_service


users_bp = Blueprint("users", __name__)


@users_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def list_users():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    data = user_service.list_users(page=page, limit=limit)
    return jsonify(data)


@users_bp.route("/users/<user_id>/activate", methods=["POST"])
@jwt_required()
@role_required("admin")
def activate_user(user_id):
    user = user_service.set_status(user_id, "active")
    return jsonify(user.to_dict())


@users_bp.route("/users/<user_id>/deactivate", methods=["POST"])
@jwt_required()
@role_required("admin")
def deactivate_user(user_id):
    user = user_service.set_status(user_id, "inactive")
    return jsonify(user.to_dict())


@users_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404
    return jsonify(user.to_dict())


@users_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        payload = ProfileUpdateInput.from_json(request.get_json(force=True))
    except Exception as err:
        return jsonify({"error": {"code": "validation_error", "message": str(err)}}), 400

    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404

    updated = user_service.update_profile(user, payload.full_name, payload.email)
    return jsonify(updated.to_dict())


@users_bp.route("/profile/password", methods=["PUT"])
@jwt_required()
def update_password():
    try:
        payload = PasswordChangeInput.from_json(request.get_json(force=True))
    except Exception as err:
        return jsonify({"error": {"code": "validation_error", "message": str(err)}}), 400

    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": {"code": "not_found", "message": "User not found"}}), 404

    user_service.change_password(user, payload.current_password, payload.new_password)
    return jsonify({"message": "Password updated"})
