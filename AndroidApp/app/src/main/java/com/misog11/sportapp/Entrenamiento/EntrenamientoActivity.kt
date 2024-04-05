package com.misog11.sportapp.Entrenamiento

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

class EntrenamientoActivity : AppCompatActivity() {
    //TODO: Falta mapear data binding
    private lateinit var binding: ActivityMainBinding
    private val handler = Handler(Looper.getMainLooper())
    private var seconds = 0
    private var isRunning = false

    private var activeCalories = 0
    private var totalCalories = 0
    private var powerInKg = 0
    private var heartRate = 0

    // TODO: datos del usuario se deben traer del perfil del usuario
    val userWeightKg = 70f // Peso en kg
    val userAge = 25 // Edad en años
    val userGender = "M" // "M" para hombre, "F" para mujer
    val userHeightCm = 175 // Altura en cm
    val exerciseDurationMinutes = 5 // Duración del ejercicio en minutos, 5 minutos para el cálculo de 5 segundos

    // TODO: Valores MET segun actividad deportiva: solo atletismo o ciclismo
    val metValue = 8f

    // Constantes para la ecuación de calorías
    val calorieCalculationFactorMale = 88.362f
    val calorieCalculationFactorFemale = 447.593f


    private val metricsRunnable = object : Runnable {
        override fun run() {
            if (isRunning) {
                // Incrementa el contador de segundos
                seconds += 5

                // Aquí va la lógica para actualizar la UI
                updateTimerUI(seconds)

                // Aquí va la lógica para calcular y enviar las métricas
                sendMetrics()

                // Programa la siguiente ejecución del runnable en 5 segundos
                handler.postDelayed(this, 5000)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnPause.setOnClickListener {
            isRunning = !isRunning // Cambia el estado de isRunning

            // Cambia el texto del botón según el estado del entrenamiento
            if (isRunning) {
                binding.btnPause.text = getString(R.string.pause)
                handler.post(metricsRunnable)
            } else {
                binding.btnPause.text = getString(R.string.resume)
                handler.removeCallbacks(metricsRunnable)
            }
        }
    }

    private fun updateTimerUI(seconds: Int) {
        val hours = seconds / 3600
        val minutes = (seconds % 3600) / 60
        val secs = seconds % 60
        val time = String.format("%02d:%02d:%02d", hours, minutes, secs)
        binding.tvTimer.text = time
        // Actualiza la UI con las nuevas métricas también
    }


    private fun sendMetrics() {
        // Simulación de cálculo de calorías activas quemadas en los últimos 5 segundos
        activeCalories += calculateActiveCalories()

        // Simulación de cálculo de calorías totales
        totalCalories += calculateTotalCalories()

        // Simulación de cálculo de potencia en kg
        powerInKg = calculatePowerOutput()

        // Simulación de cálculo de pulsaciones
        heartRate = calculateHeartRate()

        // Actualiza la UI con las nuevas métricas
        updateMetricsUI()

        // TODO: Implementar el envío de datos a un servidor o base de datos local
    }

    private fun calculateActiveCalories(heartRate: Int): Float {
        // Fórmula Básica para el cálculo de calorías usando METs
        // Calorías/min = (MET x peso en kg x 3.5) / 200
        val caloriesPerMinute = (metValue * userWeightKg * 3.5) / 200

        val bmr = if (userGender == "M") {
            calorieCalculationFactorMale + (13.397f * userWeightKg) + (4.799f * userHeightCm) - (5.677f * userAge)
        } else {
            calorieCalculationFactorFemale + (9.247f * userWeightKg) + (3.098f * userHeightCm) - (4.330f * userAge)
        }
        val calorieAdjustmentFactor = bmr / 24 / 60 // BMR ajustado a minutos
        val adjustedCaloriesPerMinute = caloriesPerMinute + (heartRate / 100) * calorieAdjustmentFactor

        // Multiplicamos por la duración del ejercicio en minutos
        return adjustedCaloriesPerMinute.toFloat()  * exerciseDurationMinutes
    }


    private fun calculateTotalCalories(): Int {
        // Lógica de cálculo de calorías totales
        return (Math.random() * 7).toInt() // Valor simulado
    }

    private fun calculatePowerOutput(): Int {
        // Lógica de cálculo de potencia en kg
        return (Math.random() * 100).toInt() // Valor simulado
    }

    private fun calculateHeartRate(): Int {
        // Lógica de cálculo de pulsaciones
        return 60 + (Math.random() * 100).toInt() // Un rango de frecuencia cardíaca de reposo a activa
    }

    private fun updateMetricsUI() {
        // Actualiza la UI con los nuevos valores de calorías activas, calorías totales, potencia y pulsaciones
        binding.tvActiveCalories.text = getString(R.string.active_calories, activeCalories)
        binding.tvTotalCalories.text = getString(R.string.total_calories, totalCalories)
        binding.tvPower.text = getString(R.string.power_output, powerInKg)
        binding.tvHeartRate.text = getString(R.string.heart_rate, heartRate)
    }


    override fun onPause() {
        super.onPause()
        handler.removeCallbacks(metricsRunnable)
    }

    override fun onResume() {
        super.onResume()
        if (isRunning) {
            handler.post(metricsRunnable)
        }
    }
}
