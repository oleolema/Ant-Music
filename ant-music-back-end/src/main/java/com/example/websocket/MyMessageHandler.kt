package com.example.websocket


import com.example.bean.CreateShare
import com.example.bean.WebSocketResult
import com.example.bean.sendMessage
import com.example.constant.ShareConstant
import com.example.exception.CouldCloseException
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import org.springframework.web.socket.*
import org.springframework.web.socket.adapter.standard.StandardWebSocketSession
import java.util.concurrent.ConcurrentHashMap

open class MyMessageHandler : WebSocketHandler {
    companion object {
        //用户key
        const val ID = "_id"

        val GSON = Gson()

        /**
         * userMap:存储用户连接webscoket信息
         * @since JDK 1.7
         */
        private var shareMap: MutableMap<String, CreateShare> = ConcurrentHashMap(30)

        /**
         * getUserId:获取用户id
         * @author zhaoshouyun
         * @param session
         * @return
         * @since JDK 1.7
         */
        fun getCreateShare(session: WebSocketSession): CreateShare {
            try {
                return session.attributes[ID] as CreateShare
            } catch (e: Exception) {
                throw Exception("无效参数")
            }
        }

        /**
         * 获取房主
         */
        fun getAdmin(createShare: CreateShare): CreateShare {
            if (createShare.isOwner()) {
                return createShare
            }
            return shareMap[createShare.adminId ?: close("joinId不能为空")]
                .let { it ?: close("房主不在线") }
        }

        private fun close(message: String): Nothing {
            throw CouldCloseException(message)
        }
    }

