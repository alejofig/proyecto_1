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
import com.misog11.sportapp.adapter.EventosAdapter
import com.misog11.sportapp.adapter.EventosService
import com.misog11.sportapp.models.Evento
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

        // Navegación a Principal
        val backBtn = findViewById<ImageView>(R.id.backBtn)
        backBtn.setOnClickListener{
            navigate(MainActivity::class.java)
        }

        // Lista de eventos
        initRecyclerEventos()

    }

    private fun navigate(viewState:Class<*>){
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    private fun initRecyclerEventos(){
        CoroutineScope(Dispatchers.IO).launch {
            val respuesta = retrofit.create(EventosService::class.java).getEventos()
            if(respuesta.isSuccessful){
                val listaEventos = respuesta.body()
                runOnUiThread {
                    // Configurar Calendario
                    if (listaEventos != null) {
                        configurateCalendar(listaEventos)
                        RecyclerViewUpdateEventos(listaEventos)
                    }
                }
            }
        }
    }

    private fun RecyclerViewUpdateEventos(listaEvento: List<Evento>){
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
