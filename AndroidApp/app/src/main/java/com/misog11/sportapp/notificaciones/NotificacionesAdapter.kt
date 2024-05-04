package com.misog11.sportapp.eventos

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.R
import com.misog11.sportapp.models.Notificacion

class NotificacionesAdapter(private val notificationList:List<Notificacion>): RecyclerView.Adapter<NotificacionesViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificacionesViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        return NotificacionesViewHolder(layoutInflater.inflate(R.layout.notificacion, parent, false))
    }

    override fun getItemCount(): Int {
        return notificationList.size
    }

    override fun onBindViewHolder(holder: NotificacionesViewHolder, position: Int) {
        val item = notificationList[position]
        holder.render(item)
    }
}