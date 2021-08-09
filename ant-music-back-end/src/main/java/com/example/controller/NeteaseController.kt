package com.example.controller

import com.example.utils.HttpUtils
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.util.UriUtils
import javax.annotation.PostConstruct
import javax.servlet.http.HttpServletRequest

/**
 * @author yueqiuhong
 * @date 2021-03-08 21:25
 */
@RestController
class NeteaseController {

    @Value("\${music.server.host}")
    lateinit var serverHost: String

    @PostConstruct
    fun init() {
        serverHost = serverHost.removeSuffix("/")
    }

    @RequestMapping("/api/netease/**")
    fun get(request: HttpServletRequest): String {
        val params = request.parameterMap.map { entry -> "${UriUtils.encode(entry.key, Charsets.UTF_8)}=${entry.value.joinToString(",") { UriUtils.encode(it, Charsets.UTF_8) }}" }.joinToString("&")
        println(params)
        return HttpUtils.get("$serverHost${request.servletPath.removePrefix("/api/netease")}?$params")
    }


}