package com.misog11.sportapp
/*
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.misog11.sportapp.adapter.EventosAdapter
import com.misog11.sportapp.adapter.EventosService
import com.misog11.sportapp.models.Evento
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import retrofit2.Response
import retrofit2.Retrofit

@ExperimentalCoroutinesApi
@RunWith(AndroidJUnit4::class)
class EventosActivityTest {

    private lateinit var activity: EventosActivity
    private lateinit var retrofit: Retrofit
    private val eventosService: EventosService = mockk()
    private val mockContext: Context = ApplicationProvider.getApplicationContext()

    @Before
    fun setUp() {
        Dispatchers.setMain(Dispatchers.Unconfined)

        // Mocking Retrofit and EventosService
        retrofit = mockk()
        coEvery { retrofit.create(EventosService::class.java) } returns eventosService
        activity = EventosActivity()
    }

    @Test
    fun testInitRecyclerEventos() = runTest {
        // Assume that we have a list of events
        val mockEventsList = listOf(
            Evento("1", "2024-04-08", "Event 1", "Description 1"),
            Evento("2", "2024-04-09", "Event 2", "Description 2")
        )

        // Prepare the response
        val response: Response<List<Evento>> = Response.success(mockEventsList)

        // Mocking the network call
        coEvery { eventosService.getEventos() } returns response

        // Call the method
        activity.initRecyclerEventos()

        // Verification steps would go here
        // For example, you can verify that the RecyclerView adapter is set and contains the expected items
        // This may require additional setup, such as capturing the RecyclerView and its adapter in the Activity
    }
}*/
