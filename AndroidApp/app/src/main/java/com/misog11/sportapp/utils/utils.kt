package com.misog11.sportapp.utils

import android.content.Context
import android.content.Intent
import kotlin.random.Random

class utils {
    companion object {
        // Función dentro del companion object
        fun navigate(context: Context, viewState: Class<*>) {
            val intent = Intent(context, viewState)
            context.startActivity(intent)
        }
        fun guardarToken(context: Context, token: String) {
            val sharedPreferences = context.getSharedPreferences("prefs_auth", Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.putString("auth_token", token)
            editor.apply()  // Usa apply() en lugar de commit() para guardar el token de manera asincrónica
        }
        fun obtenerToken(context: Context): String? {
            val sharedPreferences = context.getSharedPreferences("prefs_auth", Context.MODE_PRIVATE)
            return sharedPreferences.getString("auth_token", null)
        }

        fun obtener_frase_motivacional(): String{
            val motivationalMessages = listOf(
                "Recuerda por qué empezaste: Piensa en tus metas iniciales y todo lo que has logrado hasta ahora. ¡No te rindas!",
                "Cada pequeño esfuerzo cuenta: Incluso los días en que no puedes dar el 100%, hacer algo es mejor que no hacer nada.",
                "Visualiza tu éxito: Imagina cómo te sentirás y lo bien que te verás después de alcanzar tus metas. Usa esa imagen para seguir adelante.",
                "La fuerza crece en los momentos cuando crees que no puedes seguir pero lo haces: Cada paso adicional es un paso hacia tu objetivo.",
                "No hay límites, solo obstáculos a superar: Cada desafío es una oportunidad para crecer y mejorar.",
                "El dolor de hoy es la fuerza del mañana: Lo que sientes ahora es temporal, pero el progreso que estás haciendo es duradero.",
                "Sé paciente y persistente: El progreso puede ser lento, pero si eres constante, verás resultados.",
                "Celebra cada victoria, no importa cuán pequeña: Cada logro es un paso hacia adelante en tu viaje.",
                "Encuentra un compañero de entrenamiento o únete a una comunidad: El apoyo puede hacer una gran diferencia en tu motivación y compromiso.",
                "Recuerda, el autocuidado es productivo: El ejercicio es una forma de cuidarte, no solo físicamente, sino también mentalmente y emocionalmente."
            )

            return motivationalMessages.random()
        }
    }
}