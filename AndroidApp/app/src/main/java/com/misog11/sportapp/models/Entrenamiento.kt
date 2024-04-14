package com.misog11.sportapp.models

import java.sql.Date
import java.sql.Time

data class Entrenamiento (
    val id: Int,
    val user_id: Int,
    val sport_type: String,
    val duration: String,
    val fecha: Date,
    val calories_active: Int,
    val total_calories: Int,
    val fcm: Int,

)