package com.misog11.sportapp.eventos

import com.misog11.sportapp.models.Evento
import java.text.SimpleDateFormat
import java.util.Locale

class EventosUtils {
    companion object {
        fun getDateFormat(evento: Evento): String {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val outputFormat = SimpleDateFormat("EEEE d 'de' MMMM 'de' yyyy", Locale("es", "ES"))
            val date = inputFormat.parse(evento.fecha)
            val fechaValue = date?.let { outputFormat.format(it) } + ", " + evento.hora
            return fechaValue
        }
    }
}