from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# database
DB_USER = os.getenv('USER_DB_USER')
DB_PASS = os.getenv('USER_DB_PASS')
DB_HOST = os.getenv('USER_DB_HOST')
DB_PORT = os.getenv('USER_DB_PORT')
DB_NAME = os.getenv('USER_DB_NAME')

DB_URL = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

# token
JWT_SECRET = os.getenv('AUTH_JWT_SECRET')
JWT_ALGORITHM = os.getenv('AUTH_JWT_ALGORITHM')
JWT_EXPIRES_MINUTES = int(os.getenv('AUTH_JWT_EXPIRES_MINUTES'))

# password
PASS_CRYPT_CONTEXT = CryptContext(schemes=['bcrypt'])