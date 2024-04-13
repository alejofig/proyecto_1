package com.misog11.sportapp

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import com.auth0.android.Auth0
import com.auth0.android.authentication.AuthenticationException
import com.auth0.android.provider.WebAuthProvider
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.auth0.android.result.Credentials
import com.auth0.android.callback.Callback
import com.google.android.material.snackbar.Snackbar
import com.misog11.sportapp.databinding.ActivityMainBinding
import com.misog11.sportapp.utils.utils
import com.misog11.sportapp.utils.utils.Companion.guardarToken
import com.misog11.sportapp.utils.utils.Companion.navigate

class MainActivity : MenuForAllActivitys() {
    private lateinit var account: Auth0
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        //val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        //bottomNavigationView.setOnNavigationItemSelectedListener { item ->
        //    when (item.itemId) {
        //        R.id.navigation_home -> print("home")
        //        R.id.navigation_training -> navigate(this, EntrenamientoActivity::class.java)
        //        R.id.navigation_events -> navigate(this, EventosActivity::class.java)
        //    }
        //    true
        //}
        //Configurar Opcion de login
        account = Auth0(
            getString(R.string.com_auth0_client_id),
            getString(R.string.com_auth0_domain)
        )

        val loginBtn = findViewById<Button>(R.id.loginBtn)
        loginBtn.setOnClickListener { loginWithBrowser() }
    }

    //private fun navigate(viewState:Class<*>){
    //    val intent = Intent(this, viewState)
    //    startActivity(intent)
    //}

    private fun loginWithBrowser() {
        // Setup the WebAuthProvider, using the custom scheme and scope.

        WebAuthProvider.login(account)
            .withScheme("demo")
            .withScope("openid profile email")
            // Launch the authentication passing the callback where the results will be received
            .start(this, object : Callback<Credentials, AuthenticationException> {
                // Called when there is an authentication failure
                override fun onFailure(error: AuthenticationException) {
                    showSnackBar("Failure: ${error.getCode()}")
                }

                // Called when authentication completed successfully
                override fun onSuccess(result: Credentials) {
                    // Get the access token from the credentials object.
                    // This can be used to call APIs
                    val accessToken = result.accessToken
                    procesarToken(accessToken)
                    navegarPantallaPrincipal()
                }
            })
    }

    private fun showSnackBar(text: String) {
        Snackbar.make(
            binding.root,
            text,
            Snackbar.LENGTH_LONG
        ).show()
    }

    private  fun procesarToken(accessToken: String) {
        // Código para procesar el token, como guardarlo o enviarlo a otra parte de la app
        guardarToken(this, accessToken) // Llamada a la función que guarda el token
    }

    private fun navegarPantallaPrincipal(){
        navigate(this, EntrenamientoActivity::class.java)
    }

}