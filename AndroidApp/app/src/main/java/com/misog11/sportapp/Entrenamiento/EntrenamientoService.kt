package com.misog11.sportapp.Entrenamiento

import com.misog11.sportapp.models.Entrenamiento
import com.misog11.sportapp.models.Indicadores
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST


interface EntrenamientoService {
    @POST("entrenamiento")
    suspend fun postEntrenamiento(@Body entrenamiento: Entrenamiento): retrofit2.Response<Any>

    @GET("/indicadores_atletismo")
    suspend fun getIndicadoresAtletismo(@Header("Authorization") authToken: String): retrofit2.Response<List<Indicadores>>

    @GET("/indicadores_ciclismo")
    suspend fun getIndicadoresCiclismo(@Header("Authorization") authToken: String): retrofit2.Response<List<Indicadores>>
}