package com.misog11.sportapp

import android.os.Bundle
import android.os.Handler
import android.os.SystemClock
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class EntrenamientoActivity : AppCompatActivity() {
    private lateinit var tvTimer: TextView
    private var startTime = 0L
    private var handler: Handler = Handler()
    private var timeInMilliseconds = 0L
    private var updateTime = 0L
    private var timeBuff = 0L
    private var running = false

    private val runnable: Runnable = object : Runnable {
        override fun run() {
            timeInMilliseconds = SystemClock.uptimeMillis() - startTime
            updateTime = timeBuff + timeInMilliseconds
            val seconds = (updateTime / 1000).toInt()
            val minutes = seconds / 60
            val hours = minutes / 60

            tvTimer.text = String.format("%02d:%02d:%02d", hours, minutes % 60, seconds % 60)

            handler.postDelayed(this, 0)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_entrenamiento)

        tvTimer = findViewById(R.id.tvTimer)

        // Recupera el deporte seleccionado
        val deporte = intent.getStringExtra("DEPORTE")
        // Opcionalmente, muestra el deporte seleccionado. Depende de tu diseño

        iniciarCronometro()
    }

    private fun iniciarCronometro() {
        if (!running) {
            startTime = SystemClock.uptimeMillis()
            handler.postDelayed(runnable, 0)
            running = true
        }
    }
}
