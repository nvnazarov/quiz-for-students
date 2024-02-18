from passlib.context import CryptContext

_crypto_context = CryptContext(schemes=["bcrypt"])


def verify_password(password: str, hash: str) -> bool:
    """Check password corresponds to the hash."""
    
    return _crypto_context.verify(password, hash)


def hash_password(password: str) -> str:
    """Hash password."""
    
    return _crypto_context.hash(password)


def is_valid_password(password: str) -> bool:
    """Check if password is valid.
    
    Password should contain at least 8 symbols,
    including both letters and digits."""
    
    password = password.lower()
    return len(password) >= 8 and any([d in password for d in '0123456789']) and \
        any([s in password for s in 'abcdefghijklmnopqrstuvwxyz'])