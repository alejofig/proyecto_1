package com.misog11.sportapp

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

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

        val backBtn = findViewById<ImageView>(R.id.ivBackArrow)
        backBtn.setOnClickListener{
            navigate(MainActivity::class.java)
        }
        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.navigation_home -> print("home")
                R.id.navigation_training -> navigate(DeporteActivity::class.java)
                R.id.navigation_events -> navigate(EventosActivity::class.java)
            }
            true
        }

    }

    private fun navigate(viewState:Class<*>){
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    // Función para abrir la actividad de entrenamiento
    private fun abrirEntrenamiento(deporte: String) {
        val intent = Intent(this, EntrenamientoActivity::class.java)
        intent.putExtra("DEPORTE", deporte) // Agrega el deporte como un extra
        startActivity(intent)
    }
}