from functools import wraps
from auth import Auth0
from flask import jsonify, request
import logging
import config
import requests

def protected_route(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        try:
            user_id = Auth0.get_current_user()
            user =Auth0.get_user_by_id(user_id)
            return f(user, *args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({"detail": "No se pudo validar las credenciales"}), 401
    return decorated_function

def protected_route_movil(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            authorization = request.headers.get('Authorization')
            logging.debug(f"token recibido {authorization}") 
            
            user = requests.get(f"https://{config.AUTH0_DOMAIN}/userinfo", 
                                headers={"Authorization": f"{authorization}"}) 
                
            return f(user.json(), *args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({"detail": "No se pudo validar las credenciales"}), 401
    
    return decorated_function