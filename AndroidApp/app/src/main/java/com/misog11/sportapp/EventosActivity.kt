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
import com.misog11.sportapp.models.Evento
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale


class EventosActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_eventos)


        // Navegación a Principal
        val backBtn = findViewById<ImageView>(R.id.backBtn)
        backBtn.setOnClickListener{
            navigate(MainActivity::class.java)
        }

        // Lista de eventos
        initRecyclerEventos()

        // Configurar Calendario
        configurateCalendar(EventosProvider.EventosList)

    }

    private fun navigate(viewState:Class<*>){
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

    private fun initRecyclerEventos(){
        val recyclerViewEventos = findViewById<RecyclerView>(R.id.recyclerEvents)
        recyclerViewEventos.layoutManager = LinearLayoutManager(this)
        recyclerViewEventos.adapter = EventosAdapter(EventosProvider.EventosList)

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
}
