from flask import Flask, jsonify, request
import os

from .models.router import Usuario 
from .models.database import database
app = Flask(__name__)


API_KEY = os.getenv('API_KEY')
# Ruta de salud para el health check
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'}), 200


# Ruta para obtener usuarios
@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    session = database.get_session()
    usuarios = session.query(Usuario).all()
    users = []
    for user in usuarios:
        users.append({
            'id': user.id,
            'username': user.username
        })
    return jsonify(users)


if __name__ == '__main__':
    app.run(debug=True)