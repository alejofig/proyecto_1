package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
data class Indicadores(
    val userId: String? = null,
    val nombreIndicador: String? = null,
    val deporte: String? = null,
    val visible: Boolean? = false,
    val detallesAdicionales: String? = null
)