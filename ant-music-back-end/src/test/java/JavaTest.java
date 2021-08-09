import org.junit.jupiter.api.Test;

import java.util.Base64;
import java.util.List;
import java.util.Map;

/**
 * @author yueqiuhong
 * @date 2021/5/19
 */
public class JavaTest {

    @Test
    public void test1() {
        List.of("a", "b", "c", "d").forEach(it -> System.out.println(it.toUpperCase()));
    }

    @Test
    public void test2() {
        Map<String, Integer> map = Map.of("a", 1, "b", 2);
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        map.forEach((a, b) -> System.out.println(a + ": " + b));
        // 报错
//        map.forEach(entry -> System.out.println(entry.getKey() + ": " + entry.getValue()));
    }

    String encodeBase64(String message) {
        return Base64.getEncoder().encodeToString(message.getBytes());
    }

    @Test
    public void transformInt() {
        String encode = encodeBase64("Hello");
        System.out.println(encode);
    }

}