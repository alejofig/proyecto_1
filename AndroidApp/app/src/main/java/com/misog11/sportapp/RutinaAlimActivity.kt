package com.misog11.sportapp

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class RutinaAlimActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_rutina_alim)


        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.navigation_home -> print("home")
                R.id.navigation_training -> navigate(DeporteActivity::class.java)
                R.id.navigation_events -> navigate(EventosActivity::class.java)
            }
            true
        }

        val backBtn = findViewById<ImageView>(R.id.ivBackArrow)
        backBtn.setOnClickListener {
            navigate(RutinasActivity::class.java)
        }




    }

    private fun navigate(viewState: Class<*>) {
        val intent = Intent(this, viewState)
        startActivity(intent)
    }
}