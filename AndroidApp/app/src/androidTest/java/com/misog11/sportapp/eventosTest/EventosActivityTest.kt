import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.withText
import com.misog11.sportapp.R
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class EventosActivityTest {
    @Test
    fun testSample() {
        onView(withId(R.id.btn_eventos)).perform(click())
        onView(withId(R.id.btn_eventos)).check(matches(withText("Eventos")))
    }
}
