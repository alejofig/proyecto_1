package com.misog11.sportapp.models

import kotlinx.serialization.Serializable

@Serializable
class Entrenamiento (
   var user_id: Int? = null,
   var sport_type: String? = null,
   var duration: Int? = null,
   var fecha: String? = null,
   var calories_active: Double? = null,
   var total_calories: Double? = null,
   var fcm: Int? = null
)

@Serializable
class EntrenamientoInd (
   var user_id: Int? = null,
   var sport_type: String? = null,
   var duration: String? = null,
   var fecha: String? = null,
   var calories_active: Double? = null,
   var total_calories: Double? = null,
   var fcm: Int? = null,
   var height:Int? = null,
   var genero:String? = null,
   var edad:Int? = null
)
