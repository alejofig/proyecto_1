import android.util.Log
import com.google.gson.Gson
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.withContext

class RestApiConsumer {

    val client = HttpClient {}
    val gson = Gson()
    //POST CONSUMER
    suspend inline fun <reified T, reified R> consumeApiPost(dto: T, endpointUrl: String,token: String): Deferred<R> {
        val json = gson.toJson(dto)
        val tokenBearer = "Bearer"+" "+token

        Log.d(  "JSON",json)
        return withContext(Dispatchers.IO) {
            async {
                var response: String
                try {
                    response = client.post(endpointUrl) {
                        contentType(ContentType.Application.Json)
                        header ("Authorization", tokenBearer)
                        body = json
                    }
                } catch (e: Exception) {
                    Log.e("RestApiConsumer POST", "No ha sido posible realizar la conexion")
                    Log.e("RestApiConsumer POST ERROR", e.toString())
                    throw Exception("No ha sido posible realizar la conexion")
                }
                gson.fromJson(response, R::class.java)
            }
        }
    }

    //GET CONSUMER
    suspend inline fun <reified R> consumeApiGet(endpointUrl: String,token: String): Deferred<R> {
        val tokenBearer = "Bearer"+" "+token
        return withContext(Dispatchers.IO) {
            async {
                var response: String
                try {
                    response = client.get(endpointUrl) {
                        header("Authorization",tokenBearer)
                    }
                    Log.i("RESPONSE=========", response)
                } catch (e: Exception) {
                    Log.e("RestApiConsumer GET", "No ha sido posible realizar la conexion")
                    Log.e("RestApiConsumer GET ERROR", e.toString())
                    throw Exception("No ha sido posible realizar la conexion")
                }
                gson.fromJson(response, R::class.java)
            }
        }
    }
}