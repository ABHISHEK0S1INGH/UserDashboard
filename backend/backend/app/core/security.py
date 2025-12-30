from . import typing as t
from ..extensions import bcrypt


def hash_password(password: str) -> str:
    return bcrypt.generate_password_hash(password).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.check_password_hash(hashed, password)


def validate_password_strength(password: str) -> t.Optional[str]:
    if len(password) < 8:
        return "Password must be at least 8 characters"
    if password.isalpha() or password.isnumeric():
        return "Password must include letters and numbers"
    return None
