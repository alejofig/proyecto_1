package com.misog11.sportapp.eventos

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
        val nameValue = "- " + evento.nombre
        val lugarValue = "- " + evento.ciudad + ", " + evento.pais
        nombre.text = nameValue
        lugar.text = lugarValue
        fecha.text = EventosUtils.getDateFormat(evento)
    }

}