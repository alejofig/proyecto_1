import android.view.ViewGroup
import com.misog11.sportapp.eventos.EventosAdapter
import com.misog11.sportapp.eventos.EventosUtils
import com.misog11.sportapp.models.Evento
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.mockito.Mock


class EventosTest {

    @Mock
    private lateinit var mockContext: ViewGroup
    private lateinit var eventosAdapter: EventosAdapter
    private lateinit var eventosList: List<Evento>

    @Before
    fun setup() {
        eventosList =  listOf(
            Evento(fecha = "2022-01-01", hora = "10:00", nombre = "Evento 1", pais = "País A", ciudad = "Ciudad X"),
            Evento(fecha = "2022-02-01", hora = "12:00", nombre = "Evento 2", pais = "País B", ciudad = "Ciudad Y"),
            Evento(fecha = "2022-03-01", hora = "14:00", nombre = "Evento 3", pais = "País C", ciudad = "Ciudad Z")
        )
        eventosAdapter = EventosAdapter(eventosList)
    }

    @Test
    fun itemCount_isCorrect() {
        assertEquals(eventosList.size, eventosAdapter.itemCount)
    }

    @Test
    fun date_format_correct(){
        EventosUtils()
        val text_value = EventosUtils.getDateFormat(Evento(fecha = "2024-04-10", hora = "10:00", nombre = "Evento 1", pais = "País A", ciudad = "Ciudad X"))
        assertEquals(text_value.contains("miércoles"), true)
        assertEquals(text_value.contains("2024"), true)
        assertEquals(text_value.contains("de"), true)
        assertEquals(text_value.contains("10"), true)
        assertEquals(text_value.contains("abril"), true)

    }


}
