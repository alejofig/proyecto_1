package com.misog11.sportapp.adapter

import com.misog11.sportapp.models.Evento
import okhttp3.Response
import retrofit2.http.GET

interface EventosService {
    @GET("eventos")
    suspend fun getEventos():retrofit2.Response<List<Evento>>

}