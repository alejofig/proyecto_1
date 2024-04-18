package com.misog11.sportapp.models

class UserDTO(
    private var _pesoUsuarioKg: Double,
    private var _edadUsuario: Int,
    private var _generoUsuario: String,
    private var _alturaUsuarioCm: Int
) {
    var pesoUsuarioKg: Double
        get() = _pesoUsuarioKg
        set(value) {
            _pesoUsuarioKg = value
        }

    var edadUsuario: Int
        get() = _edadUsuario
        set(value) {
            _edadUsuario = value
        }

    var generoUsuario: String
        get() = _generoUsuario
        set(value) {
            _generoUsuario = value
        }

    var alturaUsuarioCm: Int
        get() = _alturaUsuarioCm
        set(value) {
            _alturaUsuarioCm = value
        }
}