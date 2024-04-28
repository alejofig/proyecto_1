package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
class UserDTO(
     var id: Int,
     var pesoUsuarioKg: Double,
     var edadUsuario: Int,
     var generoUsuario: String,
     var alturaUsuarioCm: Int,
)