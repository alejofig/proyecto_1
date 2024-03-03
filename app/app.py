import os

from flask import Flask, jsonify, request

from .models.database import database
from .models.router import Usuario

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


# Ruta para crear usuarios
@app.route('/usuario', methods=['POST'])
def crear_usuario():
    json = request.get_json()
    usuario = Usuario(
        nombre=json['nombre'],
        email=json['email'],
        username=json['username'],
        password_hash=json['password_hash']
    )
    session = database.get_session()
    usuario_existe = session.query(Usuario).filter_by(username=json['username']).first()
    if usuario_existe is None:
        database.session.add(usuario)
        database.commit()
    return jsonify({'id': str(usuario.id)}), 201


if __name__ == '__main__':
    app.run(debug=True)
