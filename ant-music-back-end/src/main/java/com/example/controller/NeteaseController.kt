package com.example.controller

import com.example.utils.HttpUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.PostConstruct
import javax.servlet.http.HttpServletRequest

/**
 * @author yueqiuhong
 * @date 2021-03-08 21:25
 */
@RestController
open class NeteaseController() {

    companion object {
        val LOG: Logger = LoggerFactory.getLogger(NeteaseController::class.java)
    }

    @Value("\${music.server.host}")
    lateinit var serverHost: String

    @PostConstruct
    open fun init() {
        serverHost = serverHost.removeSuffix("/")
    }

    @PostMapping("/api/netease/**")
    open fun post(request: HttpServletRequest): String { val queryString = request.queryString ?: ""
        LOG.info(queryString)
        return HttpUtils.postForm("$serverHost${request.servletPath.removePrefix("/api/netease")}?timestamp=${System.currentTimeMillis()}", queryString)
    }


}