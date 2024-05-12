package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
data class IndicadoresDTO(
    var userId: String = "",
    var nombreIndicador: String = "",
    var deporte: String = "",
    var visible: Boolean = false,
    var detallesAdicionales: String? = null
)