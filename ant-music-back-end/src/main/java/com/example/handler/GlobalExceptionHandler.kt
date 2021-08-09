package com.example.handler

import com.example.bean.ApiResult
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

/**
 * @author yueqiuhong
 * @date 2021-03-01 12:50
 */
@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler
    fun exception(throwable: Throwable): ApiResult<String> {
        return ApiResult.fail(throwable.message)
    }

}