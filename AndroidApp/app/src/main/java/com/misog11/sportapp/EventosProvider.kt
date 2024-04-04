package com.misog11.sportapp

import com.misog11.sportapp.models.Evento

class EventosProvider {
    companion object {
        val EventosList = listOf<Evento>(
            Evento("2024-04-10","Media Maratón Cali", "Zoológico, Cali"),
            Evento("2024-04-13","La Maraton ETB", "ETB, Bogota"),
            Evento("2024-04-25","Ruta por la paz", "Intercontinental, Cali")
        )
    }
}