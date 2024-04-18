package com.misog11.sportapp

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.misog11.sportapp.databinding.ActivityEntrenamientoBinding
import android.widget.ImageView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.misog11.sportapp.models.UserDTO
import com.misog11.sportapp.utils.BodyMetricsController
import com.misog11.sportapp.utils.Constants
import com.misog11.sportapp.utils.TimerController


class EntrenamientoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEntrenamientoBinding
    private val handler = Handler(Looper.getMainLooper())
    private var UserDTO: UserDTO = UserDTO(70.0, 28, Constants.generoFemenino, 169)

    var bodyMetricsController = BodyMetricsController(UserDTO);
    var timerController = TimerController()
    var fcmValue:Int=0;
    var fcmtotalCaloriesValue:Double=0.0;
    var totalCaloriesBurned:Double=0.0;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEntrenamientoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnIniciar.setOnClickListener {
            binding.tvActiveCalories.text = "0"
            binding.tvTotalCaloriesLabel.text = "0"
            binding.tvHeartRate.text = bodyMetricsController.updateFCM().toString()
            timerController.startTimer(handler, ::updateTimeView, ::updateCalories)
        }

        binding.btnFinish.setOnClickListener {
            timerController.pauseTimer()
            fcmValue=binding.tvHeartRate.text.toString().toInt()
            fcmtotalCaloriesValue=binding.tvActiveCalories.text.toString().toDouble()
            totalCaloriesBurned=binding.tvTotalCaloriesLabel.text.toString().toDouble()
            Log.d("{{LOG}} {{fcmValue}} {{fcmtotalCaloriesValue}} {{totalCaloriesBurned}}", "$fcmValue $fcmtotalCaloriesValue $totalCaloriesBurned")
        }

        val backBtn = findViewById<ImageView>(R.id.ivBackArrow)
        backBtn.setOnClickListener {
            navigate(DeporteActivity::class.java)
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

    private fun navigate(viewState: Class<*>) {
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    private fun updateCalories() {
        bodyMetricsController.updateCalories(intent.getStringExtra(Constants.keyDeporte).toString())
        // Actualizar el TextView de calorías activas
        binding.tvActiveCalories.text =
            String.format("%.2f", bodyMetricsController.getCaloriesBurned())
//        // Actualizar el TextView de calorías totales
        binding.tvTotalCaloriesLabel.text =
            String.format("%.2f", bodyMetricsController.getCalories())
    }

    private fun updateTimeView(textTime: String) {
        binding.tvTimer.text = textTime
    }

    override fun onDestroy() {
        super.onDestroy()
        timerController.pauseTimer() // Asegura que el temporizador se cancele al salir de la actividad
    }
}
