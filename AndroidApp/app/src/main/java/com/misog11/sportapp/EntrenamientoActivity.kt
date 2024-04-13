package com.misog11.sportapp

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.misog11.sportapp.databinding.ActivityEntrenamientoBinding
import java.util.Timer
import java.util.TimerTask
import android.util.Log
import android.widget.ImageView

class EntrenamientoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEntrenamientoBinding
    private var seconds = 0 // Contador de segundos
    private var timer: Timer? = null
    private val handler = Handler(Looper.getMainLooper())

    // Mocked user data
    private val pesoUsuarioKg = 70.0
    private val edadUsuario= 28
    private val generoUsuario= "Femenino"
    private val alturaUsuarioCm= 169
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
        val backBtn = findViewById<ImageView>(R.id.ivBackArrow)
        backBtn.setOnClickListener{
            navigate(DeporteActivity::class.java)
        }

    }

    private fun navigate(viewState:Class<*>){
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    private fun startTimer() {
        timer?.cancel() // Cancela cualquier temporizador existente
        seconds = 0 // Resetea el contador de segundos cada vez que se inicia
        totalCaloriesBurned = 0.0 // Resetea las calorías quemadas
        binding.tvActiveCalories.text = "0"
        binding.tvTotalCaloriesLabel.text = "0"
        binding.tvHeartRate.text= "0"
        updateFCM()

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

    private fun calculateCaloriesInRepose(): Double {
        val factorGenero = if (generoUsuario == "Femenino") -161 else 5
        return (10 * pesoUsuarioKg) + (6.25 * alturaUsuarioCm) - (5 * edadUsuario) + factorGenero
    }


    private fun updateCalories() {
        val met = if (isCycling) metCiclismo else metAtletismo
        val caloriesPerSecond = (met * pesoUsuarioKg * 3.5) / 200 / 3600
        totalCaloriesBurned += caloriesPerSecond * 5 // Acumula calorías cada 5 segundos

        // Calcular calorías en reposo basado en la fórmula de Mifflin-St Jeor
        val caloriesInRepose = calculateCaloriesInRepose() / (24 * 3600) * 5

        // Calcular calorías totales (activas + en reposo)
        val totalCalories = totalCaloriesBurned + caloriesInRepose

        // Actualizar el TextView de calorías activas
        binding.tvActiveCalories.text = String.format("%.2f", totalCaloriesBurned)

        // Actualizar el TextView de calorías totales
        binding.tvTotalCaloriesLabel.text = String.format("%.2f", totalCalories)

        // Imprimir el valor de las calorías totales en el Logcat
        Log.d("CaloriesInfo", "Total Calories Burned: $totalCaloriesBurned")
    }

    private fun updateFCM() {
        val rfc= 220 -edadUsuario

        binding.tvHeartRate.text = rfc.toString()

    }

    override fun onDestroy() {
        super.onDestroy()
        timer?.cancel() // Asegura que el temporizador se cancele al salir de la actividad
    }
}
