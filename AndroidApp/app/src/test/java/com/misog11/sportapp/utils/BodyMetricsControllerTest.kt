package com.misog11.sportapp.utils
import com.misog11.sportapp.models.UserDTO
import org.junit.Assert.*
import org.junit.Test

class BodyMetricsControllerTest {

    @Test
    // BodyMetricsController can be instantiated with a valid UserDTO object
    fun test_instantiation_with_valid_UserDTO() {
        val userDTO = UserDTO(1, 25.0, 29,Constants.generoMasculino, 180)
        val bodyMetricsController = BodyMetricsController(userDTO)
        assertNotNull(bodyMetricsController)
    }

    @Test
    // updateFCM returns an integer value based on the user's age
    fun test_updateFCM_returns_integer_based_on_age_male() {
        val userDTO = UserDTO(2, 25.0,15 ,Constants.generoMasculino, 180)
        val bodyMetricsController = BodyMetricsController(userDTO)
        val expectedFCM = 205
        val actualFCM = bodyMetricsController.updateFCM()
        assertEquals(expectedFCM, actualFCM)
    }

    @Test
    // updateFCM returns an integer value based on the user's age
    fun test_updateFCM_returns_integer_based_on_age_female() {
        val userDTO = UserDTO(3, 22.0, 32,Constants.generoFemenino, 160)
        val bodyMetricsController = BodyMetricsController(userDTO)
        val expectedFCM = 188
        val actualFCM = bodyMetricsController.updateFCM()
        assertEquals(expectedFCM, actualFCM)
    }

    @Test
    //updateFCM returns an integer value
    fun test_updateFCM_returns_integer_value() {
        val userDTO = UserDTO(4, 25.0, 65,Constants.generoMasculino, 180)
        val bodyMetricsController = BodyMetricsController(userDTO)
        val fcm = bodyMetricsController.updateFCM()
        assertTrue(fcm is Int)
    }

    @Test
    //updateCalories is called with an invalid sport parameter
    fun test_updateCalories_withInvalidSportParameter() {
        val userDTO = UserDTO(5, 25.0,23,Constants.generoMasculino, 180)
        val bodyMetricsController = BodyMetricsController(userDTO)
        bodyMetricsController.updateCalories("invalid_sport")

        assertEquals(0.0, bodyMetricsController.getCaloriesBurned(),0.01)
        assertEquals(0.0, bodyMetricsController.getCalories(),0.01)
    }

    @Test
    // calculateCaloriesInRepose returns a double value based on the user's weight, height, age, and gender
    fun test_calculateCaloriesInRepose_returns_double_based_on_user_properties() {
        val userDTO = UserDTO(6, 25.0,45 ,Constants.generoMasculino, 180)
        val bodyMetricsController = BodyMetricsController(userDTO)
        val expectedCaloriesInRepose = 1155.0
        val actualCaloriesInRepose = bodyMetricsController.calculateCaloriesInRepose()
        assertEquals(expectedCaloriesInRepose, actualCaloriesInRepose, 0.01)
    }
}