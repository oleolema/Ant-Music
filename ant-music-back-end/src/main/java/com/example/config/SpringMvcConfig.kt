package com.example.config

import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


/**
 * @author yueqiuhong
 * @date 2021-02-04 20:26
 */
@Configuration
open class SpringMvcConfig : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**").allowedOrigins("*")
            .allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS")
            .allowCredentials(false).maxAge(3600)
    }

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(object : HandlerInterceptor {
            override fun postHandle(
                request: HttpServletRequest,
                response: HttpServletResponse,
                handler: Any,
                modelAndView: ModelAndView?
            ) {
                if (modelAndView != null && response.status == HttpStatus.NOT_FOUND.value()) {
                    response.status = HttpStatus.OK.value()
                    modelAndView.viewName = "index.html"
                }
            }

        })
    }
}