    /**
     * 关闭websocket时调用该方法
     * @see org.springframework.web.socket.WebSocketHandler.afterConnectionClosed
     */
    @Throws(Exception::class)
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val createShare = getCreateShare(session)
//        连接建立失败时, 不需要执行清理动作 直接退出
        if (!createShare.established) {
            return
        }
        if (createShare.isOwner()) {
            createShare.shareList.filter { it.id != createShare.id }
                .forEach {
                    it.session?.run {
                        sendMessage(WebSocketResult.warn("房间已被解散"))
                        close()
                    }
                }
//                删除自己k
            shareMap.remove(createShare.id)
        } else {
//                删除房间中的自己
            val admin = getAdmin(createShare)
            admin.shareList.removeIf { it.id == createShare.id }
            admin.shareList.forEach {
                it.session?.sendMessage(WebSocketResult.warn("${createShare.name} 退出房间"))
                it.session?.sendMessage(
                    WebSocketResult.success(
                        ShareConstant.SHARER_LIST,
                        admin.shareList.map { i -> i.toInfo() })
                )
            }
        }
    }

    /**
     * 建立websocket连接时调用该方法
     * @see org.springframework.web.socket.WebSocketHandler.afterConnectionEstablished
     */
    @Throws(Exception::class)
    override fun afterConnectionEstablished(session: WebSocketSession) {
        session as StandardWebSocketSession
//      半小时未传输数据自动断开
        session.nativeSession.maxIdleTimeout = 1000 * 60 * 30
        val createShare = getCreateShare(session)
        createShare.session = session
        val admin = getAdmin(createShare)
        when (createShare.type) {
            CreateShare.CREATE -> {
                if (shareMap[createShare.id] != null) {
                    close("id已被占用, 请重试")
                } else {
                    shareMap[createShare.id] =
                        createShare.apply { shareList.add(createShare) }
                }
                session.sendMessage(WebSocketResult.successMessage("创建成功"))
            }
            CreateShare.JOIN -> {
                admin.shareList.forEach {
                    it.session?.sendMessage(WebSocketResult.successMessage("${createShare.name}加入房间"))
                }
                admin.shareList.add(createShare)
                session.sendMessage(WebSocketResult.successMessage("连接${admin.name}成功"))
//                从admin获取当前音乐
                admin.session?.sendMessage(WebSocketResult.success(ShareConstant.PUSH_MUSIC, createShare.id))
            }
            else -> close("不支持的类型: ${createShare.type}")
        }
        session.sendMessage(WebSocketResult.success(ShareConstant.SELF_INFO, createShare.toInfo()))
        admin.shareList.forEach {
            it.session?.sendMessage(
                WebSocketResult.success(
                    ShareConstant.SHARER_LIST,
                    admin.shareList.map { i -> i.toInfo() })
            )
        }
        createShare.established = true

    }

    /**
     * 传输过程出现异常时，调用该方法
     * @see org.springframework.web.socket.WebSocketHandler.handleTransportError
     */
    @Throws(Exception::class)
    override fun handleTransportError(session: WebSocketSession, e: Throwable) {
        println("Error: $e")
        session.sendMessage(WebSocketResult.error(e))
    }


    /**
     *
     * @see org.springframework.web.socket.WebSocketHandler.supportsPartialMessages
     */
    override fun supportsPartialMessages(): Boolean {
        return false
    }

    /**
     * 客户端调用websocket.send时候，会调用该方法,进行数据通信
     * @see org.springframework.web.socket.WebSocketHandler.handleMessage
     */
    @Throws(Exception::class)
    override fun handleMessage(session: WebSocketSession, message: WebSocketMessage<*>) {
        val createShare = getCreateShare(session)
//      连接建立失败时, 不需要执行清理动作 直接退出
        if (!createShare.established) {
            return
        }
        val webSocketResult = GSON.fromJson<WebSocketResult<Any>>(
            message.payload.toString(),
            object : TypeToken<WebSocketResult<Any>>() {}.type
        )
        if (webSocketResult.code != WebSocketResult.SUCCESS_CODE) {
            System.err.println(webSocketResult)
            return
        }
        val type = webSocketResult.type
        when {
            type.startsWith(ShareConstant.PULL_) -> pushMusicHandler(webSocketResult, createShare)
            type == ShareConstant.CHANGE_NAME -> changeNameHandler(webSocketResult, createShare)
            type == ShareConstant.CLOSE_CLIENT -> closeClientHandler(webSocketResult, createShare)
            else -> error("非法类型: $webSocketResult.type")
        }

    }

    private fun closeClientHandler(
        result: WebSocketResult<Any>,
        createShare: CreateShare,
    ) {
        assert(createShare.isOwner())
        val admin = getAdmin(createShare)
        val curSession = admin.shareList.first { it.id == result.data }.session ?: error("session 失效")
        curSession.sendMessage(WebSocketResult.warn("您被移除房间"))
        curSession.close()
    }

    private fun changeNameHandler(
        result: WebSocketResult<Any>,
        createShare: CreateShare,
    ) {
        val oldName = createShare.name
        val admin = getAdmin(createShare)
        createShare.name = result.data as String
        createShare.session?.sendMessage(WebSocketResult.success(ShareConstant.SELF_INFO, createShare.toInfo()))
        admin.shareList.forEach {
            it.session?.sendMessage(
                WebSocketResult.successMessage(
                    "[${oldName}]修改名称为: [${createShare.name}]"
                )
            )
            it.session?.sendMessage(
                WebSocketResult.success(
                    ShareConstant.SHARER_LIST,
                    admin.shareList.map { i -> i.toInfo() })
            )
        }
    }

    private fun pushMusicHandler(
        result: WebSocketResult<Any>,
        createShare: CreateShare,
    ) {
//        游客不允许推送音乐
        if (createShare.isGuest()) {
            return
        }
        when {
            // 全部发送 包括房主
            result.clientId == null -> {
                createShare.shareList.forEach { it.session?.sendMessage(TextMessage(GSON.toJson(result))) }
            }
            // 只发送给成员
            result.clientId!!.isBlank() -> createShare.shareList.filter { createShare.id != it.id }
                .forEach { it.session?.sendMessage(TextMessage(GSON.toJson(result))) }

            // 只发送给指定成员
            else -> createShare.shareList.first { it.id == result.clientId }.session
                ?.sendMessage(TextMessage(GSON.toJson(result)))
        }
    }


}