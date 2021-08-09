package com.example

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.EnableAspectJAutoProxy

/**
 * @author yueqiuhong
 * @date 2021-02-27 17:18
 */
@SpringBootApplication
@EnableAspectJAutoProxy
open class AntMusicBackEndApplication

fun main(args: Array<String>) {
    SpringApplication.run(AntMusicBackEndApplication::class.java, *args)
}
