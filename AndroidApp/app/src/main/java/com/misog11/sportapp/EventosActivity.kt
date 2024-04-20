package com.misog11.sportapp


import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.applandeo.materialcalendarview.CalendarDay
import com.applandeo.materialcalendarview.CalendarView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.misog11.sportapp.eventos.EventosAdapter
import com.misog11.sportapp.eventos.EventosService
import com.misog11.sportapp.models.Entrenamiento
import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.models.Planes
import com.misog11.sportapp.utils.utils.Companion.navigate
import com.misog11.sportapp.utils.utils.Companion.obtenerToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.create
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Calendar
import java.util.Date
import java.util.Locale


class EventosActivity : AppCompatActivity() {
    private lateinit var retrofitEventos: Retrofit
    private lateinit var retrofitEntrenamiento: Retrofit
    private lateinit var eventosUrl:String
    private lateinit var planesUrl:String
    private lateinit var tokenAuth:String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_eventos)

        // Traer Token Autorizacion
        tokenAuth =  obtenerToken(this) ?: ""


        //Definir Url Base
        eventosUrl = getString(R.string.eventos_url)
        planesUrl = getString(R.string.planes_url)
        retrofitEventos = getRetrofit(eventosUrl)
        retrofitEntrenamiento = getRetrofit(planesUrl)


        // Navegacion Inferior
        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.navigation_home -> print("home")
                R.id.navigation_training -> navigate(this, DeporteActivity::class.java)
                R.id.navigation_events -> navigate(this, EventosActivity::class.java)
            }
            true
        }

        // Navegación a Principal
        val backBtn = findViewById<ImageView>(R.id.backBtn)
        backBtn.setOnClickListener{
            navigate(this, MainActivity::class.java)
        }

        // Lista de eventos
        initRecyclerEventos()

    }


    fun initRecyclerEventos(){
        CoroutineScope(Dispatchers.IO).launch {
            try {
                Log.i("Token Obtenino de Auth0", tokenAuth)
                val respuestaEventos = retrofitEventos.create(EventosService::class.java).getEventos("Bearer $tokenAuth")
                if (respuestaEventos.isSuccessful) {
                    val listaEventos = respuestaEventos.body()
                    val respuestaPlanes = retrofitEntrenamiento.create(EventosService::class.java).getPlanes("Bearer $tokenAuth")
                    if (respuestaPlanes.isSuccessful) {
                        val planes = respuestaPlanes.body()
                        if(planes != null && listaEventos != null){
                            val eventosGenerados = planes2Eventos(planes)
                            val eventosTotal = ordenarEventos(listaEventos + eventosGenerados)

                            runOnUiThread {
                                configurateCalendar(eventosTotal)
                                recyclerViewUpdateEventos(eventosTotal)
                            }
                        }
                    }

                    }


            } catch (e: Exception) {
                println("Se ha producido un error: ${e.message}")
            }
        }
    }

    private fun recyclerViewUpdateEventos(listaEvento: List<Evento>){
        val recyclerViewEventos = findViewById<RecyclerView>(R.id.recyclerEvents)
        recyclerViewEventos.layoutManager = LinearLayoutManager(this)
        recyclerViewEventos.adapter = EventosAdapter(listaEvento)
    }

    private fun configurateCalendar(eventosList: List<Evento>){
        val calendarView = findViewById<CalendarView>(R.id.calendarViewItem)
        val calendarDays: MutableList<CalendarDay> = ArrayList()

        eventosList.forEach{ elemento -> calendarDays.add(agregarCalendario(elemento))}
        calendarView.setCalendarDays(calendarDays)
    }

    private fun agregarCalendario(evento: Evento):CalendarDay{
        //Eventos Calendario
        val fechaStr = evento.fecha
        val formato = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

        // Parsear la cadena de fecha en un objeto Date
        val fecha = formato.parse(fechaStr)

        // Crear una instancia de Calendar y establecer su tiempo con el objeto Date
        val calendar: Calendar = Calendar.getInstance()
        if (fecha != null) {
            calendar.time = fecha
        }

        val calendarDay = CalendarDay(calendar)
        calendarDay.labelColor = R.color.yellow
        calendarDay.imageResource = R.drawable.baseline_run_circle_24
        return calendarDay
        //calendarDays.add(calendarDay)


        //calendarView.setCalendarDays(calendarDays)
    }

    private fun getRetrofit(baseUrl:String):Retrofit{
        return Retrofit
               .Builder()
               .baseUrl(baseUrl)
               .addConverterFactory(GsonConverterFactory.create())
               .build()
    }

    private fun planes2Eventos(planes:List<Planes>):List<Evento>{

        val entrenamientosEvent = mutableListOf<Evento>()

        planes.forEach { plan ->
            val maxLength = 14*99 + 12
            val fechasString = plan.fechas
            val processedFechas = if (fechasString.length > maxLength) fechasString.substring(0, maxLength) else fechasString
            val dateParts = processedFechas.replace("'", "").split(", ")
            val formattedDates = dateParts.map { date -> date.replace("/", "-") }

            formattedDates.forEach { date ->
                val evento = Evento(date, "",
                    "Ent: ${plan.deporte}, ${plan.nombre}  ",
                      "Ubicacion Deseada",
                    "")
                entrenamientosEvent.add(evento)
            }
        }


        return entrenamientosEvent
    }

    private fun ordenarEventos(eventos: List<Evento>): List<Evento> {
        val dateFormatter = SimpleDateFormat("yyyy-MM-dd")
        //val hoy = Date()
        val hoy = Calendar.getInstance()  // Obtiene la instancia actual del calendario
        hoy.add(Calendar.DATE, -1)
        val fechaAyer = hoy.time

        val eventosfiltrados = eventos.filter {
            dateFormatter.parse(it.fecha).after(fechaAyer)  // Verifica si no es antes de hoy (es hoy o después)
        }
        return eventosfiltrados.sortedBy { dateFormatter.parse(it.fecha) }
    }
}
