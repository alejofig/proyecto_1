package com.misog11.sportapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class RutinasActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_rutinas)


        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.navigation_home -> print("home")
                R.id.navigation_training -> navigate(DeporteActivity::class.java)
                R.id.navigation_events -> navigate(EventosActivity::class.java)
            }
            true
        }

        // Botón para la rutina de alimentación
        val btnRutAlim = findViewById<Button>(R.id.btnRutAlim)
        btnRutAlim.setOnClickListener {
            navigate(RutinaAlimActivity::class.java)
        }

        // Botón para la rutina de descanso
        val btnRutDes = findViewById<Button>(R.id.btnRutDes)
        btnRutDes.setOnClickListener {
            navigate(RutinaDescActivity::class.java)
        }


    }

    private fun navigate(viewState: Class<*>) {
        val intent = Intent(this, viewState)
        startActivity(intent)
    }
}