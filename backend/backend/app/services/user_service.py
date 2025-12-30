from math import ceil
from flask import abort
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models.user import User
from ..core.security import hash_password, verify_password, validate_password_strength


def list_users(page: int = 1, limit: int = 10):
    page = max(page, 1)
    limit = max(limit, 1)
    query = User.query.order_by(User.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "items": [u.to_dict() for u in items],
        "page": page,
        "limit": limit,
        "total": total,
        "pages": ceil(total / limit) if limit else 0,
    }


def set_status(user_id: str, status: str):
    user = db.session.get(User, user_id)
    if not user:
        abort(404, description="User not found")
    user.status = status
    db.session.commit()
    return user


def update_profile(user: User, full_name: str, email: str):
    user.full_name = full_name
    user.email = email.lower()
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(400, description="Email already in use")
    return user


def change_password(user: User, current_password: str, new_password: str):
    if not verify_password(current_password, user.password_hash):
        abort(400, description="Current password incorrect")
    weakness = validate_password_strength(new_password)
    if weakness:
        abort(400, description=weakness)
    user.password_hash = hash_password(new_password)
    db.session.commit()
