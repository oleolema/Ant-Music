
import org.junit.jupiter.api.Test
import java.util.*
import java.util.Map
import kotlin.collections.component1
import kotlin.collections.component2

/**
 * @author yueqiuhong
 * @date 2021-05-19 0:11
 */
class KotlinTest {

    @Test
    fun test1() {

    }

    @Test
    fun test2() {
        val map = Map.of("a", 1, "b", 2)
        for ((key, value) in map) {
            println("$key: $value")
        }
        map.forEach { (a, b) -> println("$a: $b") }
        map.forEach { println("${it.key}: ${it.value}") }
    }

    fun String.encodeBase64(): String {
        return Base64.getEncoder().encodeToString(this.encodeToByteArray())
    }

    @Test
    fun test() {
        val encode = "Hello".encodeBase64()
        println(encode)
    }


}