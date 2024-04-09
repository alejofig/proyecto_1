package com.misog11.sportapp

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.misog11.sportapp.databinding.ActivityEntrenamientoBinding
import java.util.Timer
import java.util.TimerTask
import android.util.Log

class EntrenamientoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEntrenamientoBinding
    private var seconds = 0 // Contador de segundos
    private var timer: Timer? = null
    private val handler = Handler(Looper.getMainLooper())

    // Mocked user data
    private val pesoUsuarioKg = 70.0 // kg
    private val metCiclismo = 8.0
    private val metAtletismo = 9.8
    private var totalCaloriesBurned = 0.0
    private val isCycling = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEntrenamientoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnIniciar.setOnClickListener {
            startTimer()
        }

        binding.btnFinish.setOnClickListener {
            pauseTimer()
        }
    }



    private fun startTimer() {
        timer?.cancel() // Cancela cualquier temporizador existente
        seconds = 0 // Resetea el contador de segundos cada vez que se inicia
        totalCaloriesBurned = 0.0 // Resetea las calorías quemadas
        binding.tvActiveCalories.text = "0"

        timer = Timer()
        timer?.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                handler.post {
                    updateTimer()
                    if (seconds % 5 == 0) { // Cada 5 segundos, actualiza las calorías
                        updateCalories()
                    }
                }
            }
        }, 0, 1000) // Programa la tarea para ejecutarse cada 1000 ms (1 segundo)
    }

    private fun pauseTimer() {
        timer?.cancel() // Cancela el temporizador para pausarlo
    }

    private fun updateTimer() {
        val hours = seconds / 3600
        val minutes = (seconds % 3600) / 60
        val secs = seconds % 60

        // Formatea y actualiza el TextView del temporizador
        binding.tvTimer.text = String.format("%02d:%02d:%02d", hours, minutes, secs)

        seconds++ // Incrementa el número de segundos
    }

    private fun updateCalories() {
        val met = if (isCycling) metCiclismo else metAtletismo
        val caloriesPerSecond = (met * pesoUsuarioKg * 3.5) / 200 / 3600
        totalCaloriesBurned += caloriesPerSecond * 5 // Acumula calorías cada 5 segundos

        // Actualizar el TextView de calorías activas
        binding.tvActiveCalories.text = String.format("%.2f", totalCaloriesBurned)

        // Imprimir el valor de las calorías totales en el Logcat
        Log.d("CaloriesInfo", "Total Calories Burned: $totalCaloriesBurned")
    }

    override fun onDestroy() {
        super.onDestroy()
        timer?.cancel() // Asegura que el temporizador se cancele al salir de la actividad
    }
}
