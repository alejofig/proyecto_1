package com.misog11.sportapp.Entrenamiento

import com.misog11.sportapp.models.Entrenamiento
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface EntrenamientoService {
    @POST("entrenamiento")
    suspend fun postEntrenamiento(@Body entrenamiento: Entrenamiento): Response<Any>
}