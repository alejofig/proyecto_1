import json
import boto3
from botocore.exceptions import ClientError

def enviar_correo_ses(asunto, cuerpo, remitente, destinatario):
    ses_client = boto3.client('ses')  
    mensaje = {
        'Subject': {'Data': asunto},
        'Body': {'Text': {'Data': cuerpo}}
    }
    try:
        response = ses_client.send_email(
            Source=remitente,
            Destination={'ToAddresses': [destinatario]},
            Message=mensaje
        )
        print("Correo enviado. ID del mensaje:", response['MessageId'])
    except ClientError as e:
        print("Se produjo un error al enviar el correo:", e)
        raise e

def run(event, context):
    print(event)
    for record in event['Records']:
        message_body = json.loads(record['body'])
        asunto = message_body.get('asunto', '')
        cuerpo = message_body.get('cuerpo', '')
        remitente = message_body.get('remitente', '')
        destinatario = message_body.get('destinatario', '')
        if asunto and cuerpo and remitente and destinatario:
            enviar_correo_ses(asunto, cuerpo, remitente, destinatario)
        else:
            print("Faltan datos en el mensaje de la cola SQS")

    return {
        'statusCode': 200,
        'body': json.dumps('Correos enviados correctamente')
    }
