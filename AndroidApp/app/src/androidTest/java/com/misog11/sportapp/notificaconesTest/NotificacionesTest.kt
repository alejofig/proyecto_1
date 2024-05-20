import android.content.Context
import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import com.auth0.android.Auth0
import com.auth0.android.result.Credentials
import com.misog11.sportapp.MainActivity
import com.misog11.sportapp.R
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import com.auth0.android.callback.Callback
import com.auth0.android.provider.WebAuthProvider
import com.misog11.sportapp.EntrenamientoActivity
import com.misog11.sportapp.EventosActivity
import com.misog11.sportapp.eventos.EventosService
import com.misog11.sportapp.models.Evento
import com.misog11.sportapp.models.Planes
import io.mockk.coEvery
import io.mockk.mockk
import okhttp3.mockwebserver.Dispatcher
import org.mockito.ArgumentMatchers.any
import org.junit.Before
import org.junit.After
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.RecordedRequest
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

@RunWith(AndroidJUnit4::class)
class NotificacionesTest {
    @Before
    fun setupSharedPreferences() {

    }

    @Test
    fun Inicio() {
        // Lanzar la actividad
        ActivityScenario.launch(MainActivity::class.java)

        //onView(withId(R.id.loginBtn)).perform(click())
        onView(withId(R.id.loginBtn)).check(matches(withText("INICIAR SESION")))
    }

    @Test
    fun GoNotificaciones(){
        ActivityScenario.launch(EntrenamientoActivity::class.java)
        Thread.sleep(3000)
        onView(withId(R.id.ivBell)).perform(click())
        Thread.sleep(3000)
        onView(withId(R.id.recyclerNotificaciones)).check(matches(isDisplayed()))
    }



}
