package com.misog11.sportapp

import RestApiConsumer
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.misog11.sportapp.databinding.ActivityEntrenamientoBinding
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.misog11.sportapp.eventos.EventosAdapter
import com.misog11.sportapp.eventos.EventosService
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.misog11.sportapp.Entrenamiento.EntrenamientoService
import com.misog11.sportapp.eventos.NotificacionesAdapter
import com.misog11.sportapp.models.Entrenamiento
import com.misog11.sportapp.models.EntrenamientoInd
import com.misog11.sportapp.models.Indicadores
import com.misog11.sportapp.models.Notificacion
import com.misog11.sportapp.models.UserDTO
import com.misog11.sportapp.models.calcularIndicadoresResponseDto
import com.misog11.sportapp.utils.BodyMetricsController
import com.misog11.sportapp.utils.Constants
import com.misog11.sportapp.utils.TimerController
import com.misog11.sportapp.utils.utils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONArray
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import kotlin.math.abs
import kotlin.system.measureTimeMillis
import kotlin.random.Random

class EntrenamientoActivity : AppCompatActivity() {

    private lateinit var retrofitApi: Retrofit
    private lateinit var apigatewayUrl:String

    private lateinit var binding: ActivityEntrenamientoBinding
    private val handler = Handler(Looper.getMainLooper())
    private var estadoMedidaReculo = "primeraVez"
    private  var ftpInicial: Float = 0.0f
    private  var Vo2MaxInicial: Float = 0.0f

    @RequiresApi(Build.VERSION_CODES.O)
    private var userDTO: UserDTO = UserDTO()
    private var entrenamientoDto: Entrenamiento = Entrenamiento()
    private var entrenamientoIndDto: EntrenamientoInd = EntrenamientoInd()
    private val apiConsumer = RestApiConsumer()

    @RequiresApi(Build.VERSION_CODES.O)
    private var bodyMetricsController = BodyMetricsController();
    private var timerController = TimerController()
    private var isFirstClick: Boolean = true
    private var responsecalcularIndicadoresResponseDto: calcularIndicadoresResponseDto? = null
    private lateinit var tokenAuth: String

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Configurar RetroFit
        apigatewayUrl = getString(R.string.base_api_url)
        retrofitApi = getRetrofit(apigatewayUrl)


        // Traer Token Autorizacion
        tokenAuth = utils.obtenerToken(this) ?: ""
        consumeDatosUsuario()
        binding = ActivityEntrenamientoBinding.inflate(layoutInflater)
        setContentView(binding.root)
        checkAndSendPendingTrainings()

        // Ocultar todos los campos de indicadores hasta que no inicie actividad
        binding.containerVo2max.visibility = LinearLayout.GONE
        binding.containerTemperatura.visibility = LinearLayout.GONE
        binding.containerCadencia.visibility = LinearLayout.GONE
        binding.containerPotencia.visibility = LinearLayout.GONE
        binding.containerFTP.visibility = LinearLayout.GONE
        binding.containerVelocidad.visibility = LinearLayout.GONE
        binding.containerTiempoContactoSuelo.visibility = LinearLayout.GONE
        binding.containerLongitudZancada.visibility = LinearLayout.GONE
        binding.containerAscensoTotal.visibility = LinearLayout.GONE
        binding.containerDescensoTotal.visibility = LinearLayout.GONE

