from dataclasses import dataclass
import re


def require_fields(data: dict, fields: list[str]):
    missing = [f for f in fields if not data.get(f)]
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")


def validate_email(email: str) -> str:
    """Validate email format and return normalized email"""
    email = email.strip().lower()
    # Basic email regex pattern
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise ValueError("Invalid email format")
    return email


def normalize_email(email: str) -> str:
    return email.strip().lower()


@dataclass
class SignupInput:
    full_name: str
    email: str
    password: str

    @classmethod
    def from_json(cls, data: dict):
        require_fields(data, ["fullName", "email", "password"])
        return cls(
          full_name=data["fullName"].strip(),
          email=validate_email(data["email"]),
          password=data["password"],
        )


@dataclass
class LoginInput:
    email: str
    password: str

    @classmethod
    def from_json(cls, data: dict):
        require_fields(data, ["email", "password"])
        return cls(email=validate_email(data["email"]), password=data["password"])
