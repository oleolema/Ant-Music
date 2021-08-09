package com.example.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * @author yueqiuhong
 * @date 2021-02-27 17:19
 */
@RestController
@RequestMapping("/")
class HelloController() {

    @GetMapping("hello")
    fun hello(): String {
        return "hello"
    }

}