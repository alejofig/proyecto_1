package com.misog11.sportapp

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity

class DeporteActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_deporte)

        // Configura el listener para Atletismo
        val ivAtletismo = findViewById<View>(R.id.ivAtletismo)
        ivAtletismo.setOnClickListener {
            abrirEntrenamiento("atletismo")
        }

        // Configura el listener para Ciclismo
        val ivCiclismo = findViewById<View>(R.id.ivCiclismo)
        ivCiclismo.setOnClickListener {
            abrirEntrenamiento("ciclismo")
        }
    }

    // Función para abrir la actividad de entrenamiento
    private fun abrirEntrenamiento(deporte: String) {
        val intent = Intent(this, EntrenamientoActivity::class.java)
        intent.putExtra("DEPORTE", deporte) // Agrega el deporte como un extra
        startActivity(intent)
    }
}