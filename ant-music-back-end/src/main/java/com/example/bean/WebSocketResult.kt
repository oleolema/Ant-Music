package com.example.bean

import com.example.exception.CouldCloseException
import com.example.websocket.MyMessageHandler.Companion.getCreateShare
import com.google.gson.Gson
import com.google.gson.JsonElement
import com.google.gson.reflect.TypeToken
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import java.time.Instant

/**
 * @author yueqiuhong
 * @date 2021-02-27 17:39
 */
data class WebSocketResult<T>(
    val data: T,
    val type: String,
    val message: String,
    val code: Int,
    val sendTime: Long = Instant.now().toEpochMilli(),
    var clientId: String? = null,
) {

    companion object {
        const val SUCCESS_CODE = 200
        const val SUCCESS_MESSAGE_CODE = 201
        const val ERROR_CODE = 400
        const val WARN_CODE = 401
        val GSON = Gson()


        fun <T> success(type: String, data: T): WebSocketResult<T> {
            return WebSocketResult(data, type, "", SUCCESS_CODE)
        }

        fun successMessage(message: String): WebSocketResult<String> {
            return WebSocketResult("", "", message, SUCCESS_MESSAGE_CODE)
        }

        fun error(message: String?): WebSocketResult<String> {
            return WebSocketResult("", "", message ?: "未知错误", ERROR_CODE)
        }

        fun error(exception: Throwable): WebSocketResult<String> {
            return error(exception.message)
        }

        fun warn(message: String?): WebSocketResult<String> {
            return WebSocketResult("", "", message ?: "未知错误", WARN_CODE)
        }

        fun <T> fromJson(jsonElement: JsonElement, clazz: Class<T>): WebSocketResult<T> {
            return GSON.fromJson(jsonElement, object : TypeToken<WebSocketResult<T>>() {}.type)
        }

        fun <T> fromJson(json: String): WebSocketResult<T> {
            return GSON.fromJson(json, object : TypeToken<WebSocketResult<T>>() {}.type)
        }

    }

}

fun <T> WebSocketSession.sendMessage(result: WebSocketResult<T>) {
    try {
        result.clientId = getCreateShare(this).id
        println(WebSocketResult.GSON.toJson(result).toString())
        println(result)
        this.sendMessage(TextMessage(WebSocketResult.GSON.toJson(result).toString()))
    } catch (e: Exception) {
        throw CouldCloseException(e.message)
    }
}