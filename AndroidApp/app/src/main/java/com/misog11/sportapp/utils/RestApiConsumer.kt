import android.util.Log
import com.google.gson.Gson
import io.ktor.client.HttpClient
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.withContext
import org.json.JSONArray

class RestApiConsumer {

    val client = HttpClient {}
    val gson = Gson()
    suspend inline fun <reified T, reified R> consumeApi(dto: T, endpointUrl: String): Deferred<R> {
        val json = gson.toJson(dto)
        Log.d(  "JSON",json)
        return withContext(Dispatchers.IO) {
            async {
                var response: String
                try {
                    response = client.post(endpointUrl) {
                        contentType(ContentType.Application.Json)
                        body = json
                    }
                } catch (e: Exception) {
                    Log.e("RestApiConsumer", "No ha sido posible realizar la conexion")
                    throw Exception("No ha sido posible realizar la conexion")
                }
                gson.fromJson(response, R::class.java)
            }
        }
    }
}