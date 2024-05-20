import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.misog11.sportapp.EntrenamientoActivity
import com.misog11.sportapp.R
import org.hamcrest.CoreMatchers.not
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class EntrenamientoActivityTest {
    /**
    @Test
    fun test_entrenamientoActivity() {
        ActivityScenario.launch(EntrenamientoActivity::class.java)

        onView(withId(R.id.containerFTP)).check(matches(not(isDisplayed())))
        onView(withId(R.id.ivBackArrow)).perform(click())
        onView(withId(R.id.tvTrainingTitle)).perform(click())
        onView(withId(R.id.tvTimer)).check(matches(withText("00:00:00")))
        onView(withId(R.id.btnIniciar)).check(matches(withText("INICIAR")))
    }
    @Test
    fun test_entrenamientoActivity_iniciarButton() {
        ActivityScenario.launch(EntrenamientoActivity::class.java)

        onView(withId(R.id.btnIniciar)).perform(click())

        onView(withId(R.id.btnIniciar)).check(matches(withText("PAUSAR")))
        onView(withId(R.id.tvActiveCalories)).check(matches(withText("0")))
        onView(withId(R.id.tvTotalCaloriesLabel)).check(matches(withText("0")))
        onView(withId(R.id.tvTimer)).check(matches(not(withText("00:00:00"))))
    }**/

    @Test
    fun test_entrenamientoActivity_finishButton() {
        ActivityScenario.launch(EntrenamientoActivity::class.java)

        onView(withId(R.id.btnFinish)).perform(click())

        onView(withId(R.id.btnIniciar)).check(matches(withText("INICIAR")))
        onView(withId(R.id.tvTimer)).check(matches(withText("00:00:00")))
        onView(withId(R.id.tvActiveCalories)).check(matches(withText("0")))
        onView(withId(R.id.tvTotalCaloriesLabel)).check(matches(withText("0")))
    }

}