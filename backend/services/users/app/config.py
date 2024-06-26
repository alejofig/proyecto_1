import os
from dotenv import load_dotenv

load_dotenv()
DB_USER = os.getenv("DB_USER","prueba")
DB_PASSWORD = os.getenv("DB_PASSWORD","prueba")
DB_HOST = os.getenv("DB_HOST","localhost")
DB_NAME = os.getenv("DB_NAME","prueba")
DB_PORT = os.getenv("DB_PORT","5432")
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID= os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET= os.getenv("AUTH0_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
AUTH0_PUBLIC_KEY = os.getenv("AUTH0_PUBLIC_KEY")
ALGORITHM = os.getenv("ALGORITHM")
AUTH0_API_IDENTIFIER = os.getenv("AUTH0_API_IDENTIFIER")
KMS_KEY_ID = os.getenv("KMS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")

STRAVA_CLIENT_ID= os.getenv("STRAVA_CLIENT_ID")
STRAVA_ACCESS_TOKEN= os.getenv("STRAVA_ACCESS_TOKEN")
STRAVA_CLIENT_SECRET= os.getenv("STRAVA_CLIENT_SECRET")
STRAVA_TOKEN_REFRESH=os.getenv("STARVA_TOKEN_REFRESH")
STRAVA_REDIRECT_URI=os.getenv("STRAVA_REDIRECT_URI","http://localhost:3001/strava_callback")

def get_postgres_url():
    return f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"