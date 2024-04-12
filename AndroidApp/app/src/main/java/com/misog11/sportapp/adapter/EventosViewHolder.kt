package com.misog11.sportapp.adapter

import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView.ViewHolder
import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.R
import java.text.SimpleDateFormat
import java.util.Locale

class EventosViewHolder(view:View): ViewHolder(view) {

    val fecha = view.findViewById<TextView>(R.id.fechaTV)
    val nombre = view.findViewById<TextView>(R.id.nombreTv)
    val lugar = view.findViewById<TextView>(R.id.lugarTV)

    fun render(evento: Evento){
        dateFormat(evento)
        val nameValue = "- " + evento.nombre
        val lugarValue = "- " + evento.ciudad + ", " + evento.pais
        nombre.text = nameValue
        lugar.text = lugarValue
    }

    private fun dateFormat(evento: Evento) {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val outputFormat = SimpleDateFormat("EEEE d 'de' MMMM 'de' yyyy", Locale("es", "ES"))
        val date = inputFormat.parse(evento.fecha)
        val fechaValue = date?.let { outputFormat.format(it) } + ", " + evento.hora
        fecha.text = fechaValue
    }
}