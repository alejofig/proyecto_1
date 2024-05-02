import boto3
from app import config
import requests

def encrypt_data(data: str) -> bytes:
    """
    Encrypts a data using AWS Key Management Service (KMS).

    Args:
    - data (str): The data to encrypt.

    Returns:
    - bytes: The encrypted data.
    """
    kms_client = boto3.client('kms', region_name="us-east-1")
    response = kms_client.encrypt(KeyId=config.KMS_KEY_ID, Plaintext=data)
    encrypted_data = response['CiphertextBlob']
    return encrypted_data

def notifications_ses(email):
    ses = boto3.client('ses')
    response = ses.verify_email_identity(
    EmailAddress =email
    )
    print(response)


def renew_access_token(refresh_token: str) -> str:
    """
    Renueva un token de acceso utilizando el token de actualización (refresh_token).

    Args:
        client_id (str): ID de cliente de tu aplicación en Strava.
        client_secret (str): Secreto de cliente de tu aplicación en Strava.
        refresh_token (str): Token de actualización proporcionado por Strava.

    Returns:
        str: El nuevo token de acceso si la renovación es exitosa, None en caso de error.
    """
    # URL para obtener un nuevo token
    token_url = 'https://www.strava.com/oauth/token'

    # Parámetros para solicitar un nuevo token utilizando el token de actualización
    params = {
        'client_id': config.STRAVA_CLIENT_ID,
        'client_secret': config.STRAVA_CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }

    # Solicitar un nuevo token utilizando el token de actualización
    response = requests.post(token_url, data=params)

    # Verificar la respuesta
    if response.status_code == 200:
        # Se obtuvo un nuevo token exitosamente
        new_token = response.json()
        return new_token
    else:
        # Error al solicitar un nuevo token
        print("Error al solicitar un nuevo token:", response.status_code)
        return None