        binding.btnIniciar.setOnClickListener {
            if (isFirstClick) {
                timerController.cancelTimer()
                timerController.isPaused = false
                binding.btnIniciar.backgroundTintList =
                    resources.getColorStateList(R.color.yellow, null)
                binding.btnIniciar.text = getString(R.string.pausarTextBtn)
                binding.tvActiveCalories.text = "0"
                binding.tvTotalCaloriesLabel.text = "0"
                binding.tvTimer.text = getString(R.string.initTimer)
                bodyMetricsController.totalCalories = 0.0
                bodyMetricsController.totalCaloriesBurned = 0.0
                binding.tvHeartRate.text = bodyMetricsController.updateFCM(userDTO).toString()

                if (intent.getStringExtra(Constants.keyDeporte).toString() == "Ride") { //Ride es ciclismo
                    consumeIndicadoresActivosCiclismoApi()
                } else if (intent.getStringExtra(Constants.keyDeporte).toString() == "Run") {
                    consumeIndicadoresActivosAtletismoApi()
                }

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
            if (duracionMayor1min() && (estadoMedidaReculo == "midiendo" || estadoMedidaReculo == "primeraVez")) {
                timerController.cancelTimer()
                consumeIndicadoresApi()
                consumeEntrenamientoApi()
                updateHandler.removeCallbacks(updateRunnable)
                binding.btnIniciar.backgroundTintList = resources.getColorStateList(R.color.red, null)
                binding.btnIniciar.text = getString(R.string.iniciar)
                isFirstClick = !isFirstClick
            }
            else{
                mostrarMensajeMotivacionla()
                estadoMedidaReculo = "Alerta"

            }


        }

        binding.ivBell.setOnClickListener{
            mostrarNotificacines()
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
        entrenamientoIndDto.duration = binding.tvTimer.text.toString() // "hh:mm:ss"
        entrenamientoIndDto.fcm = binding.tvHeartRate.text.toString().toInt()
        entrenamientoIndDto.height = userDTO.altura
        entrenamientoIndDto.edad = userDTO.edad
        entrenamientoIndDto.genero = userDTO.genero
        Log.i("time", entrenamientoIndDto.duration!!)
        Log.i("fcm", entrenamientoIndDto.fcm!!.toString())
        Log.i("height", entrenamientoIndDto.height!!.toString())
        Log.i("edad", entrenamientoIndDto.edad!!.toString())
        Log.i("genero", entrenamientoIndDto.genero!!)
        lifecycleScope.launch {
            val url =
                getString(R.string.indicadores_url_prd) + getString(R.string.indicadores_endpoint)
            try {
                responsecalcularIndicadoresResponseDto =
                    apiConsumer.consumeApiPost<EntrenamientoInd, calcularIndicadoresResponseDto>(
                        entrenamientoIndDto,
                        url,
                        tokenAuth
                    ).await()
                val ftp = responsecalcularIndicadoresResponseDto?.ftp.toString()
                binding.tvValueFTP.text = ftp
                val vo2Max = responsecalcularIndicadoresResponseDto?.vo2Max.toString()
                binding.tvValueVo2.text = vo2Max
                val temperatura = responsecalcularIndicadoresResponseDto?.temperatura.toString()
                binding.tvValueTemperatura.text = temperatura
                val cadencia = responsecalcularIndicadoresResponseDto?.cadencia.toString()
                binding.tvValueCadencia.text = cadencia
                val potencia = responsecalcularIndicadoresResponseDto?.potencia.toString()
                binding.tvValuePotencia.text = potencia
                val velocidad = responsecalcularIndicadoresResponseDto?.velocidad.toString()
                binding.tvValueVelocidad.text = velocidad
                val tiempoContactoSuelo = responsecalcularIndicadoresResponseDto?.tiempoContactoSuelo.toString()
                binding.tvValueTiempoContactoSuelo.text = tiempoContactoSuelo
                val longitudZancada = responsecalcularIndicadoresResponseDto?.longitudZancada.toString()
                binding.tvValueLongitudZancada.text = longitudZancada
                val ascensoTotal = responsecalcularIndicadoresResponseDto?.ascensoTotal.toString()
                binding.tvValueAscensoTotal.text = ascensoTotal
                val descensoTotal = responsecalcularIndicadoresResponseDto?.descensoTotal.toString()
                binding.tvValueDescensoTotal.text = descensoTotal
                recalculoObjetivos(ftp, vo2Max)
                val tiempoEjecucion = measureTimeMillis{
                    recalculoObjetivos(ftp, vo2Max)
                }
                Log.i("Tiempo Ejecucion Recalculo de Objetivos","$tiempoEjecucion")

            } catch (e: Exception) {
                showDialog("Error", e.message)
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun consumeIndicadoresActivosAtletismoApi() {
        lifecycleScope.launch {
            try {
                Log.i("Token indicadores: ", tokenAuth)
                val respuestaAtletismo = retrofitApi.create(EntrenamientoService::class.java).getIndicadoresAtletismo("Bearer $tokenAuth")
                respuestaAtletismo.body()?.let { evaluarVisibilidad(it) }
                /*if (respuestaAtletismo.isSuccessful) {
                    Log.i("Exito trayecto Atletismo", "Exito")
                    val listaAtletismo = respuestaAtletismo.body()
                    if (listaAtletismo != null) {
                        if (listaAtletismo.isNotEmpty()) {
                            evaluarVisibilidad(listaAtletismo)
                        }
                    }
                }*/
            } catch (e: Exception) {
                println("Se ha producido un error en atletismo: ${e.message}")
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun consumeIndicadoresActivosCiclismoApi() {
        lifecycleScope.launch {
            try {
                Log.i("Token indicadores: ", tokenAuth)
                val respuestaCiclismo = retrofitApi.create(EntrenamientoService::class.java).getIndicadoresCiclismo("Bearer $tokenAuth")
                respuestaCiclismo.body()?.let { evaluarVisibilidad(it) }
                /*if (respuestaCiclismo.isSuccessful) {
                    Log.i("Exito trayecto Atletismo", "Exito")
                    val listaCiclismo = respuestaCiclismo.body()
                    if (listaCiclismo != null) {
                        if (listaCiclismo.isNotEmpty()) {
                            evaluarVisibilidad(listaCiclismo)
                        }
                    }
                }*/
            } catch (e: Exception) {
                println("Se ha producido un error en ciclismo: ${e.message}")
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun evaluarVisibilidad(listaDeporte: List<Indicadores>) {

        try {
            Log.i("Entra a Visibilidad", "Visualizacion")
            if(listaDeporte.isEmpty()){
                binding.containerFTP.visibility = android.view.View.VISIBLE
                binding.containerVo2max.visibility = android.view.View.VISIBLE
                binding.containerCadencia.visibility = android.view.View.VISIBLE
                binding.containerPotencia.visibility = android.view.View.VISIBLE
                binding.containerTiempoContactoSuelo.visibility =
                    android.view.View.VISIBLE
                binding.containerLongitudZancada.visibility = android.view.View.VISIBLE
                binding.containerTemperatura.visibility = android.view.View.VISIBLE
                binding.containerVelocidad.visibility = android.view.View.VISIBLE
                binding.containerAscensoTotal.visibility = android.view.View.VISIBLE
                binding.containerDescensoTotal.visibility = android.view.View.VISIBLE
            }
            else {
                for (valoresLista in listaDeporte) {
                    val nombreIndicador = valoresLista.nombreIndicador
                    val visible = valoresLista.visible

                    if (nombreIndicador == "FTP") {
                        if (visible) {
                            binding.containerFTP.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerFTP.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "VO2Max") {
                        if (visible) {
                            binding.containerVo2max.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerVo2max.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "Cadencia") {
                        if (visible) {
                            binding.containerCadencia.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerCadencia.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "Potencia") {
                        if (visible) {
                            binding.containerPotencia.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerPotencia.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "TiempoContactoSuelo") {
                        if (visible) {
                            binding.containerTiempoContactoSuelo.visibility =
                                android.view.View.VISIBLE
                        } else {
                            binding.containerTiempoContactoSuelo.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "LongitudZancada") {
                        if (visible) {
                            binding.containerLongitudZancada.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerLongitudZancada.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "Temperatura") {
                        if (visible) {
                            binding.containerTemperatura.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerTemperatura.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "Velocidad") {
                        if (visible) {
                            binding.containerVelocidad.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerVelocidad.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "AscensoTotal") {
                        if (visible) {
                            binding.containerAscensoTotal.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerDescensoTotal.visibility = LinearLayout.GONE
                        }
                    }

                    if (nombreIndicador == "DescensoTotal") {
                        if (visible) {
                            binding.containerDescensoTotal.visibility = android.view.View.VISIBLE
                        } else {
                            binding.containerDescensoTotal.visibility = LinearLayout.GONE
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.i("Error en evaluar visibilidad", "${e.message}")
            println("Error en evaluar visibilidad: ${e.message}")
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun consumeEntrenamientoApi() {
        val isConnected = isConnectedToNetwork()
        entrenamientoDto.user_id = userDTO.id
        entrenamientoDto.sport_type = intent.getStringExtra(Constants.keyDeporte).toString()
        entrenamientoDto.duration = convertToIntMinutes() // "hh:mm:ss"
        entrenamientoDto.fecha = java.time.LocalDateTime.now().toString()
        entrenamientoDto.calories_active = binding.tvActiveCalories.text.toString().toDouble()
        entrenamientoDto.total_calories = binding.tvTotalCaloriesLabel.text.toString().toDouble()
        entrenamientoDto.fcm = binding.tvHeartRate.text.toString().toInt()
        if (isConnected) {
            lifecycleScope.launch {
                val url =
                    // getString(R.string.entrenamiento_url_prd) + getString(R.string.entrenamiento_endpoint)
                    getString(R.string.indicadores_url_prd) + getString(R.string.crear_entrenamiento_endpoint)
                try {
                    entrenamientoDto =
                        apiConsumer.consumeApiPost<Entrenamiento, Entrenamiento>(
                            entrenamientoDto,
                            url,
                            tokenAuth
                        ).await()
                    val message = if (userDTO.strava) {
                        "Entrenamiento completado con sincronización a Strava"
                    } else {
                        "Entrenamiento completado"
                    }
                    showDialog("Entrenamiento", message) { navigate(RutinasActivity::class.java) }
                } catch (e: Exception) {
                    showDialog("Error", e.message)
                }
            }
        } else {
            storeEntrenamientoData(entrenamientoDto)
            showDialog("Sin conexión", "El entrenamiento se guardará localmente y se" +
                    " enviará automáticamente cuando haya conexión.")
            { navigate(RutinasActivity::class.java) }
        }
    }


    private fun navigate(viewState: Class<*>) {
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    private fun convertToIntMinutes(): Int {
        val timeString = binding.tvTimer.text.toString() // "hh:mm:ss"
        val parts = timeString.split(":")
        var totalMinutes = 0
        if (parts.size == 3) {
            val hours = parts[0].toInt()
            val minutes = parts[1].toInt()
            totalMinutes = hours * 60 + minutes

        } else {
            println("Error: El formato de tiempo no es válido")
        }
        return totalMinutes
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun updateCalories() {
        bodyMetricsController.updateCalories(intent.getStringExtra(Constants.keyDeporte).toString(),userDTO)
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

    @RequiresApi(Build.VERSION_CODES.O)
    private fun consumeDatosUsuario() {
        lifecycleScope.launch {
            val url =
                getString(R.string.indicadores_url_prd) + getString(R.string.users_endpoint)
            try {
                userDTO =
                    apiConsumer.consumeApiGet<UserDTO>(
                        url,
                        tokenAuth
                    ).await()
            } catch (e: Exception) {
                showDialog("Error", e.message)
            }
        }
    }

    private fun mostrarNotificacines() {
        val builder = AlertDialog.Builder(this@EntrenamientoActivity)
        val view = layoutInflater.inflate(R.layout.notificaciones_entrenamiento, null)

        builder.setView(view)

        val dialog = builder.create()
        dialog.show()

        val tvActiveCalories = binding.tvActiveCalories
        val activeCalories = tvActiveCalories.text.toString().toDoubleOrNull() ?: 0.0
        val listaNotificaciones: MutableList<Notificacion> = mutableListOf()

        CoroutineScope(Dispatchers.IO).launch {
            try {
                Log.i("Token Obtenino de Auth0", tokenAuth)
                val respuestaNotificaion = retrofitApi.create(EventosService::class.java)
                    .getNotificaciones("Bearer $tokenAuth")
                if (respuestaNotificaion.isSuccessful) {
                    Log.i("Exito trayendo Notificaciones", "ss")
                    val listaNotificacionesApi: List<Notificacion> = respuestaNotificaion.body() ?: listOf()

                    runOnUiThread {
                        if (listaNotificacionesApi.isEmpty()) {
                            listaNotificaciones.add(Notificacion("No hay notificaciones ni avisos"))
                        } else {
                            listaNotificaciones.addAll(listaNotificacionesApi)
                        }

                        // Agregar notificaciones de ingesta de líquido y comida
                        for (i in 1..(activeCalories / 0.1).toInt()) {
                            listaNotificaciones.add(Notificacion("Recordatorio de ingesta de líquido"))
                        }
                        for (i in 1..(activeCalories / 0.5).toInt()) {
                            listaNotificaciones.add(Notificacion("Recordatorio de ingesta de comida"))
                        }

                        val reciclerNotification = view.findViewById<RecyclerView>(R.id.recyclerNotificaciones)
                        reciclerNotification.layoutManager = LinearLayoutManager(this@EntrenamientoActivity)
                        reciclerNotification.adapter = NotificacionesAdapter(listaNotificaciones)
                    }
                }
            } catch (e: Exception) {
                println("Se ha producido un error: ${e.message}")
            }
        }
    }

    private fun isConnectedToNetwork(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val networkInfo = connectivityManager.activeNetworkInfo
        return networkInfo != null && networkInfo.isConnected
    }
    private fun storeEntrenamientoData(entrenamientoDto: Entrenamiento) {
        val sharedPreferences = getSharedPreferences("entrenamiento_data", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()


        val gson = Gson()
        val entrenamientosJson = sharedPreferences.getString("entrenamientos", null)
        val entrenamientos: MutableList<Entrenamiento> = if (entrenamientosJson != null) {
            gson.fromJson(entrenamientosJson, object : TypeToken<MutableList<Entrenamiento>>() {}.type)
        } else {
            mutableListOf()
        }

        entrenamientos.add(entrenamientoDto)
        val nuevaListaJson = gson.toJson(entrenamientos)

        editor.putString("entrenamientos", nuevaListaJson)
        editor.apply()
    }

    private fun getStoredEntrenamientoData(): List<Entrenamiento>? {
        val sharedPreferences = getSharedPreferences("entrenamiento_data", Context.MODE_PRIVATE)
        val json = sharedPreferences.getString("entrenamientos", null)
        return if (json != null) {
            val gson = Gson()
            gson.fromJson(json, object : TypeToken<List<Entrenamiento>>() {}.type)
        } else {
            null
        }
    }


    private fun checkAndSendPendingTrainings() {
        val pendingTrainings = getStoredEntrenamientoData()
        if (pendingTrainings != null && isConnectedToNetwork()) {
            sendTrainings(pendingTrainings)
        }
    }

    private fun sendTrainings(trainings: List<Entrenamiento>?) {

        if (trainings != null) {
            for (entrenamiento in trainings) {
                lifecycleScope.launch {
                    val url = getString(R.string.indicadores_url_prd) + getString(R.string.crear_entrenamiento_endpoint)
                    try {
                        apiConsumer.consumeApiPost<Entrenamiento, Any>(
                            entrenamiento,
                            url,
                            tokenAuth
                        ).await()
                        // Actualizar la interfaz o mostrar un mensaje al usuario
                        showDialog("Éxito", "Entrenamiento pendiente enviado correctamente.")
                        // Remover el entrenamiento enviado de la lista almacenada localmente
                        removeStoredTraining(entrenamiento)
                    } catch (e: Exception) {
                        showDialog("Error al enviar", "No se pudo enviar el entrenamiento: ${e.message}")
                    }
                }
            }
        }
    }
    private fun removeStoredTraining(entrenamiento: Entrenamiento) {
        val sharedPreferences = getSharedPreferences("entrenamiento_data", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        val gson = Gson()
        val entrenamientosJson = sharedPreferences.getString("entrenamientos", null)
        val entrenamientos: MutableList<Entrenamiento> = if (entrenamientosJson != null) {
            gson.fromJson(entrenamientosJson, object : TypeToken<MutableList<Entrenamiento>>() {}.type)
        } else {
            mutableListOf()
        }
        entrenamientos.remove(entrenamiento)
        val nuevaListaJson = gson.toJson(entrenamientos)
        editor.putString("entrenamientos", nuevaListaJson)
        editor.apply()
    }


    private fun timeStringToSeconds(time: String): Int {
        val parts = time.split(":")
        if (parts.size != 3) {
            throw IllegalArgumentException("The time format should be HH:mm:ss")
        }
        val hours = parts[0].toInt()
        val minutes = parts[1].toInt()
        val seconds = parts[2].toInt()
        return hours * 3600 + minutes * 60 + seconds
    }

    private fun duracionMayor1min(): Boolean{
        val duration = binding.tvTimer.text.toString()
        val totalSeconds = timeStringToSeconds(duration)
        Log.i("Total seconds:", "$totalSeconds")

        return totalSeconds>60

    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun mostrarMensajeMotivacionla(){
        binding.btnIniciar.text = getString(R.string.reanudarTextBtn)
        timerController.pauseTimer()
        binding.btnIniciar.backgroundTintList =
            resources.getColorStateList(R.color.green, null)
        updateHandler.removeCallbacks(updateRunnable)
        val builder = AlertDialog.Builder(this@EntrenamientoActivity)
        val view = layoutInflater.inflate(R.layout.mensaje_motivacional, null)

        builder.setView(view)

        val mensaje = utils.obtener_frase_motivacional()

        val dialog = builder.create()
        dialog.show()

        val textViewMensaje = view.findViewById<TextView>(R.id.mensajeMotivacional)
        textViewMensaje.text = mensaje

        val botonConti = view.findViewById<Button>(R.id.btnContMoti)
        botonConti.setOnClickListener {
            dialog.dismiss()  // Cierra el diálogo
            estadoMedidaReculo = "midiendo"
        }

        val botonFin = view.findViewById<Button>(R.id.btnFinMoti)
        botonFin.setOnClickListener {
            dialog.dismiss()  // Cierra el diálogo
            timerController.cancelTimer()
            consumeIndicadoresApi()
            consumeEntrenamientoApi()
            updateHandler.removeCallbacks(updateRunnable)
            binding.btnIniciar.backgroundTintList = resources.getColorStateList(R.color.red, null)
            binding.btnIniciar.text = getString(R.string.iniciar)
            isFirstClick = !isFirstClick
            estadoMedidaReculo = "midiendo"

        }


    }
    private fun getRetrofit(baseUrl:String):Retrofit{
        return Retrofit
            .Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun mostrarAvisoRecalculo(indicador: String){
        binding.btnIniciar.text = getString(R.string.reanudarTextBtn)
        timerController.pauseTimer()
        binding.btnIniciar.backgroundTintList =
            resources.getColorStateList(R.color.green, null)
        updateHandler.removeCallbacks(updateRunnable)

        val builder = AlertDialog.Builder(this@EntrenamientoActivity)
        val view = layoutInflater.inflate(R.layout.mensaje_motivacional, null)

        builder.setView(view)

        val mensaje = "¡Atención! Hemos detectado que tu indicador de $indicador está fuera de los rangos normales para la actividad que estás realizando."

        val dialog = builder.create()
        dialog.show()

        val textViewMensaje = view.findViewById<TextView>(R.id.mensajeMotivacional)
        textViewMensaje.text = mensaje

        val botonConti = view.findViewById<Button>(R.id.btnContMoti)
        botonConti.setOnClickListener {
            dialog.dismiss()  // Cierra el diálogo
            estadoMedidaReculo =  "midiendo"
        }

        val botonFin = view.findViewById<Button>(R.id.btnFinMoti)
        botonFin.setOnClickListener {
            dialog.dismiss()  // Cierra el diálogo
            timerController.cancelTimer()
            consumeIndicadoresApi()
            consumeEntrenamientoApi()
            updateHandler.removeCallbacks(updateRunnable)
            binding.btnIniciar.backgroundTintList = resources.getColorStateList(R.color.red, null)
            binding.btnIniciar.text = getString(R.string.iniciar)
            isFirstClick = !isFirstClick
            estadoMedidaReculo =  "midiendo"

        }
    }
    @RequiresApi(Build.VERSION_CODES.O)
    private fun recalculoObjetivos(ftp:String, vo2Max: String){
        val maxFtp = 45
        val maxDeltaFpt = 7 // 7

        val minVo2max = 90
        val maxDeltaVo2max = 1.5

        if (estadoMedidaReculo == "primeraVez"){
            ftpInicial = ftp.toFloat()
            Vo2MaxInicial = vo2Max.toFloat()
            estadoMedidaReculo = "midiendo"
        }
        else if(estadoMedidaReculo == "midiendo"){
            val ftp_recibido = ftp.toFloat()
            val vo2Max_recibido = vo2Max.toFloat()
            val delta_ftp = abs(ftpInicial - ftp_recibido)
            val delta_vo2Max = abs(Vo2MaxInicial - vo2Max_recibido )

            Log.i("Ftp Inicial", "$ftpInicial" )
            Log.i("Vo2 Inicial", "$Vo2MaxInicial" )
            Log.i("Ftp", "$ftp_recibido" )
            Log.i("Vo2", "$vo2Max_recibido" )
            Log.i("delta_ftp", "$delta_ftp" )
            Log.i("delta_vo2Max", "$delta_vo2Max" )

            ftpInicial = ftp_recibido
            Vo2MaxInicial = vo2Max_recibido

            if ((delta_ftp> maxDeltaFpt  || ftp_recibido > maxFtp) && estadoMedidaReculo == "midiendo"){
                estadoMedidaReculo = "Alerta"
                mostrarAvisoRecalculo("FTP")

            }
            else if ((delta_vo2Max > maxDeltaVo2max ||  vo2Max_recibido < minVo2max) && estadoMedidaReculo == "midiendo"){
                estadoMedidaReculo = "Alerta"
                mostrarAvisoRecalculo("VO2MaX")

            }

        }


    }
}

