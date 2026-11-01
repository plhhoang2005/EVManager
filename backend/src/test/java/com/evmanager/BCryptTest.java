package com.evmanager;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {
    @Test
    public void generateHash() {
        System.out.println("HASH=" + new BCryptPasswordEncoder().encode("Password1!"));
    }
}
