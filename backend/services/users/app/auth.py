# app/auth.py
from app import config
import requests
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f'https://{config.AUTH0_DOMAIN}/oauth/token',
)

class Auth0:

    @staticmethod
    def get_jwks():
        jwks_url = f"https://{config.AUTH0_DOMAIN}/.well-known/jwks.json"
        response = requests.get(jwks_url)
        jwks = response.json()
        return jwks
    
    @staticmethod
    def generate_management_access_token():
        url = f'https://{config.AUTH0_DOMAIN}/oauth/token'
        data = {
            "client_id": config.AUTH0_CLIENT_ID,
            "client_secret": config.AUTH0_CLIENT_SECRET,
            "audience": f'https://{config.AUTH0_DOMAIN}/api/v2/',
            "grant_type": "client_credentials",
        }

        response = requests.post(url, data)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to generate management access token")
        return response.json()

    @staticmethod
    def generate_headers() -> dict:
        auth0_data = Auth0.generate_management_access_token()
        headers = {
            "Authorization": f'Bearer {auth0_data.get("access_token")}',
            "Content-Type": "application/json",
        }
        return headers

    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme)):
        try:
            token_header = jwt.get_unverified_header(token)
            jwks = Auth0.get_jwks()
            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == token_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
                    break
            if not rsa_key:
                raise HTTPException(status_code=401, detail="No se pudo encontrar la clave de firma RSA")
            
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=[config.ALGORITHM],
                audience=config.AUTH0_API_IDENTIFIER,
                issuer=f"https://{config.AUTH0_DOMAIN}/"
            )
            username: str = payload.get("sub")
            if username is None:
                raise HTTPException(status_code=401, detail="Token no contiene un usuario válido")
            return username
        except jwt.JWTError as e:
            print(e)
            raise HTTPException(status_code=401, detail="Token JWT inválido o expirado")
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Error al decodificar el token JWT")
    
    @staticmethod
    def register_user(email, password):
        url = f"https://{config.AUTH0_DOMAIN}/api/v2/users"
        data = {
            "email": email,
            "password": password,
            "connection": "Username-Password-Authentication"
        }
        response = requests.post(url, headers=Auth0.generate_headers(), json=data)
        
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Error al registrar usuario en Auth0: {response.status_code} - {response.text}")
        
    @staticmethod
    def get_user_by_email(user_email: str):
        endpoint = f'https://{config.AUTH0_DOMAIN}/api/v2/users-by-email?email={user_email}'
        response = requests.get(url=endpoint, headers=Auth0.generate_headers())
        user_info_list = response.json()
        if response.status_code != status.HTTP_200_OK:
            return {}
        return user_info_list[0] if len(user_info_list) > 0 else {}
    
    @staticmethod
    def get_user_by_id(user_id: str):
        endpoint = f'https://{config.AUTH0_DOMAIN}/api/v2/users/{user_id}'
        response = requests.get(url=endpoint, headers=Auth0.generate_headers())
        if response.status_code != status.HTTP_200_OK:
            return {}
        return response.json()


    @staticmethod
    def exchange_code_for_token(code: str):
        url = f'https://{config.AUTH0_DOMAIN}/oauth/token'
        data = {
            "client_id": config.AUTH0_CLIENT_ID,
            "client_secret": config.AUTH0_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": config.REDIRECT_URI
        }

        response = requests.post(url, data=data)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to exchange code for token")
        return response.json().get("access_token")