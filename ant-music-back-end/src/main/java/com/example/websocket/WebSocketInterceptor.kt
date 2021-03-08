package com.example.websocket

import com.example.bean.CreateShare
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpRequest
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor
import java.util.*


class WebSocketInterceptor : HttpSessionHandshakeInterceptor() {
    /**
     * TODO 简单描述该方法的实现功能（可选）.
     * @see org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor.beforeHandshake
     */
    @Throws(Exception::class)
    override fun beforeHandshake(
        request: ServerHttpRequest, response: ServerHttpResponse, wsHandler: WebSocketHandler,
        attributes: MutableMap<String, Any>
    ): Boolean {
        if (request is ServletServerHttpRequest) {
            //获取参数
            var id: String? = request.servletRequest.getParameter("id")
            val type: String = request.servletRequest.getParameter("type") ?: error("type 无效")
            val adminId: String? = request.servletRequest.getParameter("adminId")
            val name: String? = request.servletRequest.getParameter("name")
            id = id ?: when (type) {
                CreateShare.CREATE -> "admin-${UUID.randomUUID()}"
                CreateShare.JOIN -> "guest-${UUID.randomUUID()}"
                else -> throw Exception("无效的参数type:$type")
            }
            attributes[MyMessageHandler.ID] = CreateShare(
                id = id,
                type = type,
                adminId = adminId,
                name = name ?: id,
            )
        }
        return true
    }
}