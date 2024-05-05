package com.misog11.sportapp

import RestApiConsumer
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.misog11.sportapp.models.RutinaAlimentacion
import com.misog11.sportapp.utils.utils
import kotlinx.coroutines.launch

class RutinaAlimActivity : AppCompatActivity() {

    @RequiresApi(Build.VERSION_CODES.O)
    private var rutinaAlimentacionDto: RutinaAlimentacion = RutinaAlimentacion()
    private val apiConsumer = RestApiConsumer()
    private lateinit var tokenAuth: String

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_rutina_alim)
        tokenAuth = utils.obtenerToken(this) ?: ""
        consumeDataApi()

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

    @RequiresApi(Build.VERSION_CODES.O)
    private fun consumeDataApi() {
        lifecycleScope.launch {
            val url =
                getString(R.string.indicadores_url_prd) + getString(R.string.get_rutina_alimentacion_movil)
            try {
                rutinaAlimentacionDto =
                    apiConsumer.consumeApiPost<String, RutinaAlimentacion>(
                        "",
                        url,
                        tokenAuth
                    ).await()

            } catch (e: Exception) {
                showDialog("Error", e.message)
            }
            val tvCarbosLabel = findViewById<TextView>(R.id.tvCarbosLabel)
            val tvProtesLabel = findViewById<TextView>(R.id.tvProtesLabel)
            val tvgrasLabel = findViewById<TextView>(R.id.tvgrasLabel)
            tvCarbosLabel.text = rutinaAlimentacionDto.carboidratos.toString()
            tvProtesLabel.text = rutinaAlimentacionDto.proteinas.toString()
            tvgrasLabel.text = rutinaAlimentacionDto.grasas.toString()
        }
    }

    private fun navigate(viewState: Class<*>) {
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    private fun showDialog(title: String?, message: String?, func: (() -> Unit)? = null) {
        AlertDialog.Builder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
                func?.invoke()
            }
            .show()
    }
}