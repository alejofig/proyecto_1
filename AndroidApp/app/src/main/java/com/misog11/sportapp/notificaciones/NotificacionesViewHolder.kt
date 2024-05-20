package com.misog11.sportapp.eventos

import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView.ViewHolder
import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.R
import com.misog11.sportapp.models.Notificacion
import java.text.SimpleDateFormat
import java.util.Locale

class NotificacionesViewHolder(view:View): ViewHolder(view) {

    val nombre = view.findViewById<TextView>(R.id.nombreNt)

    fun render(notificacion: Notificacion){
        val nameValue = "- " + notificacion.nombre
        nombre.text = nameValue
    }

}