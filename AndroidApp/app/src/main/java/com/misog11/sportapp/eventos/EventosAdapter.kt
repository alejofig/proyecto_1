package com.misog11.sportapp.eventos

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.R

class EventosAdapter(private val eventosList:List<Evento>): RecyclerView.Adapter<EventosViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EventosViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        return EventosViewHolder(layoutInflater.inflate(R.layout.item_evento, parent, false))
    }

    override fun getItemCount(): Int {
        return eventosList.size
    }

    override fun onBindViewHolder(holder: EventosViewHolder, position: Int) {
        val item = eventosList[position]
        holder.render(item)
    }
}