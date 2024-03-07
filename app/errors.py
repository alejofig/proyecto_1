class ApiError(Exception):
    code = 422
    description = "Default message"


class TokenInvalidError(ApiError):
    code = 401
    description = "El token no es válido o está vencido"


class NoTokenError(ApiError):
    code = 403
    description = "No hay token en la solicitud"


class MissingDataError(ApiError):
    code = 400
    description = "Hay campos incompletos en la solicitud"


class UserDoesExist(ApiError):
    code = 404
    description = "El usuario ya existe"


class UserDoesNotCreated(ApiError):
    code = 404
    description = "El usuario no fue creado"
