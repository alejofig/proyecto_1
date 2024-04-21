package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
data class calcularIndicadoresResponseDto(
    var ftp: Double,
    var vo2Max: Double
)