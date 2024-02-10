import os

from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

TOKEN_ENCODE_SECRET = os.getenv("TOKEN_ENCODE_SECRET")
TOKEN_ENCODE_ALGORITHM = os.getenv("TOKEN_ENCODE_ALGORITHM")
TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE_MINUTES"))

PASS_CRYPT_CONTEXT = CryptContext(schemes=["bcrypt"])