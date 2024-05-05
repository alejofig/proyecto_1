package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
class RutinaAlimentacion(
    var carboidratos: Double? = null,
    var proteinas: Double? = null,
    var grasas: Double? = null
)

@Serializable
class RutinaDescanso(
    var minutos_sueno: Int? = null,
    var minutos_meditacion: Int? = null,
    var minutos_relajacion: Int? = null
)
