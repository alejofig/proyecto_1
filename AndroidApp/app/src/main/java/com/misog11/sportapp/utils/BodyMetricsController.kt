package com.misog11.sportapp.utils

import android.util.Log
import com.misog11.sportapp.models.UserDTO

class BodyMetricsController() {
    var totalCaloriesBurned: Double = 0.0
    var totalCalories: Double = 0.0

    fun updateFCM(userDTO: UserDTO): Int {
        return 220 - userDTO.edad
    }

    fun calculateCaloriesInRepose(userDTO: UserDTO): Double {
        val factorGenero = if (Constants.generoFemenino.equals(userDTO.genero)) -161 else 5
        val calculo: Double =
            (10 * userDTO.peso) + (6.25 * userDTO.altura) - (5 * userDTO.edad) + factorGenero
        return calculo
    }

    fun updateCalories(deporte: String,userDTO: UserDTO) {
        val met: Double =
            if (deporte == Constants.ciclismo) Constants.metCiclismo else if (deporte == Constants.atletismo) Constants.metAtletismo else 0.0

        val caloriesPerSecond = (met * userDTO.peso * 3.5) / 200 / 3600
        if (met != 0.0) {
            totalCaloriesBurned += caloriesPerSecond * 5
            // Calcular calorías en reposo basado en la fórmula de Mifflin-St Jeor
            val caloriesInRepose = calculateCaloriesInRepose(userDTO) / (24 * 3600) * 5
            // Calcular calorías totales (activas + en reposo)
            totalCalories = totalCaloriesBurned + caloriesInRepose
        }

        // Imprimir el valor de las calorías totales en el Logcat
//        Log.d("CaloriesInfo", "Total Calories Burned: $totalCaloriesBurned")
    }

    fun getCalories(): Double {
        return totalCalories
    }

    fun getCaloriesBurned(): Double {
        return totalCaloriesBurned
    }
}