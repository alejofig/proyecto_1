package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
 class Entrenamiento (
    var id: Int,
    var user_id: Int,
    var sport_type: String,
    var duration: String,
    var fecha: String,
    var calories_active: Double,
    var total_calories: Double,
    var fcm: Int,
    var height:Int,
    var genero:String,
    var edad:Int
)

