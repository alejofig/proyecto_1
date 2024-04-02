import config
import requests
from fastapi import status
class Auth0:
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

        if response.status_code != status.HTTP_200_OK:
            return {}
        return response.json()

    @staticmethod
    def generate_headers() -> dict[str, str]:
        auth0_data = Auth0.generate_management_access_token()
        headers = {
            "AUTHORIZATION": f'bearer {auth0_data.get("access_token")}',
            "CONTENT-TYPE": "application/json",
        }
        return headers


    @staticmethod
    def get_user_by_email(user_email: str):
        endpoint = f'https://{config.AUTH0_DOMAIN}/api/v2/users-by-email?email={user_email}'
        response = requests.get(url=endpoint, headers=Auth0.generate_headers())
        user_info_list = response.json()
        if response.status_code != status.HTTP_200_OK:
            return {}
        return user_info_list[0] if len(user_info_list) > 0 else {}
    
    @staticmethod 
    def register_user(username, email, password):
        url = f"https://{config.AUTH0_DOMAIN}/api/v2/users"
        data = {
            "email": email,
            "username": username,
            "password": password,
            "connection": "Username-Password-Authentication"
        }
        response = requests.post(url, headers=Auth0.generate_headers(), json=data)
        
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Error al registrar usuario en Auth0: {response.status_code} - {response.text}")