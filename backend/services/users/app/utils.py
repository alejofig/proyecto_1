import boto3
from app import config

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