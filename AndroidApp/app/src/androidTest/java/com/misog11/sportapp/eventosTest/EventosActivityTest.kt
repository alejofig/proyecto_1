package com.misog11.sportapp.eventosTest

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.misog11.sportapp.EventosActivity
import com.misog11.sportapp.R
import com.misog11.sportapp.eventos.EventosService
import com.misog11.sportapp.models.Evento

import org.junit.Test
import org.junit.runner.RunWith

import org.junit.Assert.*
import org.mockito.Mockito
import retrofit2.Response
import retrofit2.Retrofit

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class EventosActivityTest {

    @Test
    fun testNavigation() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), EventosActivity::class.java)
        val scenario = ActivityScenario.launch<EventosActivity>(intent)

        scenario.onActivity { activity ->
            // Simular clic en el botón de navegación
            activity.findViewById<BottomNavigationView>(R.id.bottom_navigation).selectedItemId = R.id.navigation_home

            // Verificar si se inició la actividad esperada
            // Esto requerirá un componente adicional para observar las intenciones lanzadas
        }
        // Crear un mock de Retrofit y del servicio de eventos
        val mockRetrofit = Mockito.mock(Retrofit::class.java)
        val mockService = Mockito.mock(EventosService::class.java)
        val mockResponse = Mockito.mock(Response::class.java)

        // Configurar el comportamiento esperado
        Mockito.`when`(mockRetrofit.create(EventosService::class.java)).thenReturn(mockService)
        //Mockito.`when`(mockService.getEventos()).thenReturn(mockResponse as Response<List<Evento>>?)
        Mockito.`when`(mockResponse.isSuccessful).thenReturn(true)

        val mockListOfEvents = null
        Mockito.`when`(mockResponse.body()).thenReturn(mockListOfEvents) // Supone una lista de eventos

        // Ejecutar la función que inicia el proceso de carga de eventos
        scenario.onActivity { activity ->
            activity.initRecyclerEventos()
            // Verificar que el RecyclerView se actualizó con los eventos
        }
    }

}