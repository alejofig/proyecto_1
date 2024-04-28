package com.misog11.sportapp.models

import kotlinx.serialization.Serializable
import java.util.Calendar

@Serializable
class UserDTO(
     var id: Int = 0,
     var username: String = "",
     var password: String = "",
     var email: String = "",
     var auth0Id: String? = null,
     var nombre: String? = null,
     var apellido: String? = null,
     var tipoDocumentacion: String? = null,
     var numeroIdentificacion: String? = null,
     var genero: String = "",
     var edad: Int = 0,
     var peso: Int = 0,
     var paisNacimiento: String? = null,
     var ciudadNacimiento: String? = null,
     var paisResidencia: String? = null,
     var ciudadResidencia: String? = null,
     var antiguedadResidencia: Int? = null,
     var altura: Int = 0,
     var tipoPlan: String? = null,
     var deportes: List<String> = emptyList(),
     val createdAt: Calendar = Calendar.getInstance()
)

