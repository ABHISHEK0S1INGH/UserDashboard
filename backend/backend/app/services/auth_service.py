from datetime import datetime
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from ..extensions import db
from ..models.user import User
from ..core.security import hash_password, verify_password, validate_password_strength


class AuthError(Exception):
    pass


def signup(full_name: str, email: str, password: str) -> tuple[User, str]:
    weakness = validate_password_strength(password)
    if weakness:
        raise AuthError(weakness)

    user = User(full_name=full_name, email=email.lower(), password_hash=hash_password(password))
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise AuthError("Email already registered")

    token = create_access_token(identity=str(user.id))
    return user, token


def login(email: str, password: str) -> tuple[User, str]:
    user = User.query.filter_by(email=email.lower()).first()
    if not user or not verify_password(password, user.password_hash):
        raise AuthError("Invalid credentials")
    if user.status != "active":
        raise AuthError("Account is inactive")

    user.last_login_at = datetime.utcnow()
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return user, token
