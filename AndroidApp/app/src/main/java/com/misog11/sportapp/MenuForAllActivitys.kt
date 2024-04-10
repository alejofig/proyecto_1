package com.misog11.sportapp

import android.content.Intent
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity

open class MenuForAllActivitys : AppCompatActivity() {

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {

        val menuInflater = menuInflater
        menuInflater.inflate(R.menu.bottom_menu,menu)
        return true

    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.navigation_home -> print("home")
            R.id.navigation_training -> navigate(DeporteActivity::class.java)
            R.id.navigation_events -> navigate(EventosActivity::class.java)

        }
        return true
    }

    private fun navigate(viewState:Class<*>){
        val intent = Intent(this, viewState)
        startActivity(intent)
    }

}