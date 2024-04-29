package com.misog11.sportapp.utils

import android.os.Handler
import java.util.Timer
import java.util.TimerTask
import kotlin.reflect.KFunction1

class TimerController {

    private var seconds = 0 // Contador de segundos
    private var timer: Timer? = null
    var isPaused = false // Nuevo estado para verificar si el temporizador está en pausa
    fun startTimer(handler: Handler, updateTimeView: (String) -> Unit, updateCalories: () -> Unit) {
        if (isPaused) {
            isPaused = false // Resetea el estado de pausa
        } else {
            timer?.cancel() // Cancela cualquier temporizador existente
            seconds = 0 // Resetea el contador de segundos cada vez que se inicia
        }

        timer = Timer()
        timer?.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                handler.post {
                    updateTimeView(updateTimer()) // Llama a la función pasada como argumento
                    if (seconds % 5 == 0) { // Cada 5 segundos, actualiza las calorías
                        updateCalories() // Llama a la función pasada como argumento
                    }
                }
            }
        }, 0, 1000) // Programa la tarea para ejecutarse cada 1000 ms (1 segundo)
    }

    fun cancelTimer() {
        timer?.cancel() // Cancela el temporizador para pausarlo
    }

    fun updateTimer(): String {
        val hours = seconds / 3600
        val minutes = (seconds % 3600) / 60
        val secs = seconds % 60
        seconds++ // Incrementa el número de segundos
        val textTime = String.format("%02d:%02d:%02d", hours, minutes, secs);
        // Formatea y actualiza el TextView del temporizador
        return textTime
    }

    fun getSeconds(): Int {
        return seconds
    }

    fun getTimer(): Timer? {
        return timer
    }

    fun pauseTimer() {
        isPaused = true // Establece el estado de pausa
        timer?.cancel() // Cancela el temporizador para pausarlo
    }
}