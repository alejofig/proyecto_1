package com.misog11.sportapp.eventos

import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.models.Planes
import retrofit2.http.GET
import retrofit2.http.Header

interface EventosService {
    @GET("eventos")
    suspend fun getEventos(@Header("Authorization") authToken: String):retrofit2.Response<List<Evento>>

    @GET("planes")
    suspend fun getPlanes(@Header("Authorization") authToken: String):retrofit2.Response<List<Planes>>

}