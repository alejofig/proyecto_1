package com.misog11.sportapp.utils

import android.os.Handler
import io.mockk.mockk
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TimerControllerTest {

    @Test
    //validate updateTimer returns a string in the format HH:MM:SS
    fun test_updateTimer_updatesTimeViewInFormatHHMMSS() {
        val timerController = TimerController()
        val timeView = timerController.updateTimer()
        assertTrue(timeView.matches("\\d{2}:\\d{2}:\\d{2}".toRegex()))
    }

    @Test
    //validate updateTimer increments seconds by one every second
    fun test_updateTimer_incrementsSecondsByOneEverySecond() {
        val timerController = TimerController()
        val initialSeconds = timerController.getSeconds()
        timerController.updateTimer()

        assertEquals(initialSeconds + 1, timerController.getSeconds())
    }
    @Test
    //validate startTimer cancels existing timer
    fun test_startTimer_cancelsExistingTimer() {
        val timerController = TimerController()
        timerController.startTimer(mockk(), {}, {})
        val initialTimer = timerController.getTimer()

        timerController.startTimer(mockk(), {}, {})

        assertNotEquals(initialTimer, timerController.getTimer())
    }
}