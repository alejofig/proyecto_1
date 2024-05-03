package com.misog11.sportapp.models

import kotlinx.serialization.Serializable
import kotlin.random.Random

@Serializable
class Entrenamiento (
   var user_id: Int? = null,
   var sport_type: String? = null,
   var duration: Int? = null,
   var fecha: String? = null,
   var calories_active: Double? = null,
   var total_calories: Double? = null,
   var fcm: Int? = null,
   var distance: Int? = null
) {
   init {
      if (distance == null) {
         distance = Random.nextInt(1000, 20000)
      }
   }
}

@Serializable
class EntrenamientoInd(
   var duration: String? = null,
   var fcm: Int? = null,
   var height: Int? = null,
   var edad: Int? = null,
   var genero: String? = null
)
