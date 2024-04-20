# app/auth.py
import config
import requests
from flask import request
from jose import JWTError, jwt
from werkzeug.exceptions import HTTPException
import logging

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

        response = requests.post(url, data=data)

        if response.status_code != 200:
            raise HTTPException(response.status_code, "Failed to generate management access token")
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
    def get_current_user():
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[1]
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
                raise HTTPException(401, "No se pudo encontrar la clave de firma RSA")
            
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=[config.ALGORITHM],
                audience=config.AUTH0_API_IDENTIFIER,
                issuer=f"https://{config.AUTH0_DOMAIN}/"
            )
            username: str = payload.get("sub")
            if username is None:
                raise HTTPException(401, "Token no contiene un usuario válido")
            return username
        except jwt.JWTError as e:
            print(e)
            raise HTTPException(401, "Token JWT inválido o expirado")
        except Exception as e:
            print(e)
            raise HTTPException(500, "Error al decodificar el token JWT")
    
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
        if response.status_code != 200:
            return {}
        return user_info_list[0] if len(user_info_list) > 0 else {}
    
    @staticmethod
    def get_user_by_id(user_id: str):
        endpoint = f'https://{config.AUTH0_DOMAIN}/api/v2/users/{user_id}'
        response = requests.get(url=endpoint, headers=Auth0.generate_headers())
        if response.status_code != 200:
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
            raise HTTPException(500, "Failed to exchange code for token")
        print(response.json())
        return response.json().get("access_token")