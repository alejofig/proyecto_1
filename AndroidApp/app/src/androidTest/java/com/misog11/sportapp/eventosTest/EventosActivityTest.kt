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
class EventosActivityTest {
    @Before
    fun setupSharedPreferences() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val sharedPreferences = context.getSharedPreferences("prefs_auth", Context.MODE_PRIVATE)
        with(sharedPreferences.edit()) {
            putString("auth_token", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGT0wxY0ZTZ1FXNU5kV0EtWGtwUCJ9.eyJpc3MiOiJodHRwczovL2Rldi1zOHF3bm5ndXdjdXBxZzJvLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NjFiMjdjZmMzMmNhOGQ4NDM0NzQyYWYiLCJhdWQiOlsiaHR0cHM6Ly9zcG9ydGFwcC5jb20iLCJodHRwczovL2Rldi1zOHF3bm5ndXdjdXBxZzJvLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MTM4NDU0NTIsImV4cCI6MTcxMzkzMTg1Miwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6IlFuM204RnVMSVhLUUExZ0xmTkplUWY2YXpBTVlXS2pBIiwicGVybWlzc2lvbnMiOltdfQ.Tc7bgV3l0wEppmcnXJ_-O9OtcDPGyJp_Z5PXkuayAW1FjY7fSLrvJq_75tEJegZoXgq-AdDGjuwv-VY30OLRIFrPs4FMY7ZX6EJ45w0YbZLvpYvgJ9nf76bZn7j4uOAjFxeB4J5GG72Wtpwcj8h7oEg2moCZiYfJS7oE_Gp8QxaYH0DCdC-TIWq_Bs3EYWxHW6sFpc0Dz8He9Xt5VO_zbiQUrM80YLB4MZ1JrAPqbJ5rwe6c_lhBOi8IzLf_JxAnS1ElbtSWLRXDwpzi0M5fbLBjoU8A1q375_z3bOPuAbHhsPPQWMsqOHgvLLiWx8JJL_D3LLlfLdBMNcJCtQDmTg")
            commit()
        }
    }

    @Test
    fun Inicio() {
        // Lanzar la actividad
        ActivityScenario.launch(MainActivity::class.java)

        //onView(withId(R.id.loginBtn)).perform(click())
        onView(withId(R.id.loginBtn)).check(matches(withText("INICIAR SESION")))
    }

    @Test
    fun FakeEventos(){
        ActivityScenario.launch(EventosActivity::class.java)
        Thread.sleep(10000)
        onView(withId(R.id.recyclerEvents)).check(matches(isDisplayed()))
        onView(withId(R.id.calendarViewItem)).check(matches(isDisplayed()))
    }



}
