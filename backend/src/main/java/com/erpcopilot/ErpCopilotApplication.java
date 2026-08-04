package com.erpcopilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ERP Copilot AI — Spring Boot Application Entry Point.
 *
 * <p>Enterprise SaaS ERP system with AI-powered natural language interface.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
public class ErpCopilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpCopilotApplication.class, args);
    }
}
