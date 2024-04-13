package com.misog11.sportapp


import android.content.Intent
import android.os.Bundle
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
import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.utils.utils.Companion.navigate
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale


class EventosActivity : AppCompatActivity() {
    private lateinit var retrofit: Retrofit

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_eventos)
        retrofit = getRetrofit()

        // Navegacion Inferior
        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.navigation_home -> print("home")
                R.id.navigation_training -> navigate(this, EntrenamientoActivity::class.java)
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

   // private fun navigate(viewState:Class<*>){
   //val intent = Intent(this, viewState)
   //     startActivity(intent)
    //     /     }

    fun initRecyclerEventos(){
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val respuesta = retrofit.create(EventosService::class.java).getEventos()
                if (respuesta.isSuccessful) {
                    val listaEventos = respuesta.body()
                    runOnUiThread {
                        // Configurar Calendario
                        if (listaEventos != null) {
                            configurateCalendar(listaEventos)
                            recyclerViewUpdateEventos(listaEventos)
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

    private fun getRetrofit():Retrofit{
        return Retrofit
               .Builder()
               .baseUrl("http://52.91.57.227:3001/")
               .addConverterFactory(GsonConverterFactory.create())
               .build()
    }
}
