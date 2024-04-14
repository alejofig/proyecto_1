package com.misog11.sportapp.eventos

import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.models.Planes
import retrofit2.http.GET

interface EventosService {
    @GET("eventos")
    suspend fun getEventos():retrofit2.Response<List<Evento>>

    @GET("planes")
    suspend fun getPlanes():retrofit2.Response<List<Planes>>

}