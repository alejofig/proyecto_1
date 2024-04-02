import os
from dotenv import load_dotenv

load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT")
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID= os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET= os.getenv("AUTH0_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
AUTH0_PUBLIC_KEY = os.getenv("AUTH0_PUBLIC_KEY")
ALGORITHM = os.getenv("ALGORITHM")
AUTH0_API_IDENTIFIER = os.getenv("AUTH0_API_IDENTIFIER")