from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from ..models.user import User
from ..extensions import db


def role_required(role: str):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = db.session.get(User, user_id)
            if not user:
                return jsonify({"error": {"code": "unauthorized", "message": "User not found"}}), 401
            if user.role != role:
                return jsonify({"error": {"code": "forbidden", "message": "Not allowed"}}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator
