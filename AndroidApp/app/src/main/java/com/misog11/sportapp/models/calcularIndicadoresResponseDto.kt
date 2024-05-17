package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
data class calcularIndicadoresResponseDto(
    var ftp: Double,
    var vo2Max: Double,
    var temperatura: Double,
    var cadencia: Double,
    var potencia: Double,
    var velocidad: Double,
    var tiempoContactoSuelo: Double,
    var longitudZancada: Double,
    var ascensoTotal: Double,
    var descensoTotal: Double
)