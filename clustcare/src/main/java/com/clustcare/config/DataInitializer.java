package com.clustcare.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.clustcare.model.Role;
import com.clustcare.model.User;
import com.clustcare.repository.UserRepository;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initSuperAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            String adminUsername = "admin";

            if (userRepository.existsByUsername(adminUsername)) {
                log.info("Super admin already exists. Skipping initialization.");
                return;
            }

            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setFirstName("Super");
            admin.setLastName("Admin");

            userRepository.save(admin);

            log.info("Super admin created successfully with username '{}'", adminUsername);
        };
    }
}
