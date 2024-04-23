package com.misog11.sportapp.utils

import android.content.Context
import android.content.Intent
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
    }
}