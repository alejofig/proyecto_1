from functools import wraps
from auth import Auth0
from flask import jsonify, request

def protected_route(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        print("este es el token",request.args)
        try:
            user_id = Auth0.get_current_user()
            user =Auth0.get_user_by_id(user_id)
            return f(user, *args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({"detail": "No se pudo validar las credenciales"}), 401
    return decorated_function