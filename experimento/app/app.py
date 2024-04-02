# Escenario 1: Solicitudes a los servicios como si fueran HTTP.

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


@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    session = database.get_session()
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Faltan datos'}), 400
    usuario = Usuario(username=username)
    usuario.set_password(password)
    session.add(usuario)
    session.commit()
    return jsonify({'mensaje': 'Usuario creado'}), 201


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

@app.route('/usuarios/<id>', methods=['GET'])
def obtener_usuario(id):
    session = database.get_session()
    usuario = session.query(Usuario).get(id)
    if usuario:
        return jsonify({
            'id': usuario.id,
            'username': usuario.username
        })
    return jsonify({'error': 'Usuario no encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)