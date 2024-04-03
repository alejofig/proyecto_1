package com.misog11.sportapp


import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.applandeo.materialcalendarview.CalendarDay
import com.applandeo.materialcalendarview.CalendarView
import java.util.Calendar


class EventosActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_eventos)

        val backBtn = findViewById<ImageView>(R.id.backBtn)

        backBtn.setOnClickListener{
            navigate(MainActivity::class.java)
        }

        //Eventos Calendario
        val calendarDays: MutableList<CalendarDay> = ArrayList()
        val calendarView = findViewById<CalendarView>(R.id.calendarViewItem)

        val calendar:Calendar = Calendar.getInstance()

        calendar.set(2024, Calendar.APRIL, 10)

        val calendarDay = CalendarDay(calendar)
        calendarDay.labelColor = R.color.yellow
        calendarDay.imageResource = R.drawable.baseline_run_circle_24
        calendarDays.add(calendarDay)


        calendarView.setCalendarDays(calendarDays)
    }

    private fun navigate(viewState:Class<*>){
        val intent = Intent(this, viewState)
        startActivity(intent)
    }
}
