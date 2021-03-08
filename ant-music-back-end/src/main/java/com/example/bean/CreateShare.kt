package com.example.bean

import org.springframework.web.socket.WebSocketSession

/**
 * @author yueqiuhong
 * @date 2021-02-28 14:29
 */
data class CreateShare(
    var id: String,
    val type: String,
    val adminId: String? = null,
    var name: String,
    var session: WebSocketSession? = null,
    val shareList: MutableList<CreateShare> = mutableListOf(),
    var established: Boolean = false,
    var role: String = when (type) {
        CREATE -> ROLE_OWNER
        else -> ROLE_GUEST
    }
) {
    companion object {
        //  type 类型
        val CREATE = "create"
        val JOIN = "join"

        val ROLE_OWNER = "ROLE_OWNER"
        val ROLE_ADMIN = "ROLE_ADMIN"
        val ROLE_GUEST = "ROLE_GUEST"
    }

    fun toInfo(): Any {
        return mapOf(
            "id" to id,
            "type" to type,
            "adminId" to adminId,
            "name" to name,
            "role" to role,
        )
    }

    fun isOwner(): Boolean {
        return role == ROLE_OWNER
    }

    fun isAdmin(): Boolean {
        return isOwner() || role == ROLE_ADMIN
    }

    fun isGuest(): Boolean {
        return role == ROLE_GUEST
    }
}