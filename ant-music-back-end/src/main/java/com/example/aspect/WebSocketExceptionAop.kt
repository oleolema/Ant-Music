package com.example.aspect

import com.example.bean.WebSocketResult
import com.example.bean.sendMessage
import com.example.exception.CouldCloseException
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketSession

/**
 * @author yueqiuhong
 * @date 2021-03-01 23:29
 */
@Aspect
@Component
class WebSocketExceptionAop {

    @Pointcut("execution(* com.example.websocket.MyMessageHandler.*(..))")
    fun pointcut() {
    }

    @Around(value = "pointcut()")
    fun exception(proceedingJoinPoint: ProceedingJoinPoint): Any {
        if (proceedingJoinPoint.args.isEmpty()) {
            return proceedingJoinPoint.proceed()
        }
        if (proceedingJoinPoint.args[0] !is WebSocketSession) {
            return proceedingJoinPoint.proceed(proceedingJoinPoint.args)
        }
        val session: WebSocketSession = proceedingJoinPoint.args[0] as WebSocketSession
        return try {
            proceedingJoinPoint.proceed(proceedingJoinPoint.args)
        } catch (e: CouldCloseException) {
            session.sendMessage(WebSocketResult.error(e))
            session.close()
            throw e
        } catch (e: Throwable) {
            e.printStackTrace()
            session.sendMessage(WebSocketResult.error(e))
        }
    }

}