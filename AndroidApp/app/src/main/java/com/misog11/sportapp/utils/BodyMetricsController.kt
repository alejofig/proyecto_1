package com.misog11.sportapp.utils

import android.util.Log
import com.misog11.sportapp.models.UserDTO

class BodyMetricsController(userDTO: UserDTO) {
    private val userDTO = userDTO
    var totalCaloriesBurned: Double = 0.0
    var totalCalories: Double = 0.0

    fun updateFCM(): Int {
        return 220 - userDTO.edadUsuario
    }

    fun calculateCaloriesInRepose(): Double {
        val factorGenero = if (Constants.generoFemenino.equals(userDTO.generoUsuario)) -161 else 5
        val calculo: Double =
            (10 * userDTO.pesoUsuarioKg) + (6.25 * userDTO.alturaUsuarioCm) - (5 * userDTO.edadUsuario) + factorGenero
        return calculo
    }

    fun updateCalories(deporte: String) {
        val met: Double =
            if (deporte == Constants.ciclismo) Constants.metCiclismo else if (deporte == Constants.atletismo) Constants.metAtletismo else 0.0

        val caloriesPerSecond = (met * userDTO.pesoUsuarioKg * 3.5) / 200 / 3600
        if (met != 0.0) {
            totalCaloriesBurned += caloriesPerSecond * 5
            // Calcular calorías en reposo basado en la fórmula de Mifflin-St Jeor
            val caloriesInRepose = calculateCaloriesInRepose() / (24 * 3600) * 5
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