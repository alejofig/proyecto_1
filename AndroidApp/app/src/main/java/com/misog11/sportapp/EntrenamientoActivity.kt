package com.misog11.sportapp

import com.misog11.sportapp.models.Entrenamiento
import RestApiConsumer
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.misog11.sportapp.databinding.ActivityEntrenamientoBinding
import android.widget.ImageView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.misog11.sportapp.models.EntrenamientoInd
import com.misog11.sportapp.models.UserDTO
import com.misog11.sportapp.models.calcularIndicadoresResponseDto
import com.misog11.sportapp.utils.BodyMetricsController
import com.misog11.sportapp.utils.Constants
import com.misog11.sportapp.utils.TimerController
import kotlinx.coroutines.launch

class EntrenamientoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEntrenamientoBinding
    private val handler = Handler(Looper.getMainLooper())
    private val userDTO: UserDTO = UserDTO(0, 70.0, 28, Constants.generoFemenino, 169)
    private var entrenamientoDto: Entrenamiento = Entrenamiento()
    private var entrenamientoIndDto: EntrenamientoInd = EntrenamientoInd()
    private val apiConsumer = RestApiConsumer()
    private var bodyMetricsController = BodyMetricsController(userDTO);
    private var timerController = TimerController()
    private var isFirstClick: Boolean = true
    private var responsecalcularIndicadoresResponseDto: calcularIndicadoresResponseDto? = null
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEntrenamientoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnIniciar.setOnClickListener {
            if (isFirstClick) {
                timerController.cancelTimer()
                timerController.isPaused=false
                binding.btnIniciar.backgroundTintList =
                    resources.getColorStateList(R.color.yellow, null)
                binding.btnIniciar.text = getString(R.string.pausarTextBtn)
                binding.tvActiveCalories.text = "0"
                binding.tvTotalCaloriesLabel.text = "0"
                binding.tvTimer.text = getString(R.string.initTimer)
                bodyMetricsController.totalCalories = 0.0
                bodyMetricsController.totalCaloriesBurned = 0.0
                binding.tvHeartRate.text = bodyMetricsController.updateFCM().toString()
                if(intent.getStringExtra(Constants.keyDeporte).toString()=="ciclismo") binding.containerFTP.visibility = android.view.View.VISIBLE
                binding.containerVo2max.visibility = android.view.View.VISIBLE
                timerController.startTimer(handler, ::updateTimeView, ::updateCalories)
                updateHandler.post(updateRunnable)
                isFirstClick = false
            } else {
                if (timerController.isPaused) {
                    binding.btnIniciar.backgroundTintList =
                        resources.getColorStateList(R.color.yellow, null)
                    binding.btnIniciar.text = getString(R.string.pausarTextBtn)
                    timerController.startTimer(handler, ::updateTimeView, ::updateCalories)
                    updateHandler.post(updateRunnable)
                } else {
                    binding.btnIniciar.text = getString(R.string.reanudarTextBtn)
                    timerController.pauseTimer()
                    binding.btnIniciar.backgroundTintList =
                        resources.getColorStateList(R.color.green, null)
                    updateHandler.removeCallbacks(updateRunnable)
                }
            }
        }

        binding.btnFinish.setOnClickListener {
            timerController.cancelTimer()
            consumeIndicadoresApi()
            consumeEntrenamientoApi()
            updateHandler.removeCallbacks(updateRunnable)
            binding.btnIniciar.backgroundTintList = resources.getColorStateList(R.color.red, null)
            binding.btnIniciar.text = getString(R.string.iniciar)
            isFirstClick = !isFirstClick
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

    private val updateHandler = Handler(Looper.getMainLooper())
    private val updateRunnable = object : Runnable {
        @RequiresApi(Build.VERSION_CODES.O)
        override fun run() {
            consumeIndicadoresApi()
            updateHandler.postDelayed(this, 6000)
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun consumeIndicadoresApi() {
        entrenamientoIndDto.user_id = userDTO.id
        entrenamientoIndDto.sport_type = intent.getStringExtra(Constants.keyDeporte).toString()
        //convertToIntMinutes()
        entrenamientoIndDto.duration= binding.tvTimer.text.toString() // "hh:mm:ss"
        entrenamientoIndDto.fecha = java.time.LocalDate.now().toString()
        entrenamientoIndDto.calories_active = binding.tvActiveCalories.text.toString().toDouble()
        entrenamientoIndDto.total_calories = binding.tvTotalCaloriesLabel.text.toString().toDouble()
        entrenamientoIndDto.fcm = binding.tvHeartRate.text.toString().toInt()
        entrenamientoIndDto.height = userDTO.alturaUsuarioCm
        entrenamientoIndDto.genero = userDTO.generoUsuario
        entrenamientoIndDto.edad = userDTO.edadUsuario

        lifecycleScope.launch {
            val url =
                getString(R.string.indicadores_url_prd) + getString(R.string.indicadores_endpoint)
            try {
                responsecalcularIndicadoresResponseDto =
                    apiConsumer.consumeApi<EntrenamientoInd, calcularIndicadoresResponseDto>(
                        entrenamientoIndDto,
                        url
                    ).await()
                binding.tvValueFTP.text = responsecalcularIndicadoresResponseDto?.ftp.toString()
                binding.tvValueVo2.text = responsecalcularIndicadoresResponseDto?.vo2Max.toString()
            } catch (e: Exception) {
                showDialog("Error",e.message)
            }
        }
    }
    @RequiresApi(Build.VERSION_CODES.O)
    private fun consumeEntrenamientoApi() {
        entrenamientoDto.user_id = userDTO.id
        entrenamientoDto.sport_type = intent.getStringExtra(Constants.keyDeporte).toString()
        convertToIntMinutes() // "hh:mm:ss"
        entrenamientoDto.fecha = java.time.LocalDate.now().toString()
        entrenamientoDto.calories_active = binding.tvActiveCalories.text.toString().toDouble()
        entrenamientoDto.total_calories = binding.tvTotalCaloriesLabel.text.toString().toDouble()
        entrenamientoDto.fcm = binding.tvHeartRate.text.toString().toInt()
        lifecycleScope.launch {
            val url =
                getString(R.string.entrenamiento_url_prd) + getString(R.string.entrenamiento_endpoint)
            print(entrenamientoDto)
            try {
                 entrenamientoDto=
                     apiConsumer.consumeApi<Entrenamiento, Entrenamiento>(
                        entrenamientoDto,
                        url
                    ).await()
                showDialog("Entrenamiento","Entrenamiento completado"
                ) { navigate(DeporteActivity::class.java) }
            } catch (e: Exception) {
                showDialog("Error",e.message)
            }
        }
    }
    private fun navigate(viewState: Class<*>) {
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    private fun convertToIntMinutes(){
        val timeString = binding.tvTimer.text.toString() // "hh:mm:ss"
        val parts = timeString.split(":")

        if (parts.size == 3) {
            val hours = parts[0].toInt()
            val minutes = parts[1].toInt()
            val totalMinutes = hours * 60 + minutes

            entrenamientoDto.duration = totalMinutes
        } else {
            println("Error: El formato de tiempo no es válido")
        }
    }

    private fun updateCalories() {
        bodyMetricsController.updateCalories(intent.getStringExtra(Constants.keyDeporte).toString())
        // Actualizar el TextView de calorías activas
        binding.tvActiveCalories.text =
            String.format("%.2f", bodyMetricsController.getCaloriesBurned())
       // Actualizar el TextView de calorías totales
        binding.tvTotalCaloriesLabel.text =
            String.format("%.2f", bodyMetricsController.getCalories())
    }

    private fun updateTimeView(textTime: String) {
        binding.tvTimer.text = textTime
    }

    override fun onDestroy() {
        super.onDestroy()
        timerController.cancelTimer() // Asegura que el temporizador se cancele al salir de la actividad
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
