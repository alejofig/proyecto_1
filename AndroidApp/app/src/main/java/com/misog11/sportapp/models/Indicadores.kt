package com.misog11.sportapp.models


data class Indicadores(
    val userId: String,
    val nombreIndicador: String,
    val deporte: String,
    val visible: Boolean,
    val detallesAdicionales: String
)