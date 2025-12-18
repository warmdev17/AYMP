package com.datingapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CouplesAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(CouplesAppApplication.class, args);
    }
}

