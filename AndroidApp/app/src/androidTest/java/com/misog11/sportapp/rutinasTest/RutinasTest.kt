package com.misog11.sportapp.rutinas

import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withId
import com.misog11.sportapp.R
import com.misog11.sportapp.RutinaAlimActivity
import com.misog11.sportapp.RutinaDescActivity
import org.junit.Test

class RutinasTest {
    @Test
    fun test_view_descanso() {
        ActivityScenario.launch(RutinaDescActivity::class.java)
        onView(withId(R.id.tvTiempoSuenoTitle)).check(matches(isDisplayed()))
        onView(withId(R.id.tvTiempoMeditacionTitle)).check(matches(isDisplayed()))
        onView(withId(R.id.tvTiempoRelajacionTitle)).check(matches(isDisplayed()))
        onView(withId(R.id.bottom_navigation)).check(matches(isDisplayed()))
    }
    @Test
    fun test_view_alimentacion() {
        ActivityScenario.launch(RutinaAlimActivity::class.java)
        onView(withId(R.id.tvCarbosTitle)).check(matches(isDisplayed()))
        onView(withId(R.id.tvProtesTitle)).check(matches(isDisplayed()))
        onView(withId(R.id.tvgrasTitle)).check(matches(isDisplayed()))
        onView(withId(R.id.bottom_navigation)).check(matches(isDisplayed()))
    }
}